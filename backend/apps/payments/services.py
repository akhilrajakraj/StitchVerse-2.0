from django.db import transaction
from django.utils import timezone

from .models import Payment, PaymentStatus, EscrowStatus


class PaymentService:
    @staticmethod
    @transaction.atomic
    def mark_paid(payment: Payment, *, gateway_payment_id='', gateway_signature=''):
        if payment.status not in {PaymentStatus.PENDING, PaymentStatus.FAILED}:
            raise ValueError('Payment cannot be marked paid from its current state.')
        payment.status = PaymentStatus.PAID
        payment.paid_at = timezone.now()
        payment.gateway_payment_id = gateway_payment_id
        payment.gateway_signature = gateway_signature
        payment.escrow_status = EscrowStatus.HELD
        payment.save(update_fields=['status', 'paid_at', 'gateway_payment_id', 'gateway_signature', 'escrow_status'])
        return payment

    @staticmethod
    @transaction.atomic
    def release_escrow(payment: Payment):
        if payment.status != PaymentStatus.PAID:
            raise ValueError('Only paid payments can release escrow.')
        payment.escrow_status = EscrowStatus.RELEASED
        payment.save(update_fields=['escrow_status'])
        return payment

    @staticmethod
    @transaction.atomic
    def refund(payment: Payment):
        if payment.status != PaymentStatus.PAID:
            raise ValueError('Only paid payments can be refunded.')
        payment.status = PaymentStatus.REFUNDED
        payment.escrow_status = EscrowStatus.REFUNDED
        payment.refunded_at = timezone.now()
        payment.save(update_fields=['status', 'escrow_status', 'refunded_at'])
        return payment
