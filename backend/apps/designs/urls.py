from django.urls import path

from .views import(
    CreateDesignAPIView,
    DesignCategoryListAPIView,
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
    )
    
]
