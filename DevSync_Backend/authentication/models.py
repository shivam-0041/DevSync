from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class RegisteredUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        # Ensure email is provided and is unique
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        # Ensure username is unique
        if RegisteredUser.objects.filter(username=username).exists():
            raise ValueError('Username already exists')
        
        # Ensure email is unique
        if RegisteredUser.objects.filter(email=email).exists():
            raise ValueError('Email already exists')
        
        user = self.model(username=username, email=email, **extra_fields)
        user.username = username.lower()  # Normalize username to lowercase
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class RegisteredUser(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)  # Username is unique
    email = models.EmailField(unique=True)  # Email is unique
    password = models.CharField(max_length=255)  # Store hashed password
    first_name = models.CharField(max_length=150)  # First name is required
    last_name = models.CharField(max_length=150)  # Last name is required
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(blank=True, null=True)
    
    # Optional: if you want to use first_name and last_name for full_name or other purposes
    full_name = property(lambda self: f"{self.first_name} {self.last_name}")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = RegisteredUserManager()

    USERNAME_FIELD = 'username'  # The field to use for login (username)
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']  # Add all fields that are required during user creation
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser or self.is_staff

    def has_module_perms(self, app_label):
        return self.is_superuser or self.is_staff


    def __str__(self):
        return self.username

#class PendingUser(models.Model):
#    username = models.CharField(max_length=150, unique=True)
#    email = models.EmailField(unique=True)
#    password = models.CharField(max_length=255)
#    first_name = models.CharField(max_length=150)
#    last_name = models.CharField(max_length=150)
#    verification_code = models.CharField(max_length=6)
#    code_expiry = models.DateTimeField()  # Time when the code expires
#    created_at = models.DateTimeField(auto_now_add=True)
#    
#    def __str__(self):
#        return self.username