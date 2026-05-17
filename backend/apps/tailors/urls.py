from django.urls import path


from .views import(
    RegisterTailorAPIView,
)

urlpatterns = [
    
    path(
        'register/',
        RegisterTailorAPIView.as_view(),
        name='register_tailor',
    )
]
