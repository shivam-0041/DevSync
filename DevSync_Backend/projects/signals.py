from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project, UserProjectRole, Branch

@receiver(post_save, sender=Project)
def create_main_branch(sender, instance, created, **kwargs):
    if created:
        Branch.objects.create(name="main", project=instance)

@receiver(post_save, sender=UserProjectRole)
def create_collaborator_branch(sender, instance, created, **kwargs):
    if created and instance.role == 'collaborator':
        Branch.objects.get_or_create(name=instance.user.username, project=instance.project)