from django.db import transaction

from .models import (
    TailorProfile,
)

from apps.accounts.models import(
    UserRole,
    UserStatus,
    CustomUser,
    Address,
)

class TailorRegService:
    
    """
    Handle Tailor registration.
    """
    
    @staticmethod
    @transaction.atomic
    def register_tailor(
        email,
        password,
        full_name,
        phone,
        address_data,
        specialisation,
        qualification,
        bio,
    ):
        """
        Register a new Tailor Account.
        """
        
        # Create address
        
        address = Address.objects.create(
            line1=address_data.get('line1'),
            line2=address_data.get('line2'),
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
            role=UserRole.TAILOR,
        )
        
        tailor_profile = TailorProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            address=address,
            specialisation=specialisation,
            qualification=qualification,
            bio=bio,
        )
        
        return tailor_profile
        
    