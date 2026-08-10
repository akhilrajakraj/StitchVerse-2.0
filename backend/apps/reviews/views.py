from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import CustomUser
from .models import FeedbackType, Review
from .serializers import CreateReviewSerializer, ReviewSerializer
from .services import ReviewService


class TailorReviewListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, tailor_id):
        reviews = Review.objects.filter(
            tailor_id=tailor_id,
            is_visible=True,
        ).select_related('reviewer').order_by('-created_at')
        return Response({'success': True, 'reviews': ReviewSerializer(reviews, many=True).data})


class CreateReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tailor = CustomUser.objects.filter(id=serializer.validated_data.pop('tailor')).first()
        if not tailor:
            return Response({'detail': 'Tailor not found.'}, status=status.HTTP_404_NOT_FOUND)
        review = ReviewService.create(reviewer=request.user, tailor=tailor, **serializer.validated_data)
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class MyReviewsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(reviewer=request.user).select_related('tailor').order_by('-created_at')
        return Response({'success': True, 'reviews': ReviewSerializer(reviews, many=True).data})


class ReviewVisibilityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, review_id):
        review = Review.objects.filter(id=review_id).first()
        if not review:
            return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        if not request.user.is_staff:
            return Response({'detail': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
        review.is_visible = bool(request.data.get('is_visible', True))
        review.save(update_fields=['is_visible'])
        ReviewService.refresh_tailor_rating(review.tailor)
        return Response(ReviewSerializer(review).data)
