from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from .models import UserProfile, AdminProfile

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        
        # Get form data from POST if form object is not available
        if request and request.POST:
            profile_type = request.POST.get('user_type')
            company_name = request.POST.get('company_name')
            
            # Log received data for debugging
            print("POST data:", request.POST)
            print(f"Received profile_type: {profile_type}, company_name: {company_name}")
            
            if profile_type == 'company' and company_name:
                user.is_admin = True
                user.save()
                AdminProfile.objects.create(user=user, company_name=company_name)
            else:
                user.is_admin = False
                user.save()
                UserProfile.objects.create(user=user)
        else:
            # Default to regular user if no form data
            user.is_admin = False
            user.save()
            UserProfile.objects.create(user=user)
            
        return user