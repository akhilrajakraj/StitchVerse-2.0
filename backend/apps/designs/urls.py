from django.urls import path

from .views import (
    CreateDesignAPIView,
    DesignCategoryListAPIView,
    DesignDetailAPIView,
    DesignListAPIView,
    TailorDesignDetailAPIView,
    TailorDesignListAPIView,
)

urlpatterns = [
    path('', DesignListAPIView.as_view(), name='design_list'),
    path('upload/', CreateDesignAPIView.as_view(), name='create_design'),
    path('categories/', DesignCategoryListAPIView.as_view(), name='category_list'),
    path('portfolio/me/', TailorDesignListAPIView.as_view(), name='my_portfolio'),
    path('portfolio/<uuid:design_id>/', TailorDesignDetailAPIView.as_view(), name='my_design_detail'),
    path('<uuid:design_id>/', DesignDetailAPIView.as_view(), name='design_detail'),
]
