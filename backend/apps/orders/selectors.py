from django.db.models import Q

from .models import StitchRequest, DesignOrder


class StitchRequestSelectors:
    @staticmethod
    def get_stitch_request_by_id(stitch_request_id, customer=None, tailor=None):
        queryset = StitchRequest.objects.select_related(
            'customer', 'tailor', 'garment_type', 'measurement', 'reference_design'
        ).prefetch_related('images', 'status_logs')
        if customer is not None:
            queryset = queryset.filter(customer=customer)
        if tailor is not None:
            queryset = queryset.filter(tailor=tailor)
        return queryset.filter(id=stitch_request_id).first()

    @staticmethod
    def get_stitch_requests_by_customer(customer):
        return (
            StitchRequest.objects.filter(customer=customer)
            .select_related('tailor', 'garment_type', 'measurement', 'reference_design')
            .prefetch_related('images', 'status_logs')
            .order_by('-submitted_at')
        )

    @staticmethod
    def get_stitch_requests_by_tailor(tailor, status=None):
        queryset = (
            StitchRequest.objects.filter(tailor=tailor)
            .select_related('customer', 'garment_type', 'measurement', 'reference_design')
            .prefetch_related('images', 'status_logs')
            .order_by('-submitted_at')
        )
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class DesignOrderSelectors:
    @staticmethod
    def get_design_order_by_id(design_order_id, customer=None):
        queryset = DesignOrder.objects.select_related('customer', 'design', 'delivery_address')
        if customer is not None:
            queryset = queryset.filter(customer=customer)
        return queryset.filter(id=design_order_id).first()

    @staticmethod
    def get_design_orders_by_customer(customer):
        return (
            DesignOrder.objects.filter(customer=customer)
            .select_related('design', 'delivery_address')
            .order_by('-ordered_at')
        )
