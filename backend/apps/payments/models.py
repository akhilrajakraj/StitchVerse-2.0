import uuid
from django.db import models

from apps.accounts.models import CustomUser
from apps.orders.models import StitchRequest, DesignOrder

# Create your models here.

class PaymentStatus(models.TextChoices):
    PENDING   = 'pending',   'Pending'
    PAID      = 'paid',      'Paid'
    FAILED    = 'failed',    'Failed'
    REFUNDED  = 'refunded',  'Refunded'

class EscrowStatus(models.TextChoices):
    HELD     = 'held',     'Held'
    RELEASED = 'released', 'Released'
    REFUNDED = 'refunded', 'Refunded'


class PaymentMode(models.TextChoices):
    CARD   = 'card',   'Card'
    UPI    = 'upi',    'UPI'
    WALLET = 'wallet', 'Wallet'
    COD    = 'cod',    'Cash on Delivery'

# ──────────────────────────────────────────────
# PAYMENTS (payments app)
# ──────────────────────────────────────────────

class Payment(models.Model):
    """
    Unified payment record for both StitchRequest and DesignOrder.
    Replaces the unsafe legacy `payment` table (raw card data removed).
    """
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payer               = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                             related_name='payments')
    # Polymorphic reference — only one will be set
    stitch_request      = models.ForeignKey(StitchRequest, on_delete=models.SET_NULL,
                                             null=True, blank=True, related_name='payments')
    design_order        = models.ForeignKey(DesignOrder, on_delete=models.SET_NULL,
                                             null=True, blank=True, related_name='payments')
    amount              = models.DecimalField(max_digits=10, decimal_places=2)
    currency            = models.CharField(max_length=5, default='INR')
    payment_mode        = models.CharField(max_length=20, choices=PaymentMode.choices)
    status              = models.CharField(max_length=20, choices=PaymentStatus.choices,
                                            default=PaymentStatus.PENDING, db_index=True)
    escrow_status       = models.CharField(max_length=20, choices=EscrowStatus.choices,
                                            default=EscrowStatus.HELD)
    # Gateway fields — never store raw card data
    gateway_name        = models.CharField(max_length=50, blank=True)   # Razorpay, Stripe …
    gateway_order_id    = models.CharField(max_length=100, blank=True)
    gateway_payment_id  = models.CharField(max_length=100, blank=True)
    gateway_signature   = models.CharField(max_length=255, blank=True)
    paid_at             = models.DateTimeField(null=True, blank=True)
    refunded_at         = models.DateTimeField(null=True, blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
        indexes  = [models.Index(fields=['status', 'escrow_status'])]

    def __str__(self):
        return f'Payment {self.id} – {self.status} ({self.amount} {self.currency})'


class Refund(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment         = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='refund')
    amount          = models.DecimalField(max_digits=10, decimal_places=2)
    reason          = models.TextField()
    gateway_refund_id = models.CharField(max_length=100, blank=True)
    initiated_by    = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    processed_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'refunds'
