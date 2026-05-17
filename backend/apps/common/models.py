import uuid
from django.db import models

from apps.accounts.models import (
    CustomUser,
    Measurement
)

from apps.orders.models import StitchRequest

# Create your models here.

class AIFeatureType(models.TextChoices):
    STYLE_RECOMMENDATION  = 'style_recommendation',  'Style Recommendation'
    MEASUREMENT_ASSIST    = 'measurement_assist',    'Measurement Assist'
    DESIGN_SUGGESTION     = 'design_suggestion',     'Design Suggestion'
    FABRIC_SUGGESTION     = 'fabric_suggestion',     'Fabric Suggestion'
    PRICE_ESTIMATION      = 'price_estimation',      'Price Estimation'
    CHATBOT               = 'chatbot',               'Chatbot'

# ──────────────────────────────────────────────
# MESSAGING — in-order chat (common app)
# ──────────────────────────────────────────────

class Message(models.Model):
    """
    Direct messaging between customer and tailor within a stitch request.
    """
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stitch_request = models.ForeignKey(StitchRequest, on_delete=models.CASCADE,
                                        related_name='messages')
    sender         = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                        related_name='sent_messages')
    body           = models.TextField()
    attachment     = models.FileField(upload_to='message_attachments/', null=True, blank=True)
    is_read        = models.BooleanField(default=False)
    sent_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        ordering = ['sent_at']
        indexes  = [models.Index(fields=['stitch_request', 'sent_at'])]


# ──────────────────────────────────────────────
# AI FEATURES (common / ai app)
# ──────────────────────────────────────────────

class AIInteractionLog(models.Model):
    """
    Logs every AI feature invocation for auditing, debugging, and
    fine-tuning training data collection.
    """
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user            = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True,
                                         related_name='ai_interactions')
    feature_type    = models.CharField(max_length=40, choices=AIFeatureType.choices, db_index=True)
    model_name      = models.CharField(max_length=100)           # e.g. 'gpt-4o', 'claude-sonnet-4-6'
    input_payload   = models.JSONField()                          # what was sent
    output_payload  = models.JSONField(null=True, blank=True)    # what came back
    tokens_used     = models.PositiveIntegerField(default=0)
    latency_ms      = models.PositiveIntegerField(default=0)
    was_helpful     = models.BooleanField(null=True, blank=True)  # thumbs up/down
    error_message   = models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_interaction_logs'
        indexes  = [
            models.Index(fields=['feature_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]


class AIStyleRecommendation(models.Model):
    """
    Persisted AI-generated style suggestions shown to a customer.
    Decoupled from the raw log to allow UI caching.
    """
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interaction_log = models.OneToOneField(AIInteractionLog, on_delete=models.CASCADE,
                                            related_name='style_recommendation')
    customer        = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                         related_name='ai_style_recommendations')
    body_type       = models.CharField(max_length=50, blank=True)
    occasion        = models.CharField(max_length=100, blank=True)
    fabric_prefs    = models.JSONField(default=list)
    suggestions     = models.JSONField()              # list of {design_type, notes, image_prompt}
    was_acted_on    = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_style_recommendations'


class AIMeasurementSuggestion(models.Model):
    """
    AI-assisted measurement correction / validation result.
    E.g. detecting physiologically impossible values before submission.
    """
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interaction_log = models.OneToOneField(AIInteractionLog, on_delete=models.CASCADE,
                                            related_name='measurement_suggestion')
    customer        = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                         related_name='ai_measurement_suggestions')
    input_measurement = models.ForeignKey(Measurement, on_delete=models.SET_NULL, null=True,
                                           blank=True)
    flagged_fields  = models.JSONField(default=list)   # ['chest_cm', 'hip_cm']
    correction_notes = models.TextField(blank=True)
    confidence_score = models.DecimalField(max_digits=4, decimal_places=3, null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_measurement_suggestions'


class AIPriceEstimate(models.Model):
    """
    AI-generated price estimate shown to a customer before tailor quotes.
    """
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interaction_log = models.OneToOneField(AIInteractionLog, on_delete=models.CASCADE,
                                            related_name='price_estimate')
    stitch_request  = models.ForeignKey(StitchRequest, on_delete=models.SET_NULL, null=True,
                                         blank=True, related_name='ai_price_estimates')
    estimated_min   = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_max   = models.DecimalField(max_digits=10, decimal_places=2)
    basis_notes     = models.TextField(blank=True)
    actual_price    = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_price_estimates'


class AIChatSession(models.Model):
    """
    Multi-turn AI chatbot conversation session (customer-facing help / tailor assistant).
    """
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                      related_name='ai_chat_sessions')
    context_type = models.CharField(max_length=60, blank=True)   # 'stitch_request', 'general' …
    context_id   = models.CharField(max_length=36, blank=True)
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    ended_at     = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ai_chat_sessions'


class AIChatMessage(models.Model):
    ROLE_CHOICES = [('user', 'User'), ('assistant', 'Assistant'), ('system', 'System')]

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session    = models.ForeignKey(AIChatSession, on_delete=models.CASCADE, related_name='messages')
    role       = models.CharField(max_length=12, choices=ROLE_CHOICES)
    content    = models.TextField()
    tokens     = models.PositiveIntegerField(default=0)
    sent_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_chat_messages'
        ordering = ['sent_at']

