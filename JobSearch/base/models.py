from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    user_type_choice = (
        ('normal', 'Normal User'),
        ('company', 'Company User'),
    )

    user_type = models.CharField(max_length=10, choices=user_type_choice, default='normal')
    profile_photo = models.ImageField(upload_to='photos/%y/%m/%d', blank=True, null=True)
    phone = models.CharField(max_length=12, blank=True)
    created_date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return str(self.id)
    

class UserProfile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type':'normal'})
    location = models.CharField(max_length=100, null=True, blank=True)
    job_title = models.CharField(max_length=50, null=True, blank=True)
    resume_url = models.URLField(max_length=200, null=True, blank=True)

    # Experience Level : Student, Fresh Grad, Junior, Mid-Level, Senior
    exp_level_choices = [
        ('student', 'Student'),
        ('fresh_graduate', 'Fresh-Graduate'),
        ('junior', 'Junior'),
        ('mid_level', 'Mid-Level'),
        ('senior', 'Senior')
    ]
    exp_level = models.CharField(max_length=15, choices=exp_level_choices, blank=True)

    # Work Type : On-Site, Remote, Hybrid
    work_mode_choices = [
        ('on_site', 'On-Site'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    ]
    work_mode = models.CharField(max_length=10, choices=work_mode_choices, blank=True)

    # Job Type : Full-Time, Part-Time, Internship
    job_type_choices = [
        ('full_time', 'Full-Time'),
        ('part_time', 'Part-Time'),
        ('internship', 'Internship'),
    ]
    job_type = models.CharField(max_length=10, choices=job_type_choices, blank=True)
    apply_to = models.ManyToManyField('Job', blank=True)

    def __str__(self):
        return str(self.user_id)

class AdminProfile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type':'company'})
    company_name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.user_id)

class Job(models.Model):
    job_title = models.CharField(max_length=50)
    work_type_choices = [
        ('on_site', 'On-Site'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    ]
    work_type = models.CharField(max_length=10, choices=work_type_choices, blank=True)
    job_type_choices = [
        ('full_time', 'Full-Time'),
        ('part_time', 'Part-Time'),
        ('internship', 'Internship'),
    ]
    job_type = models.CharField(max_length=10, choices=job_type_choices, blank = True)
    exp_level_choices = [
        ('student', 'Student'),
        ('fresh_graduate', 'Fresh-Graduate'),
        ('junior', 'Junior'),
        ('mid_level', 'Mid-Level'),
        ('senior', 'Senior')
    ]
    exp_level = models.CharField(max_length=15, choices=exp_level_choices, blank=True)
    salary = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    published_date = models.DateTimeField(default=datetime.now)
    description = models.TextField(max_length=1000, blank=True)
    publisher_id = models.ForeignKey(AdminProfile, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

class UserSkill(models.Model):
    skill = models.CharField(max_length=30)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user_id)

class RequiredSkill(models.Model):
    skill = models.CharField(max_length=30)
    job_id = models.ForeignKey(Job, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.job_id)

class UserInterest(models.Model):
    interest = models.CharField(max_length=30)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, limit_choices_to={'user_type':'normal'})

    def __str__(self):
        return str(self.user_id)