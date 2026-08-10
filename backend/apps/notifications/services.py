from django.db import transaction
from django.utils import timezone

from .models import Notification, NotificationChannel, NotificationTemplate


class NotificationService:
    @staticmethod
    @transaction.atomic
    def create(*, recipient, title, body, channel=NotificationChannel.IN_APP, related_object=None, template=None):
        related_type = ''
        related_id = ''
        if related_object is not None:
            related_type = related_object.__class__.__name__.lower()
            related_id = str(related_object.pk)
        return Notification.objects.create(
            recipient=recipient,
            template=template,
            channel=channel,
            title=title,
            body=body,
            related_object_type=related_type,
            related_object_id=related_id,
            sent_at=timezone.now() if channel == NotificationChannel.IN_APP else None,
        )

    @staticmethod
    def notify_event(*, recipient, event_key, context=None, related_object=None):
        template = NotificationTemplate.objects.filter(event_key=event_key, is_active=True).first()
        if not template:
            return None
        context = context or {}
        subject = template.subject.format(**context)
        body = template.body
        for key, value in context.items():
            body = body.replace('{{ ' + key + ' }}', str(value))
        return NotificationService.create(
            recipient=recipient,
            title=subject,
            body=body,
            channel=template.channel,
            related_object=related_object,
            template=template,
        )

    @staticmethod
    @transaction.atomic
    def mark_read(notification, *, recipient):
        if notification.recipient_id != recipient.id:
            raise PermissionError('Notification does not belong to this user.')
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save(update_fields=['is_read', 'read_at'])
        return notification
