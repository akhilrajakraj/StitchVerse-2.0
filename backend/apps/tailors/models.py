from django.db import models
from apps.accounts.models import CustomUser, Address
import uuid



class TailorApprovalStatus(models.TextChoices):
    PENDING  = 'pending',  'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'
    REMOVED  = 'removed',  'Removed'


class TailorQualification(models.TextChoices):
    DIPLOMA             = 'diploma',            'Diploma in Fashion'
    BSC_FASHION         = 'bsc_fashion_design', 'B.Sc Fashion Design'
    BA_COSTUME          = 'ba_costume_design',  'B.A Costume Design'
    PG_FASHION          = 'pg_fashion_design',  'P.G Fashion Design'
    EXP_5               = '5_years_experience', '5 Years Experience'
    EXP_10              = '10_years_experience','10 Years Experience'
    OTHER               = 'other',              'Other'


class TailorProfile(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user           = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='tailor_profile')
    full_name      = models.CharField(max_length=100)
    phone          = models.CharField(max_length=15)
    address        = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    specialisation = models.CharField(max_length=100)            # e.g. "Uniform", "All", "Formals"
    qualification  = models.CharField(max_length=30, choices=TailorQualification.choices)
    bio            = models.TextField(blank=True)
    avatar         = models.ImageField(upload_to='avatars/tailors/', null=True, blank=True)
    approval_status = models.CharField(max_length=20, choices=TailorApprovalStatus.choices,
                                       default=TailorApprovalStatus.PENDING)
    average_rating  = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_orders    = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tailor_profiles'
        indexes  = [models.Index(fields=['approval_status'])]

    def __str__(self):
        return f'{self.full_name} ({self.approval_status})'
