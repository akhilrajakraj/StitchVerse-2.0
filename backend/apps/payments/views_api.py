from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
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
            **serializer.validated_data,
        )
        return Response(
            {'success': True, 'payment': PaymentSerializer(payment).data},
            status=status.HTTP_201_CREATED,
        )


class ConfirmPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id, payer=request.user).first()
        if not payment:
            return Response({'success': False, 'message': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
        payment = PaymentAPIServices.confirm_payment(
            payment,
            gateway_payment_id=request.data.get('gateway_payment_id', ''),
            gateway_signature=request.data.get('gateway_signature', ''),
        )
        return Response({'success': True, 'payment': PaymentSerializer(payment).data})


class MyPaymentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id, payer=request.user).first()
        if not payment:
            return Response({'success': False, 'message': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'payment': PaymentSerializer(payment).data})


class RefundPaymentAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id).first()
        if not payment:
            return Response({'success': False, 'message': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
        refund = PaymentAPIServices.create_refund(
            payment,
            initiated_by=request.user,
            reason=request.data.get('reason', 'Refund requested by staff.'),
        )
        return Response({'success': True, 'refund': RefundSerializer(refund).data})
