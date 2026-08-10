from django.db import transaction
from django.utils import timezone

from apps.accounts.models import CustomUser, UserRole

from .models import Dispute, DisputeStatus, SupportTicket, SupportTicketMessage, SupportTicketStatus


class SupportService:
    @staticmethod
    @transaction.atomic
    def create_ticket(*, raised_by, **data):
        return SupportTicket.objects.create(raised_by=raised_by, **data)

    @staticmethod
    @transaction.atomic
    def add_message(*, ticket, sender, body, attachment=None):
        return SupportTicketMessage.objects.create(
            ticket=ticket, sender=sender, body=body, attachment=attachment
        )

    @staticmethod
    @transaction.atomic
    def update_ticket(*, ticket, actor, status=None, priority=None, assigned_to=None):
        if status is not None:
            if status == SupportTicketStatus.RESOLVED:
                ticket.resolved_at = timezone.now()
            elif ticket.status == SupportTicketStatus.RESOLVED and status != SupportTicketStatus.RESOLVED:
                ticket.resolved_at = None
            ticket.status = status
        if priority is not None:
            ticket.priority = priority
        if assigned_to is not None:
            ticket.assigned_to = assigned_to
        ticket.save(update_fields=['status', 'priority', 'assigned_to', 'resolved_at'])
        return ticket

    @staticmethod
    def can_manage(user):
        return user.is_authenticated and (user.is_staff or user.role in {UserRole.SUPPORT, UserRole.ADMIN})


class DisputeService:
    @staticmethod
    @transaction.atomic
    def create(*, raised_by, ticket):
        if ticket.raised_by_id != raised_by.id:
            raise PermissionError('Only the ticket owner can raise a dispute.')
        return Dispute.objects.create(ticket=ticket, raised_by=raised_by)

    @staticmethod
    @transaction.atomic
    def resolve(*, dispute, actor, status, resolution=''):
        if not DisputeService.can_manage(actor):
            raise PermissionError('Support staff access required.')
        if status not in {DisputeStatus.RESOLVED, DisputeStatus.REJECTED, DisputeStatus.REVIEWED}:
            raise ValueError('Invalid dispute resolution status.')
        dispute.status = status
        dispute.resolution = resolution
        dispute.resolved_by = actor
        dispute.resolved_at = timezone.now() if status in {DisputeStatus.RESOLVED, DisputeStatus.REJECTED} else None
        dispute.save(update_fields=['status', 'resolution', 'resolved_by', 'resolved_at'])
        return dispute

    @staticmethod
    def can_manage(user):
        return SupportService.can_manage(user)
