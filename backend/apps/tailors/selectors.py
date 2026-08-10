from django.db.models import Q

from apps.accounts.models import CustomUser

from .models import TailorApprovalStatus, TailorProfile


class TailorSelectors:
    """Read-only database queries for tailor workflows."""

    @staticmethod
    def get_tailor_by_email(email):
        return CustomUser.objects.filter(email__iexact=email).first()

    @staticmethod
    def get_tailor_profile(user):
        return (
            TailorProfile.objects
            .select_related('user', 'address')
            .filter(user=user)
            .first()
        )

    @staticmethod
    def get_tailor_qualification(qualification):
        return TailorProfile.objects.filter(
            qualification=qualification,
            approval_status=TailorApprovalStatus.APPROVED,
        ).select_related('user', 'address')

    @staticmethod
    def get_tailor_status(approval_status):
        return TailorProfile.objects.filter(
            approval_status=approval_status,
        ).select_related('user', 'address')

    @staticmethod
    def get_tailor_specialization(specialisation):
        return TailorProfile.objects.filter(
            specialisation__iexact=specialisation,
            approval_status=TailorApprovalStatus.APPROVED,
        ).select_related('user', 'address')

    @staticmethod
    def get_all_tailors(user=None, search=None, specialisation=None, qualification=None):
        queryset = (
            TailorProfile.objects
            .filter(approval_status=TailorApprovalStatus.APPROVED)
            .select_related('user', 'address')
            .order_by('-average_rating', '-total_orders', '-created_at')
        )
        if user is not None:
            queryset = queryset.exclude(user=user)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search)
                | Q(specialisation__icontains=search)
                | Q(bio__icontains=search)
            )
        if specialisation:
            queryset = queryset.filter(specialisation__iexact=specialisation)
        if qualification:
            queryset = queryset.filter(qualification=qualification)
        return queryset
