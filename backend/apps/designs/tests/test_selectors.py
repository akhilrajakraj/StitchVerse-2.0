from decimal import Decimal

from django.test import TestCase

from apps.accounts.models import CustomUser, UserRole

from ..models import Design, DesignCategory
from ..selectors import DesignSelectors


class DesignSelectorTests(TestCase):
    def setUp(self):
        self.tailor = CustomUser.objects.create_user(
            email='tailor@example.com', password='StrongPass123!', role=UserRole.TAILOR
        )
        self.other_tailor = CustomUser.objects.create_user(
            email='other@example.com', password='StrongPass123!', role=UserRole.TAILOR
        )
        self.category = DesignCategory.objects.create(name='Formal', slug='formal')
        self.design = Design.objects.create(
            tailor=self.tailor,
            category=self.category,
            name='Classic Shirt',
            description='A classic formal shirt design.',
            price=Decimal('1200.00'),
        )
        self.other = Design.objects.create(
            tailor=self.other_tailor,
            category=self.category,
            name='Modern Shirt',
            description='A modern formal shirt design.',
            price=Decimal('2200.00'),
        )

    def test_active_designs_filter_by_search(self):
        results = DesignSelectors.get_active_designs(search='classic')
        self.assertEqual(list(results), [self.design])

    def test_active_designs_filter_by_price(self):
        results = DesignSelectors.get_active_designs(max_price=1500)
        self.assertEqual(list(results), [self.design])

    def test_tailor_designs_are_scoped(self):
        results = DesignSelectors.get_tailor_designs(self.tailor)
        self.assertEqual(list(results), [self.design])

    def test_inactive_designs_are_hidden_from_marketplace(self):
        self.design.is_active = False
        self.design.save(update_fields=['is_active'])
        self.assertEqual(list(DesignSelectors.get_all_designs()), [self.other])
