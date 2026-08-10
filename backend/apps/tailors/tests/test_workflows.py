from django.test import TestCase
from rest_framework.exceptions import ValidationError

from apps.accounts.models import CustomUser, UserRole, UserStatus

from apps.tailors.models import TailorApprovalStatus, TailorProfile
from apps.tailors.workflows import TailorApprovalService


class TailorApprovalWorkflowTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="tailor@example.com",
            password="StrongPass123!",
            role=UserRole.TAILOR,
        )
        self.profile = TailorProfile.objects.create(
            user=self.user,
            full_name="Test Tailor",
            phone="9876543210",
            specialisation="Formal Wear",
            qualification="other",
        )

    def test_approve_activates_and_verifies_tailor(self):
        TailorApprovalService.approve(self.profile)
        self.profile.refresh_from_db()
        self.user.refresh_from_db()
        self.assertEqual(self.profile.approval_status, TailorApprovalStatus.APPROVED)
        self.assertEqual(self.user.status, UserStatus.ACTIVE)
        self.assertTrue(self.user.is_verified)

    def test_reject_removes_verification(self):
        self.user.is_verified = True
        self.user.save(update_fields=["is_verified"])
        TailorApprovalService.reject(self.profile)
        self.profile.refresh_from_db()
        self.user.refresh_from_db()
        self.assertEqual(self.profile.approval_status, TailorApprovalStatus.REJECTED)
        self.assertFalse(self.user.is_verified)

    def test_removed_tailor_cannot_be_approved(self):
        self.profile.approval_status = TailorApprovalStatus.REMOVED
        self.profile.save(update_fields=["approval_status"])
        with self.assertRaises(ValidationError):
            TailorApprovalService.approve(self.profile)

    def test_remove_suspends_tailor(self):
        TailorApprovalService.remove(self.profile)
        self.profile.refresh_from_db()
        self.user.refresh_from_db()
        self.assertEqual(self.profile.approval_status, TailorApprovalStatus.REMOVED)
        self.assertEqual(self.user.status, UserStatus.SUSPENDED)
        self.assertFalse(self.user.is_verified)
