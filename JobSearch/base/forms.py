from .models import User, UserProfile, AdminProfile 
from django import forms

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['profile_photo', 'phone']
        widgets = {
            'profile_photo': forms.FileInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'})
        }

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['location', 'job_title', 'resume_url']
        widgets = {
            'resume_url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'Resume URL'
            })
        }

class UserPreferenceForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['preferred_exp_level', 'preferred_work_mode', 'preferred_job_type']
        widgets = {
            'preferred_exp_level': forms.Select(attrs={'class': 'styled-select'}),
            'preferred_work_mode': forms.Select(attrs={'class': 'styled-select'}),
            'preferred_job_type': forms.Select(attrs={'class': 'styled-select'})
        }

class AdminProfileForm(forms.ModelForm):
    class Meta:
        model = AdminProfile
        fields = ['company_name']