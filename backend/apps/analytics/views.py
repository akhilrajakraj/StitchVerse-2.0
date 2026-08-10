from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import UserRole

from .models import PlatformAnalyticsSnapshot, TailorAnalyticsSnapshot


class TailorAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in {UserRole.TAILOR, UserRole.ADMIN, UserRole.STAFF}:
            return Response({'detail': 'Tailor analytics access required.'}, status=403)
        snapshots = TailorAnalyticsSnapshot.objects.filter(tailor=request.user).order_by('-snapshot_date')[:30]
        return Response([
            {
                'date': item.snapshot_date,
                'total_orders': item.total_orders,
                'completed_orders': item.completed_orders,
                'cancelled_orders': item.cancelled_orders,
                'revenue': item.revenue,
                'average_rating': item.average_rating,
                'new_reviews': item.new_reviews,
                'design_sales': item.design_sales,
            }
            for item in snapshots
        ])


class PlatformAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not (request.user.is_staff or request.user.role in {UserRole.ADMIN, UserRole.STAFF}):
            return Response({'detail': 'Staff analytics access required.'}, status=403)
        snapshots = PlatformAnalyticsSnapshot.objects.order_by('-snapshot_date')[:30]
        return Response([
            {
                'date': item.snapshot_date,
                'new_customers': item.new_customers,
                'new_tailors': item.new_tailors,
                'total_orders': item.total_orders,
                'total_revenue': item.total_revenue,
                'pending_orders': item.pending_orders,
                'active_disputes': item.active_disputes,
            }
            for item in snapshots
        ])
