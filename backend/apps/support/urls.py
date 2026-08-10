from django.urls import path

from .views import (
    DisputeListCreateAPIView,
    DisputeResolveAPIView,
    SupportTicketDetailAPIView,
    SupportTicketListCreateAPIView,
    SupportTicketMessageAPIView,
    SupportTicketUpdateAPIView,
)

urlpatterns = [
    path('tickets/', SupportTicketListCreateAPIView.as_view(), name='ticket-list-create'),
    path('tickets/<uuid:ticket_id>/', SupportTicketDetailAPIView.as_view(), name='ticket-detail'),
    path('tickets/<uuid:ticket_id>/messages/', SupportTicketMessageAPIView.as_view(), name='ticket-message'),
    path('tickets/<uuid:ticket_id>/manage/', SupportTicketUpdateAPIView.as_view(), name='ticket-manage'),
    path('disputes/', DisputeListCreateAPIView.as_view(), name='dispute-list-create'),
    path('disputes/<uuid:dispute_id>/', DisputeResolveAPIView.as_view(), name='dispute-resolve'),
]
