from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .services import NotificationService


class NotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        unread_only = request.query_params.get('unread') == 'true'
        queryset = Notification.objects.filter(recipient=request.user).order_by('-created_at')
        if unread_only:
            queryset = queryset.filter(is_read=False)
        data = [
            {
                'id': str(item.id),
                'channel': item.channel,
                'title': item.title,
                'body': item.body,
                'is_read': item.is_read,
                'related_object_type': item.related_object_type,
                'related_object_id': item.related_object_id,
                'created_at': item.created_at,
                'read_at': item.read_at,
            }
            for item in queryset
        ]
        return Response({'success': True, 'notifications': data})


class NotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        notification = Notification.objects.filter(id=notification_id, recipient=request.user).first()
        if not notification:
            return Response({'success': False, 'message': 'Notification not found.'}, status=404)
        NotificationService.mark_read(notification, recipient=request.user)
        return Response({'success': True, 'message': 'Notification marked as read.'})
