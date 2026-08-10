from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CreateMeasurementAPIView,
    CustomTokenObtainPairView,
    CustomerProfileAPIView,
    DeleteMeasurementAPIView,
    RegisterCustomerAPIView,
    UpdateMeasurementAPIView,
    ViewCustomerMeasurementsAPIView,
)

app_name = "accounts"

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterCustomerAPIView.as_view(), name="register_customer"),
    path("profile/", CustomerProfileAPIView.as_view(), name="customer_profile"),
    path("measurements/", CreateMeasurementAPIView.as_view(), name="create_measurement"),
    path("measurements/view/", ViewCustomerMeasurementsAPIView.as_view(), name="view_measurements"),
    path(
        "measurements/<uuid:measurement_id>/",
        UpdateMeasurementAPIView.as_view(),
        name="update_measurement",
    ),
    path(
        "measurements/<uuid:measurement_id>/delete/",
        DeleteMeasurementAPIView.as_view(),
        name="delete_measurement",
    ),
]
