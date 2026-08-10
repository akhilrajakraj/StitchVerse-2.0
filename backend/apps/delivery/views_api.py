from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DeliveryAssignment
from .services import DeliveryService


class DeliveryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assignment_id):
        assignment = DeliveryAssignment.objects.filter(id=assignment_id).first()
        if not assignment or (assignment.agent_id != request.user.id and not request.user.is_staff):
            return Response({'detail': 'Delivery assignment not found.'}, status=404)
        return Response({
            'id': str(assignment.id),
            'stitch_request': str(assignment.stitch_request_id),
            'agent': str(assignment.agent_id) if assignment.agent_id else None,
            'status': assignment.status,
            'delivery_address': str(assignment.delivery_address) if assignment.delivery_address else None,
            'assigned_at': assignment.assigned_at,
            'picked_up_at': assignment.picked_up_at,
            'delivered_at': assignment.delivered_at,
        })


class DeliveryTransitionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assignment_id):
        assignment = DeliveryAssignment.objects.filter(id=assignment_id, agent=request.user).first()
        if not assignment:
            return Response({'detail': 'Delivery assignment not found.'}, status=404)
        updated = DeliveryService.transition(
            assignment,
            request.data.get('status'),
            proof_note=request.data.get('proof_note', ''),
        )
        return Response({'id': str(updated.id), 'status': updated.status})


class DeliveryLocationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assignment_id):
        assignment = DeliveryAssignment.objects.filter(id=assignment_id, agent=request.user).first()
        if not assignment:
            return Response({'detail': 'Delivery assignment not found.'}, status=404)
        log = DeliveryService.record_location(
            assignment=assignment,
            latitude=request.data.get('latitude'),
            longitude=request.data.get('longitude'),
        )
        return Response({'id': str(log.id), 'latitude': str(log.latitude), 'longitude': str(log.longitude)})
