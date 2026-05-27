from django.db import transaction

from .models import (
    StitchRequest,
    DesignOrder,
    GarmentCategory,
)

class StitchRequestServices:
    
    
    """
    List out the garment categories available for stitch requests.
    """
    @staticmethod
    def list_garment_categories():
        return GarmentCategory.objects.all()

    """
    Handles the stitch request related business workflow.
    """
    
    @staticmethod
    @transaction.atomic
    
    def create_stitch_request(
        customer,
        tailor,
        name,
        garment_type,
        fabric,
        color,
        pattern,
        design_details,
        instructions,
        measurement,
        reference_design,
        expected_date,
    ):
        
        stitch_request = StitchRequest.objects.create(
            customer=customer,
            tailor=tailor,
            name=name,
            garment_type=garment_type,
            fabric=fabric,
            color=color,
            pattern=pattern,
            design_details=design_details,
            instructions=instructions,
            measurement=measurement,
            reference_design=reference_design,
            expected_date=expected_date,
        )
        
        return stitch_request