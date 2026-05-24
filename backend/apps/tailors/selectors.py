from .models import (
    TailorApprovalStatus,
    TailorQualification,
    TailorProfile,
)

from apps.accounts.models import(
    CustomUser,
)

class TailorSelectors:
    
    """
    Handles re-usable database for tailor features.
    """
    
    @staticmethod
    def get_tailor_by_email(email):
        
        """
        Get tailor by email.
        """
        return CustomUser.objects.filter(
            email=email
        ).first()
    
    @staticmethod
    def get_tailor_profile(user):
        
        """
        Get Tailor Profile of a user.
        """
        
        return TailorProfile.objects.filter(
            user=user
        ).select_related(
            'address'
        ).first()
    
    @staticmethod
    def get_tailor_qualification(qualification):
        
        """
        Get Tailors By qualifications. 
        """
        return TailorProfile.objects.filter(
            qualification=qualification
        ).all()
        
    @staticmethod
    def get_tailor_status(approval_status):
        
        """
        Get tailor status.
        """
        return TailorProfile.objects.filter(
            approval_status=approval_status
        ).all()
        
    @staticmethod
    def get_tailor_specialization(specialisation):
        
        """
        Get tailors by specification.
        """
        
        return TailorProfile.objects.filter(
            specialisation=specialisation
        ).all()
        
    @staticmethod
    def get_all_tailors(user):
        
        """
        Get all active tailors.
        """
        return TailorProfile.objects.filter(
            approval_status=TailorApprovalStatus.APPROVED or TailorApprovalStatus.ACTIVE,
        ).exclude(
            user=user)
        
        
        
    