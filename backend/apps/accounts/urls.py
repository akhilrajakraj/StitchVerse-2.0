from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import(
    CustomTokenObtainPairView,
    RegisterCustomerAPIView,
    CreateMeasurementAPIView,
    CustomerProfileAPIView,
)

urlpatterns = [
    
    path(
        'login/',
        CustomTokenObtainPairView.as_view(),
        name='login',
    ),
    
    path(
        'refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh',
    ),
    
    path(
        'register/',
        RegisterCustomerAPIView.as_view(),
        name='register_customer',
    ),
    
    path(
        'profile/',
        CustomerProfileAPIView.as_view(),
        name='customer_profile',
    ),
    
    path(
        'measurements/',
        CreateMeasurementAPIView.as_view(),
        name='create_measurement',
    )
]
