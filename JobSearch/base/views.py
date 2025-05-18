from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Exists, OuterRef
from django.template.loader import render_to_string
from .models import User, UserProfile, AdminProfile, Job, JobApplication, Skill
from .choices import JOB_TYPE_CHOICES, WORK_MODE_CHOICES, EXP_LEVEL_CHOICES
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.template.defaultfilters import date as _date_filter
from django.contrib.staticfiles.storage import staticfiles_storage
import json

# Constants
MAX_SALARY_RANGE = 20000
FILTER_CONFIG = [
    {
        "category": {"name": "Type Of Employment", "id": "job_type"},
        "filters": [
            {"id": "full_time", "name": "Full-Time"},
            {"id": "part_time", "name": "Part-Time"},
            {"id": "internship", "name": "Internship"},
        ]
    },
    {
        "category": {"name": "Work Mode", "id": "work_type"},
        "filters": [
            {"id": "remote", "name": "Remote"},
            {"id": "on_site", "name": "On-Site"},
            {"id": "hybrid", "name": "Hybrid"},
        ]
    },
    {
        "category": {"name": "Level", "id": "exp_level"},
        "filters": [
            {"id": "senior", "name": "Senior"},
            {"id": "mid_level", "name": "Mid-Level"},
            {"id": "junior", "name": "Junior"},
            {"id": "fresh_graduate", "name": "Fresh Graduate"},
            {"id": "student", "name": "Student"},
        ]
    }
]

def get_job_details_api(request, job_id):
    job = get_object_or_404(Job, pk=job_id)
    
    user_has_applied = False
    if request.user.is_authenticated and not request.user.is_admin:
        try:
            # Assuming your User model has a one-to-one relation to UserProfile named 'userprofile'
            # If it's different (e.g., 'profile'), adjust request.user.userprofile accordingly
            user_profile = request.user.userprofile 
            user_has_applied = JobApplication.objects.filter(user=user_profile, job=job).exists()
        except UserProfile.DoesNotExist:
            user_has_applied = False 
        except AttributeError: # In case user has no 'userprofile' attribute (e.g. admin user)
             user_has_applied = False


    skills_list = [skill.skill for skill in job.skills_required.all()]
    print (skills_list)

    # Provide a default logo path if company logo is not set
    # Make sure 'images/default_logo.png' exists in your static files directory
    # e.g., static/images/default_logo.png
    company_logo_url = staticfiles_storage.url('images/default_logo.png') 
    if job.company.user.profile_photo and hasattr(job.company.user.profile_photo, 'url'):
        company_logo_url = job.company.user.profile_photo.url

    job_data = {
        'id': job.id,
        'title': job.job_title,
        'company_name': job.company.company_name,
        'company_logo_url': company_logo_url,
        'location': job.location,
        'posted_at': _date_filter(job.published_date, "M d, Y"), # Format: Apr 20, 2025
        'salary': f"${job.salary}" if job.salary is not None else "N/A",
        'job_type_display': job.get_job_type_display(),
        'experience_level_display': job.get_exp_level_display(),
        'work_mode_display': job.get_work_type_display(), 
        'description': job.description,
        'skills': skills_list,
        'user_has_applied': user_has_applied,
    }
    return JsonResponse(job_data)

@login_required
@require_POST # Ensures this view only accepts POST requests
def apply_for_job_api(request, job_id):
    if request.user.is_admin: # Admins cannot apply
        return JsonResponse({'success': False, 'message': 'Admins cannot apply for jobs.'}, status=403)

    job_to_apply = get_object_or_404(Job, pk=job_id)
    
    try:
        user_profile = request.user.userprofile # Assumes User has a 'userprofile' related object
    except UserProfile.DoesNotExist:
        # This case should ideally be handled by ensuring UserProfile is created upon user registration
        return JsonResponse({'success': False, 'message': 'User profile not found. Please complete your profile.'}, status=400)

    # Check if already applied
    if JobApplication.objects.filter(user=user_profile, job=job_to_apply).exists():
        return JsonResponse({'success': False, 'message': 'You have already applied for this job.'})

    try:
        JobApplication.objects.create(user=user_profile, job=job_to_apply)
        return JsonResponse({'success': True, 'message': 'Application submitted successfully!'})
    except Exception as e:
        # Log the error e for debugging
        print(f"Error during application: {e}")
        return JsonResponse({'success': False, 'message': 'An error occurred. Please try again.'}, status=500)

def home(request):
    """Render the home page."""
    return render(request, 'home.html')

def profile(request):
    """Base profile view."""
    return HttpResponse("Hello, world. You're at the base profile.")

def _normalize_search_term(term):
    """Normalize search terms for filter matching."""
    return term.lower().replace('-', '').replace(' ', '').replace('_', '')

def _build_search_query(normalized_search):
    """Construct Q objects for job search."""
    CHOICE_MAP = {
        'job_type': {_normalize_search_term(v): k for k, v in JOB_TYPE_CHOICES},
        'work_type': {_normalize_search_term(v): k for k, v in WORK_MODE_CHOICES},
        'exp_level': {_normalize_search_term(v): k for k, v in EXP_LEVEL_CHOICES},
    }

    q_objects = Q()
    search_terms = normalized_search.split()
    
    for term in search_terms:
        for field, mapping in CHOICE_MAP.items():
            if term in mapping:
                q_objects |= Q(**{f"{field}": mapping[term]})
    
    q_objects |= (
        Q(job_title__icontains=normalized_search) |
        Q(location__icontains=normalized_search) |
        Q(description__icontains=normalized_search) |
        Q(company__company_name__icontains=normalized_search) |
        Q(skills_required__skill__icontains=normalized_search)
    )
    return q_objects

def jobs(request):
    """Display and filter job listings."""
    # Get filter parameters
    search_query = request.GET.get('q', '').strip()
    show_applied = request.GET.get('show_applied') == 'true'
    min_salary = max(int(request.GET.get('min_salary', 0)), 0)
    max_salary = min(int(request.GET.get('max_salary', MAX_SALARY_RANGE)), MAX_SALARY_RANGE)
    selected_filters = {key: request.GET.getlist(key) for key in ['job_type', 'work_type', 'exp_level']}

    jobs = Job.objects.all()

    # Applied jobs filter
    if request.user.is_authenticated and show_applied:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            applied_jobs = JobApplication.objects.filter(user=user_profile).values_list('job_id', flat=True)
            jobs = jobs.filter(id__in=applied_jobs)
        except UserProfile.DoesNotExist:
            messages.error(request, "Please complete your profile first")
            return redirect('profile')

    # Apply filters
    jobs = jobs.filter(salary__gte=min_salary, salary__lte=max_salary)
    
    if search_query:
        normalized_search = _normalize_search_term(search_query)
        jobs = jobs.filter(_build_search_query(normalized_search)).distinct()

    for key, values in selected_filters.items():
        if values:
            jobs = jobs.filter(**{f"{key}__in": values})

    # Annotate application status
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            subquery = JobApplication.objects.filter(job=OuterRef('pk'), user=user_profile)
        except UserProfile.DoesNotExist:
            subquery = JobApplication.objects.none()
        
        jobs = jobs.annotate(has_applied=Exists(subquery))

    # Update filter counts
    for category in FILTER_CONFIG:
        field_name = category["category"]["id"]
        for f in category["filters"]:
            f["count"] = jobs.filter(**{field_name: f["id"]}).count()
            f["selected"] = f["id"] in selected_filters.get(field_name, [])

    context = {
        'jobs': jobs,
        'job_count': jobs.count(),
        'filters': FILTER_CONFIG,
        'min_salary': min_salary,
        'max_salary': max_salary,
        'min_salary_range': 0,
        'max_salary_range': MAX_SALARY_RANGE,
        'search_query': search_query,
        'show_applied': show_applied,
    }

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'jobs_html': render_to_string('job-list-partial.html', {'jobs': jobs, 'user': request.user}),
            'job_count': jobs.count(),
            'filters': [{
                "category": c["category"],
                "filters": [{"id": f["id"], "count": f["count"], "selected": f["selected"]} for f in c["filters"]]
            } for c in FILTER_CONFIG]
        })

    return render(request, 'jobs.html', context)

def adminDashboard(request):
    admin = AdminProfile.objects.get(user = request.user)
    jobs = Job.objects.filter(company__company_name = admin.company_name)     
    context = {
        'jobs' : jobs,
        'skills' : Skill.objects.all(),
        'admin' : admin,
    }
    if request.method == 'POST':
        skills_json = request.POST.get('skillz', '[]')
        skills = json.loads(skills_json)
        skills = list(dict.fromkeys(skills))
        print (skills)
        if 'add-job' in request.POST:
            try:
                new_job = Job.objects.create(
                company = admin,
                job_title = request.POST.get('title'),
                work_type = request.POST.get('work-type'),
                job_type = request.POST.get('job-type'),
                exp_level = request.POST.get('experience'),
                salary = request.POST.get('salary'),
                location = request.POST.get('location'),
                description = request.POST.get('description'),
                )

                for skill_name in skills:
                    skill_obj, created = Skill.objects.get_or_create(skill=skill_name)
                    new_job.skills_required.add(skill_obj)

                messages.success(request, "Job added successfully")
            except Exception as e:
                messages.error(request, f"Error creating job: {str(e)}")
            return redirect('adminDashboard')
        
        
        elif 'confirm-delete-job' in request.POST:
            job_id = request.POST.get('hidden-job-id')
            try:
                job = Job.objects.get(id=job_id)
                job.delete()
                messages.success(request, "Job deleted successfully")
            except Job.DoesNotExist:
                messages.error(request, "Job not found")
            return redirect('adminDashboard')
        
        elif 'edit-job' in request.POST:
            job_id = request.POST.get('job-Id')
            try:
                job = Job.objects.get(id=job_id)
                job.job_title = request.POST.get('title')
                job.work_type = request.POST.get('work-type')
                job.job_type = request.POST.get('job-type')
                job.exp_level = request.POST.get('experience')
                job.salary = request.POST.get('salary')
                job.location = request.POST.get('location')
                job.description = request.POST.get('description')
                job.save()
                job.skills_required.clear()
                for skill_name in skills:
                    skill_obj, created = Skill.objects.get_or_create(skill=skill_name)
                    job.skills_required.add(skill_obj)
                messages.success(request, "Job updated successfully")

            except Job.DoesNotExist:
                messages.error(request, "Failed to update Job")
            return redirect('adminDashboard')

    """Render admin dashboard page"""
    return render(request, "admin-dashboard.html", context)


def loginView(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(email=email)
            auth_user = authenticate(request, username=user.username, password=password)
            
            if auth_user:
                login(request, auth_user)
                messages.success(request, "Login successful!")
                return redirect('adminDashboard' if auth_user.is_admin else 'home')
            
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
        
        # Validation checks
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
        
        # Create user
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
                AdminProfile.objects.create(user=user, company_name=request.POST.get('company_name'))
            
            messages.success(request, "Account created successfully!")
            return redirect('login')
        except Exception as e:
            messages.error(request, f"Error creating account: {str(e)}")
            return redirect('signup')
    
    return render(request, 'signup.html')

def resetPassword(request):
    return render(request, 'forgot-password.html')

def logoutUser(request):
    """Handle user logout."""
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('home')