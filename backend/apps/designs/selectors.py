from django.db.models import Q, Prefetch

from .models import Design, DesignImage


class DesignSelectors:
    @staticmethod
    def get_all_designs():
        return Design.objects.filter(is_active=True).select_related('tailor', 'category').prefetch_related('images')

    @staticmethod
    def get_design_by_id(design_id, active_only=False):
        queryset = Design.objects.select_related('tailor', 'category').prefetch_related('images')
        if active_only:
            queryset = queryset.filter(is_active=True)
        return queryset.filter(id=design_id).first()

    @staticmethod
    def get_tailor_designs(tailor):
        return Design.objects.filter(tailor=tailor).select_related('category').prefetch_related('images')

    @staticmethod
    def get_active_designs(search=None, category=None, tailor=None, min_price=None, max_price=None):
        queryset = Design.objects.filter(is_active=True).select_related('tailor', 'category').prefetch_related('images')
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if category:
            queryset = queryset.filter(category_id=category)
        if tailor:
            queryset = queryset.filter(tailor_id=tailor)
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)
        return queryset.order_by('-created_at')
