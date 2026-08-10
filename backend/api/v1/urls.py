from django.urls import include, path

urlpatterns = [
    path('accounts/', include('apps.accounts.urls')),
    path('tailors/', include('apps.tailors.urls')),
    path('designs/', include('apps.designs.urls')),
    path('orders/', include('apps.orders.urls')),
]
