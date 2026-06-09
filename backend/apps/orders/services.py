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
        uploaded_images=None, # 🚨 ADDED: Parameter to catch the files
    ):
        
        # 1. Create the main Order
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
        
        # 2. Loop through the array of files and save them to the Image table!
        if uploaded_images:
            # We import it here locally if it isn't imported at the top of your file
            from .models import StitchRequestImage 
            
            for image_file in uploaded_images:
                StitchRequestImage.objects.create(
                    stitch_request=stitch_request,
                    image=image_file
                )
                
        return stitch_request