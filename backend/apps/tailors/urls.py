from django.urls import path

from .views import (
    RegisterTailorAPIView,
    TailorProfileAPIView,
    TailorListAPIView,
    TailorApprovalAPIView,
)

urlpatterns = [
    path('register/', RegisterTailorAPIView.as_view(), name='register_tailor'),
    path('profile/', TailorProfileAPIView.as_view(), name='tailor_profile'),
    path('list/', TailorListAPIView.as_view(), name='tailor_list'),
    path('approval/<uuid:profile_id>/', TailorApprovalAPIView.as_view(), name='tailor_approval'),
]
