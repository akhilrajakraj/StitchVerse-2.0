from django.urls import path

from .views import(
    CreateDesignAPIView,
)

urlpatterns = [
    
    path(
        'upload/',
        CreateDesignAPIView.as_view(),
        name='create_design',
        
    )
]
