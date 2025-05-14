from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractUser
from .choices import USER_TYPE_CHOICES, WORK_MODE_CHOICES, JOB_TYPE_CHOICES, EXP_LEVEL_CHOICES

class User(AbstractUser):
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='normal')
    profile_photo = models.ImageField(upload_to='photos/%y/%m/%d', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True)
    created_date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return str(self.id)
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type':'normal'})
    location = models.CharField(max_length=100, null=True, blank=True)
    job_title = models.CharField(max_length=50, null=True, blank=True)
    resume_url = models.URLField(max_length=200, null=True, blank=True)

    preferred_exp_level = models.CharField(max_length=15, choices=EXP_LEVEL_CHOICES, blank=True)
    preferred_work_mode = models.CharField(max_length=10, choices=WORK_MODE_CHOICES, blank=True)
    preferred_job_type = models.CharField(max_length=10, choices=JOB_TYPE_CHOICES, blank=True)

    interests = models.ManyToManyField('Interest', blank=True)
    
    def __str__(self):
        return str("User Profile: " + self.user.username)

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type':'company'})
    company_name = models.CharField(max_length=100)
    
    def __str__(self):
        return str("Company Profile: " + self.user.username + " " + self.company_name)

class Job(models.Model):
    job_title = models.CharField(max_length=50)

    work_type = models.CharField(max_length=10, choices=WORK_MODE_CHOICES, blank=True)
    job_type = models.CharField(max_length=10, choices=JOB_TYPE_CHOICES, blank = True)
    exp_level = models.CharField(max_length=15, choices=EXP_LEVEL_CHOICES, blank=True)

    salary = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    published_date = models.DateTimeField(default=datetime.now)
    description = models.TextField(max_length=1000, blank=True)
    company = models.ForeignKey(AdminProfile, on_delete=models.CASCADE)
    skills_required = models.ManyToManyField('Skill', blank=True)

    def __str__(self):
        return str(self.id)

class JobApplication(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    date = models.DateTimeField(default=datetime.now)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return str(self.user.user_id.username + " applied to " + self.job.job_title + " at " + str(self.date))

class Skill(models.Model):
    skill = models.CharField(max_length=30)

    def __str__(self):
        return str(self.skill)

class UserSkill(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user.user.username + " " + self.skill.skill)

class Interest(models.Model):
    interest = models.CharField(max_length=30)

    def __str__(self):
        return str(self.interest)