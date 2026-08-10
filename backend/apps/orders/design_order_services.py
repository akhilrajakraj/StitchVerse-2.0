from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import DesignOrder, DesignOrderStatus


class DesignOrderServices:
    """Transactional business operations for ready-made design purchases."""

    @staticmethod
    @transaction.atomic
    def create_order(customer, design, quantity, delivery_address):
        if not design.is_active:
            raise ValidationError('This design is no longer available.')
        if quantity < 1:
            raise ValidationError('Quantity must be at least 1.')
        if delivery_address is None:
            raise ValidationError('A delivery address is required.')

        unit_price = Decimal(design.price)
        total_amount = unit_price * quantity
        return DesignOrder.objects.create(
            customer=customer,
            design=design,
            quantity=quantity,
            unit_price=unit_price,
            total_amount=total_amount,
            status=DesignOrderStatus.PAYMENT_PENDING,
            delivery_address=delivery_address,
            order_date=timezone.localdate(),
        )

    @staticmethod
    @transaction.atomic
    def cancel_order(order, customer):
        if order.customer_id != customer.id:
            raise ValidationError('You do not own this order.')
        if order.status != DesignOrderStatus.PAYMENT_PENDING:
            raise ValidationError('Only unpaid design orders can be cancelled.')
        order.status = DesignOrderStatus.CANCELLED
        order.save(update_fields=['status', 'updated_at'])
        return order
