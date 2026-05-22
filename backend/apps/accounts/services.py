from django.db import transaction

from .models import (
    CustomUser,
    CustomerProfile,
    Address,
    UserRole,
    Measurement,
)

class AccountService:
    
    """
    Handles account-related business workflows.
    """
    
    @staticmethod
    @transaction.atomic
    def register_customer(
        email,
        password,
        full_name,
        phone,
        address_data,
    ):
        """
        Register a new Customer Account.
        """
        # Create address
        address = Address.objects.create(
            line1=address_data.get('line1'),
            line2=address_data.get('line2', ''),
            city=address_data.get('city'),
            district=address_data.get('district'),
            state=address_data.get('state','Kerala'),
            pincode=address_data.get('pincode'),
            country=address_data.get('country','India'),
        )
        
        # Create Authentication User
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            role=UserRole.CUSTOMER,
        )
        
        # Create Custom Profile
        customer_profile = CustomerProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            address=address,
        )
        
        return customer_profile
    
    @staticmethod
    @transaction.atomic
    def create_measurement(customer, validated_data):
       
       """
       Creating customer measurements.
       """
       measurement = Measurement.objects.create(
           customer=customer,
           **validated_data
       )
       
       return measurement
   
    @staticmethod
    def update_measurement(measurement, updated_data):
        
        """
        Updating existing customer measurements.
        """
        for field, value in updated_data.items():
            
            setattr(
                measurement,
                field,
                value
            )
        
        measurement.save()
        
        return measurement
    
    @staticmethod
    def removing_measurement(measurement):
        
        """
        Removing existing measurement.
        """
        
        measurement.delete()
        
        return True
        
        
               