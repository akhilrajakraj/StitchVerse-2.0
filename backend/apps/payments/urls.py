from django.urls import path

from .views import CreatePaymentAPIView, ConfirmPaymentAPIView, PaymentDetailAPIView, CreateRefundAPIView

urlpatterns = [
    path('', CreatePaymentAPIView.as_view(), name='create_payment'),
    path('<uuid:payment_id>/', PaymentDetailAPIView.as_view(), name='payment_detail'),
    path('<uuid:payment_id>/confirm/', ConfirmPaymentAPIView.as_view(), name='confirm_payment'),
    path('<uuid:payment_id>/refund/', CreateRefundAPIView.as_view(), name='create_refund'),
]
