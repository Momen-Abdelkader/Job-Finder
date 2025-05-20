from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from .models import UserProfile, AdminProfile

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        if form:
            profile_type = form.cleaned_data.get('profile_type')
            if profile_type == 'company':
                company_name = form.cleaned_data.get('company_name')
                user.is_admin = True
                user.save()
                AdminProfile.objects.create(user=user, company_name=company_name)
            else:
                user.is_admin = False
                user.save()
                UserProfile.objects.create(user=user)
        return user