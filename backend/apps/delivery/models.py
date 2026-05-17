import uuid
from django.db import models
from apps.accounts.models import CustomUser, Address
from apps.orders.models import StitchRequest

# Create your models here.

class DeliveryStatus(models.TextChoices):
    ASSIGNED       = 'assigned',       'Assigned'
    PICKED_UP      = 'picked_up',      'Picked Up'
    IN_TRANSIT     = 'in_transit',     'In Transit'
    DELIVERED      = 'delivered',      'Delivered'
    FAILED_ATTEMPT = 'failed_attempt', 'Failed Attempt'

class DeliveryAgentProfile(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user          = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='delivery_profile')
    full_name     = models.CharField(max_length=100)
    phone         = models.CharField(max_length=15)
    vehicle_type  = models.CharField(max_length=50, blank=True)
    vehicle_no    = models.CharField(max_length=20, blank=True)
    is_available  = models.BooleanField(default=True)
    current_lat   = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_lng   = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'delivery_agent_profiles'


class DeliveryAssignment(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stitch_request = models.OneToOneField(StitchRequest, on_delete=models.CASCADE,
                                           related_name='delivery_assignment')
    agent          = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True,
                                        related_name='deliveries')
    delivery_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    status         = models.CharField(max_length=20, choices=DeliveryStatus.choices,
                                       default=DeliveryStatus.ASSIGNED, db_index=True)
    proof_image    = models.ImageField(upload_to='delivery_proofs/', null=True, blank=True)
    proof_note     = models.TextField(blank=True)
    assigned_at    = models.DateTimeField(auto_now_add=True)
    picked_up_at   = models.DateTimeField(null=True, blank=True)
    delivered_at   = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'delivery_assignments'
        indexes  = [models.Index(fields=['agent', 'status'])]


class DeliveryLocationLog(models.Model):
    """Real-time breadcrumb trail from delivery agent."""
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment   = models.ForeignKey(DeliveryAssignment, on_delete=models.CASCADE,
                                      related_name='location_logs')
    latitude     = models.DecimalField(max_digits=9, decimal_places=6)
    longitude    = models.DecimalField(max_digits=9, decimal_places=6)
    recorded_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'delivery_location_logs'
        ordering = ['recorded_at']

