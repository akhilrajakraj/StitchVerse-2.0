import uuid
from django.db import models
from apps.accounts.models import CustomUser

# Create your models here.

class NotificationChannel(models.TextChoices):
    IN_APP = 'in_app', 'In App'
    EMAIL  = 'email',  'Email'
    SMS    = 'sms',    'SMS'
    PUSH   = 'push',   'Push'

# ──────────────────────────────────────────────
# NOTIFICATIONS (notifications app)
# ──────────────────────────────────────────────

class NotificationTemplate(models.Model):
    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_key = models.CharField(max_length=100, unique=True)
    subject   = models.CharField(max_length=255)
    body      = models.TextField(help_text='Jinja2 template. Use {{ variable }} syntax.')
    channel   = models.CharField(max_length=20, choices=NotificationChannel.choices)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'notification_templates'


class Notification(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient   = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                     related_name='notifications')
    template    = models.ForeignKey(NotificationTemplate, on_delete=models.SET_NULL,
                                     null=True, blank=True)
    channel     = models.CharField(max_length=20, choices=NotificationChannel.choices)
    title       = models.CharField(max_length=255)
    body        = models.TextField()
    is_read     = models.BooleanField(default=False)
    related_object_type  = models.CharField(max_length=60, blank=True)  # e.g. 'stitch_request'
    related_object_id    = models.CharField(max_length=36, blank=True)  # UUID as string
    sent_at     = models.DateTimeField(null=True, blank=True)
    read_at     = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        indexes  = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['recipient', 'created_at']),
        ]
