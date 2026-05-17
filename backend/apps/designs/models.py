import uuid
from django.db import models
from apps.accounts.models import CustomUser

# Create your models here.

class DesignOrderStatus(models.TextChoices):
    PAYMENT_PENDING = 'payment_pending', 'Payment Pending'
    PAID            = 'paid',            'Paid'
    SHIPPED         = 'shipped',         'Shipped'
    DELIVERED       = 'delivered',       'Delivered'
    CANCELLED       = 'cancelled',       'Cancelled'

# ──────────────────────────────────────────────
# DESIGNS — Tailor portfolio / marketplace (designs app)
# ──────────────────────────────────────────────

class DesignCategory(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=100, unique=True)
    slug       = models.SlugField(unique=True)
    parent     = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name='children')

    class Meta:
        db_table = 'design_categories'
        verbose_name_plural = 'Design categories'

    def __str__(self):
        return self.name


class Design(models.Model):
    """
    Tailor's design portfolio item — can be purchased as-is or used as
    a reference for a stitch request.
    """
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tailor      = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='designs')
    category    = models.ForeignKey(DesignCategory, on_delete=models.SET_NULL, null=True, blank=True)
    name        = models.CharField(max_length=255)
    description = models.TextField()
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'designs'
        indexes  = [models.Index(fields=['tailor', 'is_active'])]

    def __str__(self):
        return f'{self.name} by {self.tailor.email}'


class DesignImage(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    design     = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='designs/')
    is_primary = models.BooleanField(default=False)
    order      = models.PositiveSmallIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'design_images'
        ordering = ['order']


class DesignTag(models.Model):
    id     = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name   = models.CharField(max_length=50, unique=True)
    slug   = models.SlugField(unique=True)

    class Meta:
        db_table = 'design_tags'


class DesignTagMap(models.Model):
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='tag_maps')
    tag    = models.ForeignKey(DesignTag, on_delete=models.CASCADE)

    class Meta:
        db_table    = 'design_tag_map'
        unique_together = ('design', 'tag')
