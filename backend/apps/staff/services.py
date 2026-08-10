from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.accounts.models import UserRole, UserStatus
from apps.notifications.services import NotificationService
from apps.tailors.models import TailorApprovalStatus

from .models import AdminActionLog, QualityCheck, QualityCheckResult


class StaffService:
    @staticmethod
    def ensure_staff(user):
        if not user.is_staff and user.role not in {UserRole.STAFF, UserRole.ADMIN}:
            raise PermissionDenied('Staff access required.')

    @staticmethod
    @transaction.atomic
    def approve_tailor(*, admin, profile):
        StaffService.ensure_staff(admin)
        if profile.approval_status == TailorApprovalStatus.REMOVED:
            raise ValidationError('Removed tailors cannot be approved.')
        profile.approval_status = TailorApprovalStatus.APPROVED
        profile.user.status = UserStatus.ACTIVE
        profile.user.is_verified = True
        profile.user.save(update_fields=['status', 'is_verified', 'updated_at'])
        profile.save(update_fields=['approval_status', 'updated_at'])
        AdminActionLog.objects.create(admin=admin, action='approve_tailor', target_type='tailor_profile', target_id=str(profile.id))
        NotificationService.notify_event(recipient=profile.user, event_key='tailor_approved', related_object=profile)
        return profile

    @staticmethod
    @transaction.atomic
    def set_user_status(*, admin, user, status_value, notes=''):
        StaffService.ensure_staff(admin)
        if status_value not in UserStatus.values:
            raise ValidationError('Invalid user status.')
        user.status = status_value
        user.is_active = status_value != UserStatus.REMOVED
        user.save(update_fields=['status', 'is_active', 'updated_at'])
        AdminActionLog.objects.create(admin=admin, action='set_user_status', target_type='user', target_id=str(user.id), notes=notes)
        return user

    @staticmethod
    @transaction.atomic
    def complete_quality_check(*, inspector, stitch_request, result, notes=''):
        StaffService.ensure_staff(inspector)
        if result not in QualityCheckResult.values:
            raise ValidationError('Invalid quality-check result.')
        check, _ = QualityCheck.objects.get_or_create(stitch_request=stitch_request)
        check.inspector = inspector
        check.result = result
        check.notes = notes
        check.checked_at = timezone.now()
        check.save(update_fields=['inspector', 'result', 'notes', 'checked_at'])
        AdminActionLog.objects.create(admin=inspector, action='quality_check', target_type='stitch_request', target_id=str(stitch_request.id), notes=result)
        return check
