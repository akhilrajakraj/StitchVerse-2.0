from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .models import (
    UserRole,
    UserStatus,
    CustomUser,
    CustomerProfile,
    Address,
)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    """
    Custom JWT Serializer for StitchVerse.
    """
    
    @classmethod
    def get_token(cls, user):
        
        token = super().get_token(user)
        
        # Custom Claims

        token['email'] = user.email
        token['role'] = user.role
        token ['is_verified'] = user.is_verified
        token['status'] = user.status
        
        return token
    
    def validate(self, attrs):
        
        data = super().validate(attrs)
        
        user = self.user
        
        if user.status != UserStatus.ACTIVE:
            
            raise serializers.ValidationError(
                'Account is not active.'
            )
        
        if not user.is_verified:
            
            raise serializers.ValidationError(
                'Account is not verified'
            )
        
        data['user'] = {
            'id':str(user.id),
            'email':user.email,
            'role':user.role,
            'is_verified':user.is_verified
        }
        
        return data 
            

class AddressSerializer(serializers.ModelSerializer):
    
    """
    Serailizer for address information.
    """
    
    class Meta:
        
        model = Address
        
        fields = [
            'id',
            'line1',
            'line2',
            'city',
            'district',
            'state',
            'pincode',
            'country',
        ]
    read_only_fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        
        model = CustomUser
        
        fields = [
            'id',
            'email',
            'role',
            'status',
            'is_verified',
            'date_joined',
        ]
        
        read_only_fields = [
            'id',
            'role',
            'status',
            'is_verified',
            'date_joined',
        ]

class CustomProfileSerializer(serializers.ModelSerializer):
    
    """
    Serializer for Custom Profile.
    """
    user = UserSerializer(read_only=True)
    address = AddressSerializer()
    
    
    class Meta:
        
        model = CustomerProfile
        
        fields = [
            'id',
            'user',
            'full_name',
            'phone',
            'address',
            'created_at',
        ]
        
        read_only_fields = [
            'id',
            'created_at',
        ]

class RegisterCustomerSerializer(serializers.ModelSerializer):
    
    """
    Serializer for customer registration.
    """
    full_name = serializers.CharField(
        max_length=100,
    )
    
    phone = serializers.CharField(
        max_length=15,
    )
    
    address = AddressSerializer()
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )
    
    class Meta:
        
        model = CustomUser
        
        fields = [
            'email',
            'password',
            'full_name',
            'phone',
            'address',
        ]
        
    def validate_email(self, value):
        
        if CustomUser.objects.filter(email=value).exists():
            
            raise serializers.ValidationError(
                'Email is already in use.'
            )
        
        return value
    
    def validate_password(self, value):
        
        if len(value) < 8:
            
            raise serializers.ValidationError(
                'Password must be at least 8 characters long.'
            )
        
        return value
    