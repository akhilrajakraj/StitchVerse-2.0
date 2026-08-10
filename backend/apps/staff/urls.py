from django.urls import path

from .views import StaffQualityCheckAPIView, StaffTailorApprovalAPIView, StaffUserStatusAPIView

urlpatterns = [
    path('tailors/<uuid:profile_id>/approval/', StaffTailorApprovalAPIView.as_view(), name='staff_tailor_approval'),
    path('users/<uuid:user_id>/status/', StaffUserStatusAPIView.as_view(), name='staff_user_status'),
    path('quality-check/<uuid:stitch_request_id>/', StaffQualityCheckAPIView.as_view(), name='staff_quality_check'),
]
