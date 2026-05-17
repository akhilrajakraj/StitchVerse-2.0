import uuid
from django.db import models

from apps.accounts.models import CustomUser
from apps.orders.models import StitchRequest, DesignOrder

# Create your models here.

class SupportTicketStatus(models.TextChoices):
    OPEN        = 'open',        'Open'
    IN_PROGRESS = 'in_progress', 'In Progress'
    RESOLVED    = 'resolved',    'Resolved'
    CLOSED      = 'closed',      'Closed'

class DisputeStatus(models.TextChoices):
    OPEN     = 'open',     'Open'
    REVIEWED = 'reviewed', 'Reviewed'
    RESOLVED = 'resolved', 'Resolved'
    REJECTED = 'rejected', 'Rejected'

class SupportAgentProfile(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='support_profile')
    full_name  = models.CharField(max_length=100)
    phone      = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'support_agent_profiles'
# ──────────────────────────────────────────────
# SUPPORT (support app)
# ──────────────────────────────────────────────

class SupportTicket(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raised_by       = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                         related_name='support_tickets')
    assigned_to     = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True,
                                         blank=True, related_name='assigned_tickets')
    stitch_request  = models.ForeignKey(StitchRequest, on_delete=models.SET_NULL, null=True,
                                         blank=True)
    design_order    = models.ForeignKey(DesignOrder, on_delete=models.SET_NULL, null=True,
                                         blank=True)
    subject         = models.CharField(max_length=255)
    description     = models.TextField()
    status          = models.CharField(max_length=20, choices=SupportTicketStatus.choices,
                                        default=SupportTicketStatus.OPEN, db_index=True)
    priority        = models.CharField(max_length=10,
                                        choices=[('low','Low'),('medium','Medium'),('high','High')],
                                        default='medium')
    created_at      = models.DateTimeField(auto_now_add=True)
    resolved_at     = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'support_tickets'


class SupportTicketMessage(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket     = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender     = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    body       = models.TextField()
    attachment = models.FileField(upload_to='support_attachments/', null=True, blank=True)
    sent_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'support_ticket_messages'
        ordering = ['sent_at']


class Dispute(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket         = models.ForeignKey(SupportTicket, on_delete=models.CASCADE,
                                        related_name='disputes')
    raised_by      = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status         = models.CharField(max_length=20, choices=DisputeStatus.choices,
                                       default=DisputeStatus.OPEN)
    resolution     = models.TextField(blank=True)
    resolved_by    = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True,
                                        blank=True, related_name='resolved_disputes')
    created_at     = models.DateTimeField(auto_now_add=True)
    resolved_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'disputes'
