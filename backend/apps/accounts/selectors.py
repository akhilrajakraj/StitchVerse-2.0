from .models import CustomUser, CustomerProfile, Measurement


class AccountSelectors:
    """Reusable, read-only database queries for account workflows."""

    @staticmethod
    def get_user_by_email(email):
        return CustomUser.objects.filter(email=email).first()

    @staticmethod
    def get_customer_profile(user):
        return (
            CustomerProfile.objects.filter(user=user)
            .select_related("user", "address")
            .first()
        )

    @staticmethod
    def get_user_status(status):
        return CustomUser.objects.filter(status=status).first()

    @staticmethod
    def get_user_measurements(user):
        return user.measurements.all().order_by("-updated_at")

    @staticmethod
    def get_measurement_by_id(measurement_id, customer=None):
        queryset = Measurement.objects.filter(id=measurement_id)
        if customer is not None:
            queryset = queryset.filter(customer=customer)
        return queryset.first()
