from .models import UserProfile

class EnsureUserProfileMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, 'user', None)
        if user and user.is_authenticated and not user.is_admin:
            try:
                user.userprofile
            except UserProfile.DoesNotExist:
                UserProfile.objects.create(user=user)
        return self.get_response(request)