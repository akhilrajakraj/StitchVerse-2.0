from django.urls import path

from .views import(
    CreateStitchRequestAPIView,
    GarmentCategoryListAPIView,
    CustomerStitchRequestDetailAPIView,
)

urlpatterns = [
    
    path(
        'stitchreq/',
        CreateStitchRequestAPIView.as_view(),
        name='create_stitchreq',
    ),
    
    path(
        'garment-categories/',
        GarmentCategoryListAPIView.as_view(),
        name='garment_category_list',
    ),
    
    path(
        'my-stitchreq/',
        CustomerStitchRequestDetailAPIView.as_view(),
        name='stitchreq_detail',
    )
]