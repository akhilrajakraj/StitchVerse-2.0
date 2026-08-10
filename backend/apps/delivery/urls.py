from django.urls import path

from .views_api import DeliveryDetailAPIView, DeliveryLocationAPIView, DeliveryTransitionAPIView

urlpatterns = [
    path('<uuid:assignment_id>/', DeliveryDetailAPIView.as_view(), name='delivery_detail'),
    path('<uuid:assignment_id>/transition/', DeliveryTransitionAPIView.as_view(), name='delivery_transition'),
    path('<uuid:assignment_id>/location/', DeliveryLocationAPIView.as_view(), name='delivery_location'),
]
