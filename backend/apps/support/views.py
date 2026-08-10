from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import CustomUser, UserRole

from .models import Dispute, DisputeStatus, SupportTicket, SupportTicketStatus
from .serializers import (
    CreateDisputeSerializer,
    CreateMessageSerializer,
    CreateSupportTicketSerializer,
    DisputeSerializer,
    SupportTicketMessageSerializer,
    SupportTicketSerializer,
    UpdateSupportTicketSerializer,
)
from .services import DisputeService, SupportService


def is_manager(user):
    return SupportService.can_manage(user)


class SupportTicketListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if is_manager(request.user):
            tickets = SupportTicket.objects.all()
        else:
            tickets = SupportTicket.objects.filter(raised_by=request.user)
        tickets = tickets.select_related('raised_by', 'assigned_to').order_by('-created_at')
        return Response({'success': True, 'tickets': SupportTicketSerializer(tickets, many=True).data})

    def post(self, request):
        serializer = CreateSupportTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = SupportService.create_ticket(raised_by=request.user, **serializer.validated_data)
        return Response(SupportTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)


class SupportTicketDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_ticket(self, request, ticket_id):
        ticket = SupportTicket.objects.filter(id=ticket_id).select_related('raised_by', 'assigned_to').first()
        if not ticket:
            return None, Response({'detail': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)
        if not is_manager(request.user) and ticket.raised_by_id != request.user.id and ticket.assigned_to_id != request.user.id:
            return None, Response({'detail': 'You do not have access to this ticket.'}, status=status.HTTP_403_FORBIDDEN)
        return ticket, None

    def get(self, request, ticket_id):
        ticket, error = self.get_ticket(request, ticket_id)
        if error:
            return error
        data = SupportTicketSerializer(ticket).data
        data['messages'] = SupportTicketMessageSerializer(ticket.messages.select_related('sender'), many=True).data
        data['disputes'] = DisputeSerializer(ticket.disputes.select_related('raised_by', 'resolved_by'), many=True).data
        return Response({'success': True, 'ticket': data})


class SupportTicketMessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):
        ticket = SupportTicket.objects.filter(id=ticket_id).first()
        if not ticket:
            return Response({'detail': 'Ticket not found.'}, status=404)
        if not is_manager(request.user) and ticket.raised_by_id != request.user.id and ticket.assigned_to_id != request.user.id:
            return Response({'detail': 'You do not have access to this ticket.'}, status=403)
        serializer = CreateMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = SupportService.add_message(ticket=ticket, sender=request.user, **serializer.validated_data)
        return Response(SupportTicketMessageSerializer(message).data, status=201)


class SupportTicketUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, ticket_id):
        if not is_manager(request.user):
            return Response({'detail': 'Support staff access required.'}, status=403)
        ticket = SupportTicket.objects.filter(id=ticket_id).first()
        if not ticket:
            return Response({'detail': 'Ticket not found.'}, status=404)
        serializer = UpdateSupportTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        assigned_to = None
        if 'assigned_to' in data and data['assigned_to']:
            assigned_to = CustomUser.objects.filter(id=data['assigned_to']).first()
            if not assigned_to or assigned_to.role not in {UserRole.SUPPORT, UserRole.ADMIN}:
                return Response({'detail': 'Assigned user must be support staff.'}, status=400)
        ticket = SupportService.update_ticket(ticket=ticket, actor=request.user, status=data.get('status'), priority=data.get('priority'), assigned_to=assigned_to)
        return Response(SupportTicketSerializer(ticket).data)


class DisputeListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        disputes = Dispute.objects.all() if is_manager(request.user) else Dispute.objects.filter(raised_by=request.user)
        disputes = disputes.select_related('ticket', 'raised_by', 'resolved_by').order_by('-created_at')
        return Response({'success': True, 'disputes': DisputeSerializer(disputes, many=True).data})

    def post(self, request):
        serializer = CreateDisputeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.validated_data['ticket']
        if ticket.raised_by_id != request.user.id:
            return Response({'detail': 'Only the ticket owner can raise a dispute.'}, status=403)
        if ticket.disputes.filter(status=DisputeStatus.OPEN).exists():
            return Response({'detail': 'An open dispute already exists for this ticket.'}, status=400)
        dispute = DisputeService.create(raised_by=request.user, ticket=ticket)
        return Response(DisputeSerializer(dispute).data, status=201)


class DisputeResolveAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, dispute_id):
        if not is_manager(request.user):
            return Response({'detail': 'Support staff access required.'}, status=403)
        dispute = Dispute.objects.filter(id=dispute_id).first()
        if not dispute:
            return Response({'detail': 'Dispute not found.'}, status=404)
        target_status = request.data.get('status')
        resolution = request.data.get('resolution', '')
        try:
            dispute = DisputeService.resolve(dispute=dispute, actor=request.user, status=target_status, resolution=resolution)
        except (ValueError, PermissionError) as exc:
            return Response({'detail': str(exc)}, status=400)
        return Response(DisputeSerializer(dispute).data)
