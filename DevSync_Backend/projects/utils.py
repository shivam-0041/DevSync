from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.urls import reverse
from django.conf import settings
from .models import ProjectInvite, UserProjectRole, Project

User = get_user_model()


class ProjectInviteService:
    """Service class to handle project invitation logic"""

    @staticmethod
    def send_invite(project_slug, recipient_email, role, sender_user):
        """
        Send project invitation following all validation and security steps.
        
        Args:
            project_slug: Slug/identifier of the project
            recipient_email: Email of the person being invited
            role: Role to assign (admin, maintainer, developer, guest)
            sender_user: User object of the person sending the invite
            
        Returns:
            dict: {
                'success': bool,
                'message': str,
                'invite': ProjectInvite object (if successful)
            }
        """
        try:
            # ============ STEP A: PERMISSION CHECK ============
            project = Project.objects.get(slug=project_slug)
            
            # Check if sender is admin of the project
            sender_role = UserProjectRole.objects.filter(
                user=sender_user,
                project=project
            ).first()
            
            if not sender_role or sender_role.role != 'admin':
                return {
                    'success': False,
                    'message': 'Only project admins can send invitations.'
                }

            # ============ STEP B: VALIDATION ============
            
            # B1: Validate email format
            from django.core.validators import validate_email
            try:
                validate_email(recipient_email)
            except ValidationError:
                return {
                    'success': False,
                    'message': 'Invalid email address.'
                }

            # B2: Check if user is already a member
            existing_member = UserProjectRole.objects.filter(
                user__email=recipient_email,
                project=project
            ).exists()
            
            if existing_member:
                return {
                    'success': False,
                    'message': 'This user is already a member of the project.'
                }

            # B3: Check if already invited (pending status)
            pending_invite = ProjectInvite.objects.filter(
                email=recipient_email,
                project=project,
                status='pending'
            ).first()
            
            if pending_invite and not pending_invite.is_expired():
                return {
                    'success': False,
                    'message': 'An active invitation already exists for this email.'
                }

            # B4: Validate role
            valid_roles = [choice[0] for choice in UserProjectRole.ROLE_CHOICES]
            if role not in valid_roles:
                return {
                    'success': False,
                    'message': f'Invalid role. Must be one of: {", ".join(valid_roles)}'
                }

            # ============ STEP C: GENERATE SECURITY DATA ============
            # Token and expiry are automatically generated in the model's save() method
            # Token via generate_invite_token() function
            # Expiry via save() method (72 hours default)

            # ============ STEP D: CREATE INVITE RECORD ============
            invite = ProjectInvite.objects.create(
                project=project,
                email=recipient_email,
                role_to_assign=role,
                invited_by=sender_user
            )

            # ============ STEP E: BUILD ACTION LINKS ============
            accept_link = ProjectInviteService._build_invite_link(
                invite.token,
                action='accept'
            )
            decline_link = ProjectInviteService._build_invite_link(
                invite.token,
                action='decline'
            )

            # ============ STEP F: SEND EMAIL ============
            # compute inviter name safely, some user models (e.g. RegisteredUser)
            # may not implement get_full_name
            inviter_name = None
            try:
                inviter_name = sender_user.get_full_name()
            except Exception:
                inviter_name = None
            if not inviter_name:
                inviter_name = getattr(sender_user, 'username', None) or str(sender_user)

            email_sent = ProjectInviteService._send_invite_email(
                recipient_email,
                project.name,
                role,
                inviter_name,
                invite.expires_at,
                accept_link,
                decline_link
            )

            if not email_sent:
                # Delete invite if email fails to send
                invite.delete()
                return {
                    'success': False,
                    'message': 'Failed to send invitation email.'
                }

            return {
                'success': True,
                'message': f'Invitation sent to {recipient_email}',
                'invite': invite
            }

        except Project.DoesNotExist:
            return {
                'success': False,
                'message': 'Project not found.'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'An error occurred: {str(e)}'
            }

    @staticmethod
    def _build_invite_link(token, action):
        """
        Build invite response link with token and action.
        
        Args:
            token: Secure token from ProjectInvite
            action: 'accept' or 'decline'
            
        Returns:
            str: Full URL for the invite link
        """
        # Build relative path
        relative_path = reverse('respond_to_invite')
        
        # Create full URL
        base_url = settings.FRONTEND_URL.rstrip('/')
        link = f"{base_url}{relative_path}?token={token}&action={action}"
        
        return link

    @staticmethod
    def _send_invite_email(recipient_email, project_name, role, inviter_name, 
                          expires_at, accept_link, decline_link):
        """
        Send invitation email with accept/decline links.
        
        Args:
            recipient_email: Email of invitee
            project_name: Name of the project
            role: Role being assigned
            inviter_name: Name of person sending invite
            expires_at: Datetime when invite expires
            accept_link: URL to accept link
            decline_link: URL to decline link
            
        Returns:
            bool: True if email sent successfully
        """
        try:
            subject = f"You're invited to join {project_name}"
            
            # Format expiry time
            expiry_time = expires_at.strftime('%B %d, %Y at %H:%M UTC')
            
            # Build email body with HTML
            html_message = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>You're invited to a project!</h2>
                        
                        <p>Hello,</p>
                        
                        <p><strong>{inviter_name}</strong> invited you to join the project <strong>{project_name}</strong> with the role of <strong>{role.capitalize()}</strong>.</p>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Invitation Details:</strong></p>
                            <ul style="list-style: none; padding: 0;">
                                <li>📁 <strong>Project:</strong> {project_name}</li>
                                <li>👤 <strong>Role:</strong> {role.capitalize()}</li>
                                <li>👥 <strong>Invited by:</strong> {inviter_name}</li>
                                <li>⏰ <strong>Expires:</strong> {expiry_time}</li>
                            </ul>
                        </div>
                        
                        <p><strong>What would you like to do?</strong></p>
                        
                        <div style="margin: 20px 0;">
                            <a href="{accept_link}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-right: 10px; font-weight: bold;">✓ Accept Invitation</a>
                            <a href="{decline_link}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">✗ Decline Invitation</a>
                        </div>
                        
                        <p style="font-size: 12px; color: #666; margin-top: 30px;">
                            This invitation expires on {expiry_time}. After that, you won't be able to accept it.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <p style="font-size: 11px; color: #999;">
                            If you don't recognize this project or didn't expect this invitation, you can safely ignore this email or decline the invitation.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            # Plain text fallback
            plain_message = f"""
            You're invited to join {project_name}!
            
            {inviter_name} invited you to join the project {project_name} with the role of {role.capitalize()}.
            
            Invitation Details:
            - Project: {project_name}
            - Role: {role.capitalize()}
            - Invited by: {inviter_name}
            - Expires: {expiry_time}
            
            To accept: {accept_link}
            To decline: {decline_link}
            
            This invitation expires on {expiry_time}.
            """
            
            # Send email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False
            )
            
            return True
            
        except Exception as e:
            print(f"Error sending invite email: {str(e)}")
            return False


class ProjectInviteResponseService:
    """Service class to handle invite acceptance/decline"""

    @staticmethod
    def respond_to_invite(token, action, user):
        """
        Handle user's response to project invitation.
        
        Args:
            token: Secure token from the invite link
            action: 'accept' or 'decline'
            user: The authenticated User object responding
            
        Returns:
            dict: {
                'success': bool,
                'message': str,
                'project': Project object (if successful)
            }
        """
        try:
            # Find invite by token
            invite = ProjectInvite.objects.get(token=token)
            
            # Verify invite is not expired
            if invite.is_expired():
                invite.status = 'expired'
                invite.save()
                return {
                    'success': False,
                    'message': 'This invitation has expired.'
                }
            
            # Verify status is pending
            if invite.status != 'pending':
                return {
                    'success': False,
                    'message': f'This invitation has already been {invite.status}.'
                }
            
            # Verify logged-in user email matches invite email
            if user.email != invite.email:
                return {
                    'success': False,
                    'message': 'You can only respond to invitations sent to your email address.'
                }
            
            # ============ PERFORM ACTION ============
            
            if action == 'accept':
                # Create UserProjectRole membership
                membership, created = UserProjectRole.objects.get_or_create(
                    user=user,
                    project=invite.project,
                    defaults={'role': invite.role_to_assign}
                )
                
                if not created:
                    # User somehow already a member
                    return {
                        'success': False,
                        'message': 'You are already a member of this project.'
                    }
                
                # Update invite status
                invite.status = 'accepted'
                invite.save()
                
                return {
                    'success': True,
                    'message': f'You have accepted the invitation to {invite.project.name}.',
                    'project': invite.project
                }
            
            elif action == 'decline':
                # Update invite status to declined
                invite.status = 'declined'
                invite.save()
                
                return {
                    'success': True,
                    'message': f'You have declined the invitation to {invite.project.name}.'
                }
            
            else:
                return {
                    'success': False,
                    'message': 'Invalid action. Must be "accept" or "decline".'
                }
        
        except ProjectInvite.DoesNotExist:
            return {
                'success': False,
                'message': 'Invalid invitation token.'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'An error occurred: {str(e)}'
            }
