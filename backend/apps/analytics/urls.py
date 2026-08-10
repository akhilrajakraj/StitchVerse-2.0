from django.urls import path

from .views import PlatformAnalyticsAPIView, TailorAnalyticsAPIView

urlpatterns = [
    path('tailor/', TailorAnalyticsAPIView.as_view(), name='tailor-analytics'),
    path('platform/', PlatformAnalyticsAPIView.as_view(), name='platform-analytics'),
]
