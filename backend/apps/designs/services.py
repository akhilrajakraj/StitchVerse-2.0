from django.db import transaction

from .models import (
    Design,
    DesignCategory,
    DesignImage,
    DesignTag,
    DesignOrderStatus,
    DesignTagMap,
)

class DesignServices:
    
    """
    Handles the design related business workflow.
    """
    
    @staticmethod
    @transaction.atomic
    
    def create_design(
        tailor,
        category,
        name,
        description,
        price,
    ):
        design = Design.objects.create(
            tailor=tailor,
            category=category,
            name=name,
            description=description,
            price=price,
        )
        
        return design
    
    @staticmethod
    def upload_design_images(
        design,
        images,
    ):
        uploaded_images = []
        
        for image in images:
            design_image = DesignImage.objects.create(
                design=design,
                image=image,
            )
            uploaded_images.append(
                design_image
            )
        return uploaded_images
    
    @staticmethod
    def attach_tags(
        design,
        tags,
    ):
        attached_tags = []
        
        for tag_name in tags:
            tag, created = DesignTag.objects.get_or_create(
                name=tag_name
            )
            tag_map = DesignTagMap.objects.create(
                design=design,
                tag=tag,
            )
            attached_tags.append(
                tag_map
            )
        return attached_tags
    
    @staticmethod
    @transaction.atomic
    def update_design(
        design,
        **updated_fields,
    ):
        for field,value in updated_fields.items():
            setattr(
                design,
                field,
                value,
            )
        design.save()
        
        return design
    
    @staticmethod
    @transaction.atomic
    def delete_design(
        design
    ):
        design.delete()
        
        return True
    
    
    