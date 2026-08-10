from rest_framework import serializers

from .models import Payment, PaymentMode, Refund


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'payer', 'stitch_request', 'design_order', 'amount', 'currency',
            'payment_mode', 'status', 'escrow_status', 'gateway_name',
            'gateway_order_id', 'gateway_payment_id', 'paid_at', 'refunded_at',
            'created_at',
        ]
        read_only_fields = [
            'id', 'payer', 'status', 'escrow_status', 'gateway_payment_id',
            'paid_at', 'refunded_at', 'created_at',
        ]


class CreatePaymentSerializer(serializers.Serializer):
    payment_mode = serializers.ChoiceField(choices=PaymentMode.choices)
    stitch_request = serializers.UUIDField(required=False, allow_null=True)
    design_order = serializers.UUIDField(required=False, allow_null=True)

    def validate(self, attrs):
        if bool(attrs.get('stitch_request')) == bool(attrs.get('design_order')):
            raise serializers.ValidationError('Exactly one order reference is required.')
        return attrs


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = ['id', 'payment', 'amount', 'reason', 'gateway_refund_id', 'initiated_by', 'created_at', 'processed_at']
        read_only_fields = ['id', 'payment', 'initiated_by', 'created_at', 'processed_at']
