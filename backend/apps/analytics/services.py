from datetime import date
from decimal import Decimal

from django.db.models import Avg, Count, Q, Sum

from apps.accounts.models import CustomUser, UserRole
from apps.orders.models import DesignOrder, DesignOrderStatus, OrderStatus, StitchRequest
from apps.payments.models import Payment, PaymentStatus
from apps.reviews.models import Review

from .models import PlatformAnalyticsSnapshot, TailorAnalyticsSnapshot


class AnalyticsService:
    @staticmethod
    def tailor_snapshot(*, tailor, snapshot_date=None):
        snapshot_date = snapshot_date or date.today()
        stitch = StitchRequest.objects.filter(tailor=tailor)
        design_orders = DesignOrder.objects.filter(design__tailor=tailor)
        payments = Payment.objects.filter(status=PaymentStatus.PAID).filter(
            Q(stitch_request__tailor=tailor) | Q(design_order__design__tailor=tailor)
        )
        reviews = Review.objects.filter(tailor=tailor, is_visible=True)
        revenue = payments.aggregate(total=Sum('amount'))['total'] or Decimal('0')
        stats = reviews.aggregate(average=Avg('rating'), count=Count('id'))
        snapshot, _ = TailorAnalyticsSnapshot.objects.update_or_create(
            tailor=tailor,
            snapshot_date=snapshot_date,
            defaults={
                'total_orders': stitch.count() + design_orders.count(),
                'completed_orders': stitch.filter(status=OrderStatus.DELIVERED).count() + design_orders.filter(status=DesignOrderStatus.DELIVERED).count(),
                'cancelled_orders': stitch.filter(status=OrderStatus.CANCELLED).count() + design_orders.filter(status=DesignOrderStatus.CANCELLED).count(),
                'revenue': revenue,
                'average_rating': stats['average'] or Decimal('0'),
                'new_reviews': reviews.filter(created_at__date=snapshot_date).count(),
                'design_sales': design_orders.exclude(status=DesignOrderStatus.CANCELLED).count(),
            },
        )
        return snapshot

    @staticmethod
    def platform_snapshot(*, snapshot_date=None):
        snapshot_date = snapshot_date or date.today()
        payments = Payment.objects.filter(status=PaymentStatus.PAID)
        revenue = payments.aggregate(total=Sum('amount'))['total'] or Decimal('0')
        snapshot, _ = PlatformAnalyticsSnapshot.objects.update_or_create(
            snapshot_date=snapshot_date,
            defaults={
                'new_customers': CustomUser.objects.filter(role=UserRole.CUSTOMER, date_joined__date=snapshot_date).count(),
                'new_tailors': CustomUser.objects.filter(role=UserRole.TAILOR, date_joined__date=snapshot_date).count(),
                'total_orders': StitchRequest.objects.count() + DesignOrder.objects.count(),
                'total_revenue': revenue,
                'pending_orders': StitchRequest.objects.filter(status=OrderStatus.PENDING).count() + DesignOrder.objects.filter(status=DesignOrderStatus.PAYMENT_PENDING).count(),
                'active_disputes': 0,
            },
        )
        return snapshot
