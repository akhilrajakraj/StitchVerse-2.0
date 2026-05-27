from .models import (
    StitchRequest,
    DesignOrder,
)

class StitchRequestSelectors:
    
    @staticmethod
    def get_stitch_request_by_id(
        stitch_request_id
    ):
        
        return StitchRequest.objects.filter(
            id=stitch_request_id
        ).first()
    
    @staticmethod
    def get_stitch_requests_by_customer(
        customer
    ):
        
        return StitchRequest.objects.filter(
            customer=customer
        )
    
    @staticmethod
    def get_stitch_requests_by_tailor(
        tailor
    ):
        
        return StitchRequest.objects.filter(
            tailor=tailor
        )
        
class DesignOrderSelectors:
    
    @staticmethod
    def get_design_order_by_id(
        design_order_id
    ):
        
        return DesignOrder.objects.filter(
            id=design_order_id
        ).first()
    
    @staticmethod
    def get_design_orders_by_customer(
        customer
    ):
        
        return DesignOrder.objects.filter(
            customer=customer
        )