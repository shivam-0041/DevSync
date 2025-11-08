
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project, Branch

@receiver(post_save, sender=Project)
def create_main_branch(sender, instance, created, **kwargs):
    if created:  # only on new project creation
        # check if project already has a default branch
        if not instance.branches.filter(is_default=True).exists():
            Branch.objects.create(
                project=instance,
                name="main",
                created_by=instance.created_by,  # assuming Project has created_by
                is_default=True,
            )

'''
@receiver(post_save, sender=UserProjectRole)
def create_collaborator_branch(sender, instance, created, **kwargs):
    if created and instance.role == 'collaborator':
        Branch.objects.get_or_create(name=instance.user.username, project=instance.project)

'''

