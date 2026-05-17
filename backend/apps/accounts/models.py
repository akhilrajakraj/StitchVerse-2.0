import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

# ──────────────────────────────────────────────
# ENUMERATIONS
# ──────────────────────────────────────────────


class UserRole(models.TextChoices):
    CUSTOMER = 'customer', 'Customer'
    TAILOR   = 'tailor',   'Tailor'
    STAFF    = 'staff',    'Staff'
    DELIVERY = 'delivery', 'Delivery'
    SUPPORT  = 'support',  'Support'
    ADMIN    = 'admin',    'Admin'


class UserStatus(models.TextChoices):
    ACTIVE         = 'active',          'Active'
    SUSPENDED      = 'suspended',       'Suspended'
    REMOVED        = 'removed',         'Removed'
    PENDING_VERIFY = 'pending_verify',  'Pending Verification'


# ──────────────────────────────────────────────
# AUTH — CustomUser (accounts app)
# ──────────────────────────────────────────────

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Single auth table for all roles.
    Role-specific data lives in separate profile tables.
    """
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email       = models.EmailField(unique=True, db_index=True)
    role        = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.CUSTOMER)
    status      = models.CharField(max_length=20, choices=UserStatus.choices, default=UserStatus.PENDING_VERIFY)
    is_verified = models.BooleanField(default=False)
    is_staff    = models.BooleanField(default=False)
    is_active   = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login  = models.DateTimeField(null=True, blank=True)

    # password reset
    reset_token        = models.CharField(max_length=255, null=True, blank=True)
    reset_token_expiry = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['role']

    objects = CustomUserManager()

    class Meta:
        db_table = 'users'
        indexes  = [models.Index(fields=['role', 'status'])]

    def __str__(self):
        return f'{self.email} ({self.role})'


# ──────────────────────────────────────────────
# LOCATION — shared across profiles
# ──────────────────────────────────────────────

class Address(models.Model):
    id       = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    line1    = models.CharField(max_length=255)
    line2    = models.CharField(max_length=255, blank=True)
    city     = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state    = models.CharField(max_length=100, default='Kerala')
    pincode  = models.CharField(max_length=10)
    country  = models.CharField(max_length=60, default='India')

    class Meta:
        db_table = 'addresses'

    def __str__(self):
        return f'{self.line1}, {self.city} – {self.pincode}'


# ──────────────────────────────────────────────
# PROFILES
# ──────────────────────────────────────────────

class CustomerProfile(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='customer_profile')
    full_name  = models.CharField(max_length=100)
    phone      = models.CharField(max_length=15)
    address    = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    avatar     = models.ImageField(upload_to='avatars/customers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customer_profiles'

    def __str__(self):
        return self.full_name


# ──────────────────────────────────────────────
# MEASUREMENTS (accounts / tailors app)
# ──────────────────────────────────────────────

class Measurement(models.Model):
    """
    Customer body measurements. One customer can have multiple saved profiles
    (e.g. 'My shirt profile', 'My trouser profile').
    """
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer       = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='measurements')
    label          = models.CharField(max_length=100, default='Default')
    height_cm      = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight_kg      = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    neck_cm        = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    shoulder_cm    = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    chest_cm       = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    bust_cm        = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    waist_cm       = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hip_cm         = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    arm_length_cm  = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    sleeve_length_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    bicep_cm       = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    wrist_cm       = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    thigh_cm       = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    knee_cm        = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    calf_cm        = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    inseam_cm      = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outseam_cm     = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ankle_cm       = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes          = models.TextField(blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'measurements'
        unique_together = ('customer', 'label')

    def __str__(self):
        return f'{self.customer.email} – {self.label}'
