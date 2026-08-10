from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import Address, CustomerProfile, Measurement, UserRole, UserStatus


User = get_user_model()


class AccountAPITests(APITestCase):
    def registration_payload(self, email="customer@example.com"):
        return {
            "email": email,
            "password": "StrongPassword123!",
            "full_name": "Test Customer",
            "phone": "9876543210",
            "address": {
                "line1": "10 Main Road",
                "line2": "",
                "city": "Pathanamthitta",
                "district": "Pathanamthitta",
                "state": "Kerala",
                "pincode": "689645",
                "country": "India",
            },
        }

    def create_active_customer(self, email="customer@example.com"):
        user = User.objects.create_user(
            email=email,
            password="StrongPassword123!",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
            is_verified=True,
        )
        address = Address.objects.create(
            line1="10 Main Road",
            city="Pathanamthitta",
            district="Pathanamthitta",
            state="Kerala",
            pincode="689645",
            country="India",
        )
        profile = CustomerProfile.objects.create(
            user=user,
            full_name="Test Customer",
            phone="9876543210",
            address=address,
        )
        return user, profile

    def authenticate(self, user):
        response = self.client.post(
            reverse("accounts:login"),
            {"email": user.email, "password": "StrongPassword123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_customer_registration_creates_pending_customer_and_profile(self):
        response = self.client.post(
            reverse("accounts:register_customer"),
            self.registration_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="customer@example.com")
        self.assertEqual(user.role, UserRole.CUSTOMER)
        self.assertEqual(user.status, UserStatus.PENDING_VERIFY)
        self.assertFalse(user.is_verified)
        self.assertTrue(CustomerProfile.objects.filter(user=user).exists())
        self.assertEqual(Address.objects.count(), 1)

    def test_registration_rejects_duplicate_email(self):
        self.create_active_customer()

        response = self.client.post(
            reverse("accounts:register_customer"),
            self.registration_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.filter(email="customer@example.com").count(), 1)

    def test_unverified_customer_cannot_login(self):
        user = User.objects.create_user(
            email="customer@example.com",
            password="StrongPassword123!",
            role=UserRole.CUSTOMER,
            status=UserStatus.PENDING_VERIFY,
            is_verified=False,
        )

        response = self.client.post(
            reverse("accounts:login"),
            {"email": user.email, "password": "StrongPassword123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_customer_can_read_own_profile(self):
        user, _ = self.create_active_customer()
        self.authenticate(user)

        response = self.client.get(reverse("accounts:customer_profile"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["user"]["id"], str(user.id))

    def test_customer_can_patch_profile_and_nested_address(self):
        user, _ = self.create_active_customer()
        self.authenticate(user)

        response = self.client.patch(
            reverse("accounts:customer_profile"),
            {
                "full_name": "Updated Customer",
                "address": {"city": "Kottayam", "pincode": "686001"},
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.customer_profile.refresh_from_db()
        user.customer_profile.address.refresh_from_db()
        self.assertEqual(user.customer_profile.full_name, "Updated Customer")
        self.assertEqual(user.customer_profile.address.city, "Kottayam")

    def test_customer_can_create_and_list_measurements(self):
        user, _ = self.create_active_customer()
        self.authenticate(user)

        payload = {"label": "Shirt", "height_cm": "170.00", "chest_cm": "96.00"}
        create_response = self.client.post(
            reverse("accounts:create_measurement"), payload, format="json"
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        measurement = Measurement.objects.get(customer=user)
        self.assertEqual(measurement.height_cm, Decimal("170.00"))

        list_response = self.client.get(reverse("accounts:view_measurements"))
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data["data"]), 1)

    def test_customer_can_update_and_delete_own_measurement(self):
        user, _ = self.create_active_customer()
        self.authenticate(user)
        measurement = Measurement.objects.create(customer=user, label="Shirt", chest_cm="96.00")

        response = self.client.patch(
            reverse("accounts:update_measurement", kwargs={"measurement_id": measurement.id}),
            {"label": "Updated Shirt"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        measurement.refresh_from_db()
        self.assertEqual(measurement.label, "Updated Shirt")

        response = self.client.delete(
            reverse("accounts:delete_measurement", kwargs={"measurement_id": measurement.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Measurement.objects.filter(id=measurement.id).exists())

    def test_customer_cannot_update_another_customers_measurement(self):
        owner, _ = self.create_active_customer("owner@example.com")
        other, _ = self.create_active_customer("other@example.com")
        measurement = Measurement.objects.create(
            customer=owner,
            label="Shirt",
            chest_cm="96.00",
        )
        self.authenticate(other)

        response = self.client.patch(
            reverse("accounts:update_measurement", kwargs={"measurement_id": measurement.id}),
            {"label": "Hacked"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        measurement.refresh_from_db()
        self.assertEqual(measurement.label, "Shirt")

    def test_measurement_validation_rejects_negative_values(self):
        user, _ = self.create_active_customer()
        self.authenticate(user)

        response = self.client.post(
            reverse("accounts:create_measurement"),
            {"label": "Shirt", "chest_cm": "-1"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_customer_profile_is_rejected(self):
        response = self.client.get(reverse("accounts:customer_profile"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
