from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from .models import UserProfile

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        
        if not user.is_admin and not hasattr(user, 'userprofile'):
            UserProfile.objects.create(user=user)
        return user