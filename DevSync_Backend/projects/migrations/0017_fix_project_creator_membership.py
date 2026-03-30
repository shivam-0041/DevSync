# Generated migration to fix project creator memberships

from django.db import migrations

def fix_creator_memberships(apps, schema_editor):
    """
    Ensure all project creators have a UserProjectRole entry with admin role.
    This fixes the bug where project.members.add(user) was called without proper role assignment.
    """
    Project = apps.get_model('projects', 'Project')
    UserProjectRole = apps.get_model('projects', 'UserProjectRole')
    
    for project in Project.objects.all():
        # Check if creator already has a role
        exists = UserProjectRole.objects.filter(
            user=project.created_by,
            project=project
        ).exists()
        
        if not exists:
            # Create admin role for creator
            UserProjectRole.objects.create(
                user=project.created_by,
                project=project,
                role='admin'
            )
            print(f"Created admin role for {project.created_by.username} on project {project.name}")

def reverse_fix(apps, schema_editor):
    """
    Reverse function - removes UserProjectRole entries created by this migration.
    Only removes entries where the user is the creator (to be safe).
    """
    Project = apps.get_model('projects', 'Project')
    UserProjectRole = apps.get_model('projects', 'UserProjectRole')
    
    for project in Project.objects.all():
        UserProjectRole.objects.filter(
            user=project.created_by,
            project=project,
            role='admin'
        ).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0016_project_members'),
    ]

    operations = [
        migrations.RunPython(fix_creator_memberships, reverse_fix),
    ]
