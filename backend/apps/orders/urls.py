from django.urls import path

from .views import(
    CreateStitchRequestAPIView,
    GarmentCategoryListAPIView,
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
    )
]