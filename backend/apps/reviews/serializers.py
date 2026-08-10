from rest_framework import serializers

from .models import FeedbackType, Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'tailor', 'feedback_type', 'stitch_request', 'design_order', 'rating', 'comment', 'is_visible', 'created_at']
        read_only_fields = ['id', 'reviewer', 'is_visible', 'created_at']


class CreateReviewSerializer(serializers.Serializer):
    tailor = serializers.UUIDField()
    feedback_type = serializers.ChoiceField(choices=FeedbackType.choices)
    stitch_request = serializers.UUIDField(required=False, allow_null=True)
    design_order = serializers.UUIDField(required=False, allow_null=True)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=5000)

    def validate(self, attrs):
        feedback_type = attrs['feedback_type']
        if feedback_type == FeedbackType.STITCH_REQUEST:
            if not attrs.get('stitch_request') or attrs.get('design_order'):
                raise serializers.ValidationError('A stitch request is required for this review type.')
        elif feedback_type == FeedbackType.DESIGN_PURCHASE:
            if not attrs.get('design_order') or attrs.get('stitch_request'):
                raise serializers.ValidationError('A design order is required for this review type.')
        return attrs
