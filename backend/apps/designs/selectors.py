from .models import (
    Design,
)

class DesignSelectors:
    
    @staticmethod
    def get_all_designs():
        
        return Design.objects.all()
    
    @staticmethod
    def get_design_by_id(
        design_id
    ):
        
        return Design.objects.filter(
            id=design_id
        ).first()
        
    @staticmethod
    def get_tailor_designs(
        tailor
    ):
        return Design.objects.filter(
            tailor=tailor
        )
    
    @staticmethod
    def get_active_designs(
        is_active
    ):
        
        return Design.objects.filter(
            is_active=True
        )
    
    @staticmethod
    def get_design_by_slugs(
        slug
    ):
        
        return Design.objects.filter(
            slug=slug
        ).first()


    
    