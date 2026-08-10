from django.db import transaction
from django.db.models import Avg, Count
from rest_framework.exceptions import ValidationError

from .models import FeedbackType, Review


class ReviewService:
    @staticmethod
    @transaction.atomic
    def create_review(*, reviewer, tailor, rating, comment, feedback_type, stitch_request=None, design_order=None):
        if reviewer == tailor:
            raise ValidationError('You cannot review yourself.')
        if not 1 <= rating <= 5:
            raise ValidationError('Rating must be between 1 and 5.')

        if feedback_type == FeedbackType.STITCH_REQUEST:
            if not stitch_request or stitch_request.customer_id != reviewer.id or stitch_request.tailor_id != tailor.id:
                raise ValidationError('Invalid stitch request for this review.')
            if Review.objects.filter(reviewer=reviewer, stitch_request=stitch_request).exists():
                raise ValidationError('You have already reviewed this stitch request.')
        elif feedback_type == FeedbackType.DESIGN_PURCHASE:
            if not design_order or design_order.customer_id != reviewer.id or design_order.design.tailor_id != tailor.id:
                raise ValidationError('Invalid design order for this review.')
            if Review.objects.filter(reviewer=reviewer, design_order=design_order).exists():
                raise ValidationError('You have already reviewed this design order.')
        else:
            raise ValidationError('Invalid feedback type.')

        review = Review.objects.create(
            reviewer=reviewer, tailor=tailor, rating=rating, comment=comment,
            feedback_type=feedback_type, stitch_request=stitch_request,
            design_order=design_order,
        )
        ReviewService.refresh_tailor_rating(tailor)
        return review

    @staticmethod
    def refresh_tailor_rating(tailor):
        stats = Review.objects.filter(tailor=tailor, is_visible=True).aggregate(
            average=Avg('rating'), count=Count('id')
        )
        from apps.tailors.models import TailorProfile
        TailorProfile.objects.filter(user=tailor).update(
            average_rating=stats['average'] or 0,
            total_reviews=stats['count'] or 0,
        )
