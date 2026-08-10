from django.urls import path

from .views import (
    CreateReviewAPIView,
    MyReviewsAPIView,
    ReviewVisibilityAPIView,
    TailorReviewListAPIView,
)

urlpatterns = [
    path('tailors/<uuid:tailor_id>/', TailorReviewListAPIView.as_view(), name='tailor_reviews'),
    path('', CreateReviewAPIView.as_view(), name='create_review'),
    path('mine/', MyReviewsAPIView.as_view(), name='my_reviews'),
    path('<uuid:review_id>/visibility/', ReviewVisibilityAPIView.as_view(), name='review_visibility'),
]
