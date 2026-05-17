import uuid
from django.db import models

from apps.accounts.models import (
    CustomUser,
    Measurement,
    Address
)

from apps.designs.models import Design

# Create your models here.

class OrderStatus(models.TextChoices):
    PENDING             = 'pending',             'Pending'
    ACCEPTED            = 'accepted',            'Accepted'
    STITCHING           = 'stitching',           'Stitching'
    QUALITY_CHECK       = 'quality_check',       'Quality Check'
    READY_FOR_DELIVERY  = 'ready_for_delivery',  'Ready for Delivery'
    OUT_FOR_DELIVERY    = 'out_for_delivery',     'Out for Delivery'
    DELIVERED           = 'delivered',           'Delivered'
    CANCELLED           = 'cancelled',           'Cancelled'

class DesignOrderStatus(models.TextChoices):
    PAYMENT_PENDING = 'payment_pending', 'Payment Pending'
    PAID            = 'paid',            'Paid'
    SHIPPED         = 'shipped',         'Shipped'
    DELIVERED       = 'delivered',       'Delivered'
    CANCELLED       = 'cancelled',       'Cancelled'

# ──────────────────────────────────────────────
# STITCH REQUESTS — Custom tailoring orders (orders app)
# ──────────────────────────────────────────────

class StitchRequest(models.Model):
    """
    Customer's custom stitching order. Replaces legacy `stitchreq` table.
    Fully normalised: measurements referenced by FK, not embedded text.
    """
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer         = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                         related_name='stitch_requests')
    tailor           = models.ForeignKey(CustomUser, on_delete=models.SET_NULL,
                                         null=True, blank=True, related_name='received_requests')
    name             = models.CharField(max_length=255)           # garment name / title
    garment_type     = models.CharField(max_length=100)           # Shirt, Skirt, Trouser …
    fabric           = models.CharField(max_length=100)
    color            = models.CharField(max_length=80, blank=True)
    pattern          = models.CharField(max_length=80, blank=True)
    design_details   = models.TextField()
    instructions     = models.TextField(blank=True)
    measurement      = models.ForeignKey(Measurement, on_delete=models.SET_NULL, null=True, blank=True)
    reference_design = models.ForeignKey(Design, on_delete=models.SET_NULL, null=True, blank=True)
    expected_date    = models.DateField(null=True, blank=True)
    quoted_price     = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status           = models.CharField(max_length=30, choices=OrderStatus.choices,
                                        default=OrderStatus.PENDING, db_index=True)
    submitted_at     = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stitch_requests'
        indexes  = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['tailor', 'status']),
        ]

    def __str__(self):
        return f'#{self.id} – {self.name} ({self.status})'


class StitchRequestImage(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stitch_request  = models.ForeignKey(StitchRequest, on_delete=models.CASCADE, related_name='images')
    image           = models.ImageField(upload_to='stitch_requests/')
    uploaded_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stitch_request_images'


class OrderStatusLog(models.Model):
    """
    Immutable audit trail of every status transition on a stitch request.
    """
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stitch_request  = models.ForeignKey(StitchRequest, on_delete=models.CASCADE,
                                         related_name='status_logs')
    from_status     = models.CharField(max_length=30, choices=OrderStatus.choices, blank=True)
    to_status       = models.CharField(max_length=30, choices=OrderStatus.choices)
    changed_by      = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    note            = models.TextField(blank=True)
    changed_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_status_logs'
        ordering = ['changed_at']


# ──────────────────────────────────────────────
# DESIGN ORDERS — Purchase of a tailor's design (orders app)
# ──────────────────────────────────────────────

class DesignOrder(models.Model):
    """
    Replaces legacy `orderdesign` table.
    A customer buys a ready design from a tailor's portfolio.
    """
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer     = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                      related_name='design_orders')
    design       = models.ForeignKey(Design, on_delete=models.PROTECT, related_name='orders')
    quantity     = models.PositiveSmallIntegerField(default=1)
    unit_price   = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status       = models.CharField(max_length=20, choices=DesignOrderStatus.choices,
                                     default=DesignOrderStatus.PAYMENT_PENDING, db_index=True)
    delivery_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    order_date   = models.DateField()
    ordered_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'design_orders'
        indexes  = [models.Index(fields=['customer', 'status'])]

    def __str__(self):
        return f'DesignOrder #{self.id} – {self.status}'
