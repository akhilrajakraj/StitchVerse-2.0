from django.urls import path

from .views import (
    CreateStitchRequestAPIView,
    CustomerStitchRequestListAPIView,
    DetailedStitchRequestAPIView,
    GarmentCategoryListAPIView,
    StitchRequestImageListAPIView,
    TailorStitchRequestActionAPIView,
    TailorStitchRequestListAPIView,
)

urlpatterns = [
    path('stitchreq/', CreateStitchRequestAPIView.as_view(), name='create_stitchreq'),
    path('garment-categories/', GarmentCategoryListAPIView.as_view(), name='garment_category_list'),
    path('my-stitchreq/', CustomerStitchRequestListAPIView.as_view(), name='stitchreq_list'),
    path('stitchreq/<uuid:stitch_request_id>/', DetailedStitchRequestAPIView.as_view(), name='detailed_stitchreq'),
    path('tailor/stitchreq/', TailorStitchRequestListAPIView.as_view(), name='tailor_stitchreq_list'),
    path('tailor/stitchreq/<uuid:stitch_request_id>/action/', TailorStitchRequestActionAPIView.as_view(), name='tailor_stitchreq_action'),
    path('stitchreq/<uuid:stitch_request_id>/images/', StitchRequestImageListAPIView.as_view(), name='stitchreq_images'),
]
