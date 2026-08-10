"""Project URL configuration."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/tailors/', include('apps.tailors.urls')),
    path('api/v1/designs/', include('apps.designs.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/reviews/', include('apps.reviews.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/staff/', include('apps.staff.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
