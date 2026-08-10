from rest_framework import serializers

from .models import TailorApprovalStatus, TailorProfile


class TailorApprovalSerializer(serializers.Serializer):
    action = serializers.ChoiceField(
        choices=(
            ("approve", "Approve"),
            ("reject", "Reject"),
            ("remove", "Remove"),
        )
    )
    reason = serializers.CharField(required=False, allow_blank=True, max_length=500)

    def validate(self, attrs):
        action = attrs["action"]
        profile = self.context["profile"]
        if action == "approve" and profile.approval_status == TailorApprovalStatus.REMOVED:
            raise serializers.ValidationError("Removed tailors cannot be approved.")
        return attrs
