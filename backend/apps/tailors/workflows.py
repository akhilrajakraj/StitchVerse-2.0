from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.accounts.models import UserStatus

from .models import TailorApprovalStatus, TailorProfile


class TailorApprovalService:
    """State transitions for staff-controlled tailor onboarding."""

    @staticmethod
    @transaction.atomic
    def approve(profile: TailorProfile) -> TailorProfile:
        if profile.approval_status == TailorApprovalStatus.REMOVED:
            raise ValidationError("Removed tailors cannot be approved.")
        profile.approval_status = TailorApprovalStatus.APPROVED
        profile.user.status = UserStatus.ACTIVE
        profile.user.is_verified = True
        profile.user.save(update_fields=["status", "is_verified", "updated_at"])
        profile.save(update_fields=["approval_status", "updated_at"])
        return profile

    @staticmethod
    @transaction.atomic
    def reject(profile: TailorProfile) -> TailorProfile:
        if profile.approval_status == TailorApprovalStatus.REMOVED:
            raise ValidationError("Removed tailors cannot be rejected.")
        profile.approval_status = TailorApprovalStatus.REJECTED
        profile.user.is_verified = False
        profile.user.save(update_fields=["is_verified", "updated_at"])
        profile.save(update_fields=["approval_status", "updated_at"])
        return profile

    @staticmethod
    @transaction.atomic
    def remove(profile: TailorProfile) -> TailorProfile:
        profile.approval_status = TailorApprovalStatus.REMOVED
        profile.user.is_verified = False
        profile.user.status = UserStatus.SUSPENDED
        profile.user.save(update_fields=["status", "is_verified", "updated_at"])
        profile.save(update_fields=["approval_status", "updated_at"])
        return profile
