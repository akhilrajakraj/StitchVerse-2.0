from rest_framework import serializers

from apps.accounts.serializers import (
    AddressSerializer,
    UserSerializer,
)

from apps.accounts.models import (
    CustomUser,
)

from .models import (
    TailorProfile,
)


class TailorProfileSerializer(serializers.ModelSerializer):

    """
    Serializer for tailor profile.
    """

    user = UserSerializer(read_only=True)

    address = AddressSerializer()

    class Meta:

        model = TailorProfile

        fields = [
            'id',
            'user',
            'full_name',
            'phone',
            'address',
            'specialisation',
            'qualification',
            'bio',
            'approval_status',
            'average_rating',
            'total_orders',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'approval_status',
            'average_rating',
            'total_orders',
            'created_at',
            'updated_at',
        ]


class RegisterTailorSerializer(serializers.ModelSerializer):

    """
    Serializer for tailor registration.
    """

    full_name = serializers.CharField(
        max_length=100,
    )

    phone = serializers.CharField(
        max_length=15,
    )

    address = AddressSerializer()

    specialisation = serializers.CharField(
        max_length=100,
    )

    qualification = serializers.CharField(
        max_length=30,
    )

    bio = serializers.CharField(
        required=False,
        allow_blank=True,
    )

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
            'specialisation',
            'qualification',
            'bio',
        ]

    def validate_email(self, value):

        if CustomUser.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                'Email already exists.'
            )

        return value

    def validate_password(self, value):

        if len(value) < 8:

            raise serializers.ValidationError(
                'Password must be at least 8 characters.'
            )

        return value

    def validate_phone(self, value):

        if len(value) < 10:

            raise serializers.ValidationError(
                'Phone number must contain at least 10 digits.'
            )

        return value

