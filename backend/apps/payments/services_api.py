from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.orders.models import DesignOrder, DesignOrderStatus, StitchRequest

from .models import Payment, PaymentStatus, Refund
from .services import PaymentService


class PaymentAPIServices:
    @staticmethod
    @transaction.atomic
    def create_payment(*, payer, payment_mode, stitch_request_id=None, design_order_id=None):
        if bool(stitch_request_id) == bool(design_order_id):
            raise ValidationError('Exactly one order reference is required.')

        if stitch_request_id:
            order = StitchRequest.objects.select_for_update().filter(
                id=stitch_request_id, customer=payer
            ).first()
            if not order:
                raise ValidationError('Stitch request not found.')
            if order.quoted_price is None or Decimal(order.quoted_price) <= 0:
                raise ValidationError('A valid quotation is required before payment.')
            amount = Decimal(order.quoted_price)
            if Payment.objects.filter(stitch_request=order, status=PaymentStatus.PAID).exists():
                raise ValidationError('This stitch request has already been paid.')
            return Payment.objects.create(
                payer=payer,
                stitch_request=order,
                amount=amount,
                payment_mode=payment_mode,
                currency='INR',
            )

        order = DesignOrder.objects.select_for_update().filter(
            id=design_order_id, customer=payer
        ).first()
        if not order:
            raise ValidationError('Design order not found.')
        if order.status != DesignOrderStatus.PAYMENT_PENDING:
            raise ValidationError('This design order is not awaiting payment.')
        if Payment.objects.filter(design_order=order, status=PaymentStatus.PAID).exists():
            raise ValidationError('This design order has already been paid.')
        return Payment.objects.create(
            payer=payer,
            design_order=order,
            amount=Decimal(order.total_amount),
            payment_mode=payment_mode,
            currency='INR',
        )

    @staticmethod
    @transaction.atomic
    def confirm_payment(payment, *, gateway_payment_id='', gateway_signature=''):
        if payment.status not in {PaymentStatus.PENDING, PaymentStatus.FAILED}:
            raise ValidationError('Payment cannot be confirmed from its current state.')
        paid = PaymentService.mark_paid(
            payment,
            gateway_payment_id=gateway_payment_id,
            gateway_signature=gateway_signature,
        )
        if paid.design_order_id:
            DesignOrder.objects.filter(id=paid.design_order_id).update(
                status=DesignOrderStatus.PAID
            )
        return paid

    @staticmethod
    @transaction.atomic
    def create_refund(payment, *, initiated_by, reason):
        if payment.status != PaymentStatus.PAID:
            raise ValidationError('Only paid payments can be refunded.')
        if hasattr(payment, 'refund'):
            raise ValidationError('A refund already exists for this payment.')
        PaymentService.refund(payment)
        return Refund.objects.create(
            payment=payment,
            amount=payment.amount,
            reason=reason,
            initiated_by=initiated_by,
        )
