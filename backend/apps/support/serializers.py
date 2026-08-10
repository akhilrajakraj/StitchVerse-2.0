from rest_framework import serializers

from .models import Dispute, SupportTicket, SupportTicketMessage


class SupportTicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicketMessage
        fields = ('id', 'ticket', 'sender', 'sender_name', 'body', 'attachment', 'sent_at')
        read_only_fields = ('id', 'sender', 'sent_at')

    def get_sender_name(self, obj):
        return obj.sender.get_full_name() or obj.sender.email


class SupportTicketSerializer(serializers.ModelSerializer):
    raised_by_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = ('id', 'raised_by', 'raised_by_name', 'assigned_to', 'assigned_to_name', 'stitch_request', 'design_order', 'subject', 'description', 'status', 'priority', 'created_at', 'resolved_at')
        read_only_fields = ('id', 'raised_by', 'status', 'assigned_to', 'created_at', 'resolved_at')

    def get_raised_by_name(self, obj):
        return obj.raised_by.get_full_name() or obj.raised_by.email

    def get_assigned_to_name(self, obj):
        if not obj.assigned_to:
            return None
        return obj.assigned_to.get_full_name() or obj.assigned_to.email


class CreateSupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ('subject', 'description', 'priority', 'stitch_request', 'design_order')


class UpdateSupportTicketSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=SupportTicket._meta.get_field('status').choices, required=False)
    priority = serializers.ChoiceField(choices=SupportTicket._meta.get_field('priority').choices, required=False)
    assigned_to = serializers.UUIDField(required=False, allow_null=True)


class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicketMessage
        fields = ('body', 'attachment')


class DisputeSerializer(serializers.ModelSerializer):
    raised_by_name = serializers.SerializerMethodField()
    resolved_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Dispute
        fields = ('id', 'ticket', 'raised_by', 'raised_by_name', 'status', 'resolution', 'resolved_by', 'resolved_by_name', 'created_at', 'resolved_at')
        read_only_fields = ('id', 'raised_by', 'status', 'resolved_by', 'created_at', 'resolved_at')

    def get_raised_by_name(self, obj):
        return obj.raised_by.get_full_name() or obj.raised_by.email

    def get_resolved_by_name(self, obj):
        if not obj.resolved_by:
            return None
        return obj.resolved_by.get_full_name() or obj.resolved_by.email


class CreateDisputeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispute
        fields = ('ticket',)
