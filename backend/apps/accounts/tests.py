from django.db import IntegrityError
from django.test import TestCase

from .models import Address, CustomUser, CustomerProfile, Measurement, UserRole


class CustomUserTests(TestCase):
    def test_create_user_normalizes_email_and_hashes_password(self):
        user = CustomUser.objects.create_user(
            email='User@Example.COM',
            password='StrongPassword123!',
        )

        self.assertEqual(user.email, 'User@example.com')
        self.assertTrue(user.check_password('StrongPassword123!'))
        self.assertFalse(user.is_staff)
        self.assertEqual(user.role, UserRole.CUSTOMER)

    def test_create_superuser_gets_admin_role_and_permissions(self):
        user = CustomUser.objects.create_superuser(
            email='admin@example.com',
            password='StrongPassword123!',
        )

        self.assertEqual(user.role, UserRole.ADMIN)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)


class ProfileModelTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='customer@example.com',
            password='StrongPassword123!',
        )

    def test_customer_profile_links_to_user(self):
        profile = CustomerProfile.objects.create(
            user=self.user,
            full_name='Test Customer',
            phone='9999999999',
        )

        self.assertEqual(profile.user, self.user)
        self.assertEqual(self.user.customer_profile, profile)

    def test_measurement_labels_are_unique_per_customer(self):
        Measurement.objects.create(customer=self.user, label='Default')

        with self.assertRaises(IntegrityError):
            Measurement.objects.create(customer=self.user, label='Default')

    def test_measurement_label_can_repeat_for_different_customers(self):
        other_user = CustomUser.objects.create_user(
            email='other@example.com',
            password='StrongPassword123!',
        )

        Measurement.objects.create(customer=self.user, label='Default')
        measurement = Measurement.objects.create(customer=other_user, label='Default')

        self.assertEqual(measurement.label, 'Default')


class AddressModelTests(TestCase):
    def test_address_string_representation(self):
        address = Address.objects.create(
            line1='10 Main Road',
            city='Pathanamthitta',
            district='Pathanamthitta',
            pincode='689645',
        )

        self.assertEqual(str(address), '10 Main Road, Pathanamthitta – 689645')
