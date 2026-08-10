from django.db import transaction
from django.db.models import Avg

from .models import Review
from apps.tailors.models import TailorProfile


class ReviewService:
    @staticmethod
    @transaction.atomic
    def create_review(*, reviewer, tailor, rating, comment, feedback_type, stitch_request=None, design_order=None):
        review = Review.objects.create(
            reviewer=reviewer, tailor=tailor, rating=rating, comment=comment,
            feedback_type=feedback_type, stitch_request=stitch_request,
            design_order=design_order,
        )
        average = Review.objects.filter(tailor=tailor, is_visible=True).aggregate(value=Avg('rating'))['value'] or 0
        TailorProfile.objects.filter(user=tailor).update(average_rating=average)
        return review
