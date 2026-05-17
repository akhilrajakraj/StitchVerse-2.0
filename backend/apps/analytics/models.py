import uuid
from django.db import models
from apps.accounts.models import CustomUser

# Create your models here.

# ──────────────────────────────────────────────
# ANALYTICS (analytics app)
# ──────────────────────────────────────────────

class TailorAnalyticsSnapshot(models.Model):
    """
    Daily denormalised snapshot per tailor for fast dashboard reads.
    Written by a nightly Celery task — never updated manually.
    """
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tailor              = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                             related_name='analytics_snapshots')
    snapshot_date       = models.DateField(db_index=True)
    total_orders        = models.PositiveIntegerField(default=0)
    completed_orders    = models.PositiveIntegerField(default=0)
    cancelled_orders    = models.PositiveIntegerField(default=0)
    revenue             = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_rating      = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    new_reviews         = models.PositiveIntegerField(default=0)
    design_sales        = models.PositiveIntegerField(default=0)

    class Meta:
        db_table        = 'tailor_analytics_snapshots'
        unique_together = ('tailor', 'snapshot_date')


class PlatformAnalyticsSnapshot(models.Model):
    """
    Platform-wide daily stats for admin dashboard.
    """
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    snapshot_date       = models.DateField(unique=True, db_index=True)
    new_customers       = models.PositiveIntegerField(default=0)
    new_tailors         = models.PositiveIntegerField(default=0)
    total_orders        = models.PositiveIntegerField(default=0)
    total_revenue       = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    pending_orders      = models.PositiveIntegerField(default=0)
    active_disputes     = models.PositiveIntegerField(default=0)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'platform_analytics_snapshots'
