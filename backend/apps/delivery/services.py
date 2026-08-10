from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import DeliveryAssignment, DeliveryLocationLog, DeliveryStatus


_ALLOWED_TRANSITIONS = {
    DeliveryStatus.ASSIGNED: {DeliveryStatus.PICKED_UP, DeliveryStatus.FAILED_ATTEMPT},
    DeliveryStatus.PICKED_UP: {DeliveryStatus.IN_TRANSIT, DeliveryStatus.FAILED_ATTEMPT},
    DeliveryStatus.IN_TRANSIT: {DeliveryStatus.DELIVERED, DeliveryStatus.FAILED_ATTEMPT},
    DeliveryStatus.FAILED_ATTEMPT: {DeliveryStatus.PICKED_UP, DeliveryStatus.IN_TRANSIT},
    DeliveryStatus.DELIVERED: set(),
}


class DeliveryService:
    @staticmethod
    @transaction.atomic
    def create_assignment(*, stitch_request, agent, delivery_address):
        if hasattr(stitch_request, 'delivery_assignment'):
            raise ValidationError('This stitch request already has a delivery assignment.')
        return DeliveryAssignment.objects.create(
            stitch_request=stitch_request,
            agent=agent,
            delivery_address=delivery_address,
        )

    @staticmethod
    @transaction.atomic
    def transition(assignment, target_status, *, proof_image=None, proof_note=''):
        if target_status not in _ALLOWED_TRANSITIONS.get(assignment.status, set()):
            raise ValidationError(
                f'Cannot move delivery from {assignment.status} to {target_status}.'
            )
        assignment.status = target_status
        now = timezone.now()
        if target_status == DeliveryStatus.PICKED_UP:
            assignment.picked_up_at = now
        if target_status == DeliveryStatus.DELIVERED:
            assignment.delivered_at = now
            if proof_image:
                assignment.proof_image = proof_image
            assignment.proof_note = proof_note
        fields = ['status']
        if target_status == DeliveryStatus.PICKED_UP:
            fields.append('picked_up_at')
        if target_status == DeliveryStatus.DELIVERED:
            fields.extend(['delivered_at', 'proof_image', 'proof_note'])
        assignment.save(update_fields=fields)
        return assignment

    @staticmethod
    @transaction.atomic
    def record_location(*, assignment, latitude, longitude):
        if assignment.status == DeliveryStatus.DELIVERED:
            raise ValidationError('Cannot record location for a delivered assignment.')
        profile = assignment.agent.delivery_profile
        profile.current_lat = latitude
        profile.current_lng = longitude
        profile.save(update_fields=['current_lat', 'current_lng'])
        return DeliveryLocationLog.objects.create(
            assignment=assignment,
            latitude=latitude,
            longitude=longitude,
        )
