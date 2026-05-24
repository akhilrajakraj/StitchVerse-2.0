from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .models import (
    UserRole,
    UserStatus,
    CustomUser,
    CustomerProfile,
    Address,
    Measurement,
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
    
class CustomerMeasurementSerializer(serializers.ModelSerializer):
    
    """
    Serializer for customer measurements.
    """
    customer = UserSerializer(read_only=True)
    

    class Meta:
        
        model = Measurement
        
        fields = [
            'id',
            'customer',
            'label',
            'height_cm',
            'weight_kg',
            'neck_cm',
            'shoulder_cm',
            'chest_cm',
            'bust_cm',
            'waist_cm',
            'hip_cm',
            'arm_length_cm',
            'sleeve_length_cm',
            'bicep_cm',
            'wrist_cm',
            'thigh_cm',
            'knee_cm',
            'calf_cm',
            'inseam_cm',
            'outseam_cm',
            'ankle_cm',
            'notes',
            'created_at',
            'updated_at',
        ]
        
        read_only_fields = [
            'id',
            'customer',
            'created_at',
            'updated_at',
        ]
        
class AddCustomerMeasurementSerializer(serializers.ModelSerializer):
    
    """
    Serializer for adding customer measurements.
    """
    
    class Meta:
        
        model = Measurement
        
        fields = [
            'label',
            'height_cm',
            'weight_kg',
            'neck_cm',
            'shoulder_cm',
            'chest_cm',
            'bust_cm',
            'waist_cm',
            'hip_cm',
            'arm_length_cm',
            'sleeve_length_cm',
            'bicep_cm',
            'wrist_cm',
            'thigh_cm',
            'knee_cm',
            'calf_cm',
            'inseam_cm',
            'outseam_cm',
            'ankle_cm',
            'notes',
        ]
    def validate_label(self, value):
        if not value:
            raise serializers.ValidationError("Label is required.")
        return value
    def validate_height_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Height must be a positive number.")
        return value
    def validate_weight_kg(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Weight must be a positive number.")
        return value
    def validate_neck_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Neck circumference must be a positive number.")
        return value
    def validate_shoulder_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Shoulder width must be a positive number.")
        return value
    def validate_chest_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Chest circumference must be a positive number.")
        return value
    def validate_bust_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Bust circumference must be a positive number.")
        return value
    def validate_waist_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Waist circumference must be a positive number.")
        return value
    def validate_hip_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Hip circumference must be a positive number.")
        return value
    def validate_arm_length_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Arm length must be a positive number.")
        return value
    def validate_sleeve_length_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Sleeve length must be a positive number.")
        return value
    def validate_bicep_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Bicep circumference must be a positive number.")
        return value
    def validate_wrist_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Wrist circumference must be a positive number.")
        return value
    def validate_thigh_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Thigh circumference must be a positive number.")
        return value
    def validate_knee_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Knee circumference must be a positive number.")
        return value
    def validate_calf_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Calf circumference must be a positive number.")
        return value
    def validate_inseam_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Inseam length must be a positive number.")
        return value
    def validate_outseam_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Outseam length must be a positive number.")
        return value
    def validate_ankle_cm(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Ankle circumference must be a positive number.")
        return value
    def validate_notes(self, value):
        if value is not None and len(value) > 500:
            raise serializers.ValidationError("Notes cannot exceed 500 characters.")
        return value
