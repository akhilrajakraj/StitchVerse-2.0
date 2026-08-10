from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import CreatePaymentSerializer, PaymentSerializer, RefundSerializer
from .services_api import PaymentAPIServices


class CreatePaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = PaymentAPIServices.create_payment(
            payer=request.user,
            payment_mode=serializer.validated_data['payment_mode'],
            stitch_request_id=serializer.validated_data.get('stitch_request'),
            design_order_id=serializer.validated_data.get('design_order'),
        )
        return Response(PaymentSerializer(payment).data, status=201)


class ConfirmPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id, payer=request.user).first()
        if not payment:
            return Response({'detail': 'Payment not found.'}, status=404)
        payment = PaymentAPIServices.confirm_payment(
            payment,
            gateway_payment_id=request.data.get('gateway_payment_id', ''),
            gateway_signature=request.data.get('gateway_signature', ''),
        )
        return Response(PaymentSerializer(payment).data)


class PaymentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id, payer=request.user).first()
        if not payment:
            return Response({'detail': 'Payment not found.'}, status=404)
        return Response(PaymentSerializer(payment).data)


class CreateRefundAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id).first()
        if not payment:
            return Response({'detail': 'Payment not found.'}, status=404)
        if not request.user.is_staff:
            return Response({'detail': 'Staff access required.'}, status=403)
        refund = PaymentAPIServices.create_refund(
            payment,
            initiated_by=request.user,
            reason=request.data.get('reason', ''),
        )
        return Response(RefundSerializer(refund).data, status=201)
