import uuid
from django.db import models

from apps.accounts.models import CustomUser
from apps.orders.models import StitchRequest, DesignOrder

# Create your models here.

class FeedbackType(models.TextChoices):
    STITCH_REQUEST  = 'stitch_request',  'Stitch Request'
    DESIGN_PURCHASE = 'design_purchase', 'Design Purchase'

# ──────────────────────────────────────────────
# REVIEWS (reviews app)
# ──────────────────────────────────────────────

class Review(models.Model):
    """
    Replaces legacy `feedb` table.
    Normalised: separate models for stitch vs design reviews.
    """
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer       = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                        related_name='reviews_given')
    tailor         = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                        related_name='reviews_received')
    feedback_type  = models.CharField(max_length=20, choices=FeedbackType.choices)
    stitch_request = models.ForeignKey(StitchRequest, on_delete=models.SET_NULL, null=True,
                                        blank=True, related_name='reviews')
    design_order   = models.ForeignKey(DesignOrder, on_delete=models.SET_NULL, null=True,
                                        blank=True, related_name='reviews')
    rating         = models.PositiveSmallIntegerField()  # 1-5
    comment        = models.TextField()
    is_visible     = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        indexes  = [models.Index(fields=['tailor', 'feedback_type'])]
        constraints = [
            models.CheckConstraint(check=models.Q(rating__gte=1, rating__lte=5),
                                    name='rating_1_to_5'),
        ]

    def __str__(self):
        return f'Review by {self.reviewer.email} – {self.rating}★'
