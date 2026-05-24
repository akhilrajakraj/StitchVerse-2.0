from .models import (
    CustomUser,
    CustomerProfile,
    UserRole,
    UserStatus,
    Measurement, 
)

class AccountSelectors:
    """
    Handles reusable database query logic for account-related operations.
    """
    @staticmethod
    def get_user_by_email(email):
        """
        Get user by Email
        """
        return CustomUser.objects.filter(
            email=email
        ).first()
    
    @staticmethod
    def get_customer_profile(user):
        """
        Get Customer Profile of a user.
        """
        return CustomerProfile.objects.filter(
            user=user
        ).select_related(
            'address'
        ).first()
    
    @staticmethod
    def get_user_status(status):
        
        """"
        Get User Status.
        """
        return CustomUser.objects.filter(
            status=status
        ).first()
    
    @staticmethod
    def get_user_measurements(user):
        """
        Get User Measurements.
        """
        return user.measurements.all()
    
    @staticmethod
    def get_measurement_by_id(measurement_id):
        """
        Get Measurement by ID.
        """
        return Measurement.objects.filter(
            id=measurement_id
        ).first()
        
        
    
        
        
        
        
        