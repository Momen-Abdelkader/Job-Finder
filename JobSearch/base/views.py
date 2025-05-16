from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Exists, OuterRef
from django.template.loader import render_to_string
from .models import User, UserProfile, AdminProfile, Job, JobApplication, Skill
from .choices import JOB_TYPE_CHOICES, WORK_MODE_CHOICES, EXP_LEVEL_CHOICES

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

# def adminDashboard(request):
#     return HttpResponse("Hello, world. You're at the base adminDashboard.")

# def adminDashboard(request, adminId):
def adminDashboard(request, pk):
    # admin = AdminProfile.objects.get(field_name = "yassotube")
    # company = admin.company_name
    # jobs = Job.objects.filter(company = 2)
    # obj = get_object_or_404(Job, company = company_name)
    
    user = User.objects.get(id = int(pk))
    company_name = user.adminprofile.company_name
    admin = AdminProfile.objects.get(user = user)
    jobs = Job.objects.filter(company__company_name = admin.company_name) # company = admin.company_name
    
    context = {
        'jobs' : jobs
    }

    """Render admin dashboard page"""
    return render(request, "admin.html", context)

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
                return redirect(f"adminDashboard/{auth_user.username}" if auth_user.is_admin else 'home')
            
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