from django.urls import path

from .views import(
    CreateDesignAPIView,
    DesignCategoryListAPIView,
    TailorDesignListAPIView,
    TailorDesignDetailAPIView,
)

urlpatterns = [
    
    path(
        'upload/',
        CreateDesignAPIView.as_view(),
        name='create_design',
        
    ),
    
    path(
        'categories/',
        DesignCategoryListAPIView.as_view(),
        name='category_list',
    ),
    
    path(
        'portfolio/me/',
        TailorDesignListAPIView.as_view(),
        name='my_portfolio',
    ),
    
    path(
        '<uuid:design_id>/',
        TailorDesignDetailAPIView.as_view(),
        name='design_detail',
    )
    
]
