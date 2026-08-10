from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Address, CustomUser, CustomerProfile, Measurement, UserRole, UserStatus


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = user.role
        token["is_verified"] = user.is_verified
        token["status"] = user.status
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if user.status != UserStatus.ACTIVE:
            raise serializers.ValidationError("Account is not active.")
        if not user.is_verified:
            raise serializers.ValidationError("Account is not verified.")

        data["user"] = {
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "is_verified": user.is_verified,
        }
        return data


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id", "line1", "line2", "city", "district", "state", "pincode", "country"
        ]
        read_only_fields = ["id"]

    def validate_pincode(self, value):
        if not value.isdigit() or not 4 <= len(value) <= 10:
            raise serializers.ValidationError("Pincode must contain 4 to 10 digits.")
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "role", "status", "is_verified", "date_joined"]
        read_only_fields = fields


class CustomProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    address = AddressSerializer(required=False, allow_null=True)

    class Meta:
        model = CustomerProfile
        fields = ["id", "user", "full_name", "phone", "address", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def validate_phone(self, value):
        digits = value.replace("+", "").replace(" ", "").replace("-", "")
        if not digits.isdigit() or not 7 <= len(digits) <= 15:
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def update(self, instance, validated_data):
        address_data = validated_data.pop("address", serializers.empty)
        instance = super().update(instance, validated_data)

        if address_data is not serializers.empty:
            if address_data is None:
                instance.address = None
            elif instance.address_id:
                for field, value in address_data.items():
                    setattr(instance.address, field, value)
                instance.address.save()
            else:
                instance.address = Address.objects.create(**address_data)
            instance.save(update_fields=["address"])
        return instance


class RegisterCustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=100, trim_whitespace=True)
    phone = serializers.CharField(max_length=15)
    address = AddressSerializer()
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ["email", "password", "full_name", "phone", "address"]

    def validate_email(self, value):
        value = value.strip().lower()
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value


MEASUREMENT_FIELDS = [
    "height_cm", "weight_kg", "neck_cm", "shoulder_cm", "chest_cm", "bust_cm",
    "waist_cm", "hip_cm", "arm_length_cm", "sleeve_length_cm", "bicep_cm", "wrist_cm",
    "thigh_cm", "knee_cm", "calf_cm", "inseam_cm", "outseam_cm", "ankle_cm",
]


class CustomerMeasurementSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)

    class Meta:
        model = Measurement
        fields = ["id", "customer", "label", *MEASUREMENT_FIELDS, "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "customer", "created_at", "updated_at"]


class AddCustomerMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = ["label", *MEASUREMENT_FIELDS, "notes"]

    def validate_label(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Label is required.")
        return value

    def validate(self, attrs):
        for field in MEASUREMENT_FIELDS:
            value = attrs.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError({field: "Value must be greater than zero."})
        notes = attrs.get("notes")
        if notes and len(notes) > 500:
            raise serializers.ValidationError({"notes": "Notes cannot exceed 500 characters."})
        return attrs
