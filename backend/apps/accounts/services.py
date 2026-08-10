from django.db import transaction

from .models import Address, CustomUser, CustomerProfile, Measurement, UserRole


class AccountService:
    """Transactional business workflows for customer accounts."""

    @staticmethod
    @transaction.atomic
    def register_customer(email, password, full_name, phone, address_data):
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            role=UserRole.CUSTOMER,
        )
        address = Address.objects.create(**address_data)
        return CustomerProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            address=address,
        )

    @staticmethod
    @transaction.atomic
    def create_measurement(customer, validated_data):
        return Measurement.objects.create(customer=customer, **validated_data)

    @staticmethod
    @transaction.atomic
    def update_measurement(measurement, updated_data):
        for field, value in updated_data.items():
            setattr(measurement, field, value)
        measurement.save(update_fields=[*updated_data.keys(), "updated_at"])
        return measurement

    @staticmethod
    @transaction.atomic
    def remove_measurement(measurement):
        measurement.delete()
