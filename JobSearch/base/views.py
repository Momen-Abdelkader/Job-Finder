from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import User, UserProfile, AdminProfile
from .forms import UserProfileForm, UserPreferenceForm, AdminProfileForm, UserForm

def home(request):
    return render(request, 'home.html')

from django.contrib import messages

@login_required
def profile(request):
    user = request.user
    if user.is_admin:
        profile = user.adminprofile
        profile_form = AdminProfileForm
    else:
        profile = user.userprofile
        profile_form = UserProfileForm

    if request.method == 'POST':
        if 'save-changes' in request.POST:
            basic_info_form = UserForm(request.POST, request.FILES, instance=user)
            profile_form = profile_form(request.POST, instance=profile)
            
            if basic_info_form.is_valid() and profile_form.is_valid():
                basic_info_form.save()
                profile_form.save()
                messages.success(request, 'Profile updated successfully!')
                return redirect('profile')
            
            messages.error(request, 'Please correct the errors below')

        elif 'save-preferences' in request.POST:
            basic_info_form = UserForm(instance=user) # No changes
            preference_form = UserPreferenceForm(request.POST, instance=profile)
            if preference_form.is_valid():
                preference_form.save()
                messages.success(request, 'Preferences saved successfully!')
                return redirect('profile')
            
            messages.error(request, 'Please correct the errors below ')

    else:
        basic_info_form = UserForm(instance=user)
        profile_form = profile_form(instance=profile)
        preference_form = UserPreferenceForm(instance=profile)

    context = {
        'basic_info_form': basic_info_form,
        'profile_form': profile_form,
        'preference_form': preference_form if not user.is_admin else None,
    }
    
    return render(request, 'profile.html', context)

def jobs(request):
    return HttpResponse("Hello, world. You're at the base jobs.")

def adminDashboard(request):
    return HttpResponse("Hello, world. You're at the base adminDashboard.")

def loginView(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(email=email)
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user is not None:
                login(request, authenticated_user)
                messages.success(request, "Login successful!")
                if authenticated_user.is_admin:
                    return redirect('adminDashboard')
                return redirect('home')
            else:
                messages.error(request, "Invalid email or password.")
        except User.DoesNotExist:
            messages.error(request, "Invalid email or password.")
        
        return redirect('login')
    
    return render(request, 'login.html')

def signupView(request):
    if request.method == 'POST':
        username = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        user_type = request.POST.get('user_type', 'normal')
        
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect('signup')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect('signup')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect('signup')
        
        if user_type == 'company' and not request.POST.get('company_name'):
            messages.error(request, "Company name is required for company accounts.")
            return redirect('signup')
        
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_admin=(user_type == 'company')
            )
            
            if user_type == 'normal':
                UserProfile.objects.create(user=user)
            else:
                company_name = request.POST.get('company_name')
                AdminProfile.objects.create(user=user, company_name=company_name)
            
            messages.success(request, "Account created successfully!")
            return redirect('login') # TODO: redirect to home
        except Exception as e:
            messages.error(request, f"Error creating account: {str(e)}")
            return redirect('signup')
    
    print("Rendering signup page")
    return render(request, 'signup.html')

def resetPassword(request):
    return render(request, 'forgot-password.html')

def logoutUser(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('home')