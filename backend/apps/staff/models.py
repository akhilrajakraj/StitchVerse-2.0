import uuid
from django.db import models
from apps.accounts.models import CustomUser
from apps.orders.models import StitchRequest

# Create your models here.

class QualityCheckResult(models.TextChoices):
    PASS    = 'pass',    'Pass'
    FAIL    = 'fail',    'Fail'
    PENDING = 'pending', 'Pending'

# ──────────────────────────────────────────────
# QUALITY CHECK (staff app)
# ──────────────────────────────────────────────

class QualityCheck(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stitch_request = models.OneToOneField(StitchRequest, on_delete=models.CASCADE,
                                           related_name='quality_check')
    inspector      = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True,
                                        related_name='quality_checks')
    result         = models.CharField(max_length=20, choices=QualityCheckResult.choices,
                                       default=QualityCheckResult.PENDING)
    notes          = models.TextField(blank=True)
    checked_at     = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quality_checks'


class QualityCheckImage(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quality_check = models.ForeignKey(QualityCheck, on_delete=models.CASCADE, related_name='images')
    image         = models.ImageField(upload_to='quality_checks/')
    uploaded_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quality_check_images'

class StaffProfile(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='staff_profile')
    full_name  = models.CharField(max_length=100)
    phone      = models.CharField(max_length=15)
    department = models.CharField(max_length=80)
    employee_id = models.CharField(max_length=30, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'staff_profiles'

# ──────────────────────────────────────────────
# ADMIN / MODERATION (staff app)
# ──────────────────────────────────────────────

class AdminActionLog(models.Model):
    """
    Immutable audit log of all admin actions (approve tailor, suspend user, etc.)
    """
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin       = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                     related_name='admin_actions')
    action      = models.CharField(max_length=100)    # e.g. 'approve_tailor', 'suspend_user'
    target_type = models.CharField(max_length=60)     # model name
    target_id   = models.CharField(max_length=36)     # UUID as string
    notes       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_action_logs'
        indexes  = [models.Index(fields=['admin', 'created_at'])]

class PlatformConfig(models.Model):
    """
    Key-value store for runtime platform settings changeable by admin.
    e.g. commission_rate, min_order_amount, feature_flags.
    """
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key        = models.CharField(max_length=100, unique=True)
    value      = models.TextField()
    value_type = models.CharField(max_length=20,
                                   choices=[('str','String'),('int','Integer'),
                                            ('float','Float'),('bool','Boolean'),
                                            ('json','JSON')],
                                   default='str')
    description = models.CharField(max_length=255, blank=True)
    updated_by  = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_config'

    def __str__(self):
        return f'{self.key} = {self.value}'
