from django.db import transaction
from django.utils import timezone

from .models import StitchRequest, StitchRequestImage, OrderStatus, OrderStatusLog, GarmentCategory


ALLOWED_TRANSITIONS = {
    OrderStatus.PENDING: {OrderStatus.ACCEPTED, OrderStatus.CANCELLED},
    OrderStatus.ACCEPTED: {OrderStatus.STITCHING, OrderStatus.CANCELLED},
    OrderStatus.STITCHING: {OrderStatus.QUALITY_CHECK, OrderStatus.CANCELLED},
    OrderStatus.QUALITY_CHECK: {OrderStatus.READY_FOR_DELIVERY, OrderStatus.STITCHING},
    OrderStatus.READY_FOR_DELIVERY: {OrderStatus.OUT_FOR_DELIVERY},
    OrderStatus.OUT_FOR_DELIVERY: {OrderStatus.DELIVERED},
    OrderStatus.DELIVERED: set(),
    OrderStatus.CANCELLED: set(),
}


class StitchRequestServices:
    @staticmethod
    def list_garment_categories():
        return GarmentCategory.objects.filter(is_active=True)

    @staticmethod
    @transaction.atomic
    def create_stitch_request(customer, tailor=None, uploaded_images=None, **data):
        request = StitchRequest.objects.create(
            customer=customer,
            tailor=tailor,
            **data,
        )
        OrderStatusLog.objects.create(
            stitch_request=request,
            from_status='',
            to_status=OrderStatus.PENDING,
            changed_by=customer,
            note='Request created',
        )
        for image_file in uploaded_images or []:
            StitchRequestImage.objects.create(stitch_request=request, image=image_file)
        return request

    @staticmethod
    @transaction.atomic
    def transition(request: StitchRequest, to_status: str, actor, note: str = ''):
        if to_status not in OrderStatus.values:
            raise ValueError('Invalid order status.')
        if to_status not in ALLOWED_TRANSITIONS.get(request.status, set()):
            raise ValueError(f'Cannot transition from {request.status} to {to_status}.')
        previous = request.status
        request.status = to_status
        request.updated_at = timezone.now()
        request.save(update_fields=['status', 'updated_at'])
        OrderStatusLog.objects.create(
            stitch_request=request,
            from_status=previous,
            to_status=to_status,
            changed_by=actor,
            note=note,
        )
        return request
