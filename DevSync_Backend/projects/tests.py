from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import timedelta
from .models import Project, ProjectInvite, UserProjectRole
from .utils import ProjectInviteService, ProjectInviteResponseService
from .serializers import ProjectInviteSerializer

from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status

User = get_user_model()


class ProjectInviteServiceTestCase(TestCase):
    """Test suite for project invitation system"""

    def setUp(self):
        """Set up test data"""
        # Create users
        self.owner = User.objects.create_user(
            username='project_owner',
            email='owner@example.com',
            password='testpass123'
        )
        
        self.admin_user = User.objects.create_user(
            username='admin_user',
            email='admin@example.com',
            password='testpass123'
        )
        
        self.regular_user = User.objects.create_user(
            username='regular_user',
            email='regular@example.com',
            password='testpass123'
        )
        
        self.invitee = User.objects.create_user(
            username='invitee',
            email='invitee@example.com',
            password='testpass123'
        )

        # Create a project
        self.project = Project.objects.create(
            name='Test Project',
            description='A test project',
            created_by=self.owner
        )

        # Set owner as admin
        UserProjectRole.objects.create(
            user=self.owner,
            project=self.project,
            role='admin'
        )

        # Set admin_user as admin for testing
        UserProjectRole.objects.create(
            user=self.admin_user,
            project=self.project,
            role='admin'
        )

    # ============================================
    # Test: Permission Checks (Step A)
    # ============================================
    
    def test_send_invite_by_non_admin_fails(self):
        """Test that non-admin users cannot send invitations"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='newemail@example.com',
            role='developer',
            sender_user=self.regular_user
        )
        
        self.assertFalse(result['success'])
        self.assertIn('admin', result['message'].lower())

    def test_send_invite_by_owner_succeeds(self):
        """Test that project owner (admin) can send invitations"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='newemail@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        self.assertTrue(result['success'])
        self.assertIn('Invitation sent', result['message'])

    def test_send_invite_by_admin_succeeds(self):
        """Test that project admin can send invitations"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='developer@example.com',
            role='developer',
            sender_user=self.admin_user
        )
        
        self.assertTrue(result['success'])
        self.assertIn('Invitation sent', result['message'])

    # ============================================
    # Test: Email Validation (Step B)
    # ============================================
    
    def test_send_invite_with_invalid_email_fails(self):
        """Test that invalid email format is rejected"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='not_an_email',
            role='developer',
            sender_user=self.owner
        )
        
        self.assertFalse(result['success'])
        self.assertIn('Invalid email', result['message'])

    def test_send_invite_with_invalid_email_format_fails(self):
        """Test that incomplete email format is rejected"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='email@',
            role='developer',
            sender_user=self.owner
        )
        
        self.assertFalse(result['success'])
        self.assertIn('Invalid email', result['message'])

    # ============================================
    # Test: Member Check (Step B)
    # ============================================
    
    def test_cannot_invite_existing_member(self):
        """Test that you cannot invite someone already in the project"""
        # Add invitee as a member
        UserProjectRole.objects.create(
            user=self.invitee,
            project=self.project,
            role='developer'
        )
        
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        self.assertFalse(result['success'])
        self.assertIn('already a member', result['message'])

    # ============================================
    # Test: Duplicate Invite Check (Step B)
    # ============================================
    
    def test_cannot_send_duplicate_pending_invite(self):
        """Test that duplicate pending invitations are prevented"""
        # Send first invite
        result1 = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='newuser@example.com',
            role='developer',
            sender_user=self.owner
        )
        self.assertTrue(result1['success'])
        
        # Try to send second invite to same email
        result2 = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='newuser@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        self.assertFalse(result2['success'])
        self.assertIn('already exists', result2['message'])

    # ============================================
    # Test: Role Validation (Step B)
    # ============================================
    
    def test_send_invite_with_invalid_role_fails(self):
        """Test that invalid role is rejected"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='user@example.com',
            role='superuser',
            sender_user=self.owner
        )
        
        self.assertFalse(result['success'])
        self.assertIn('Invalid role', result['message'])

    def test_send_invite_with_valid_roles(self):
        """Test that all valid roles can be assigned"""
        valid_roles = ['admin', 'maintainer', 'developer', 'guest']
        
        for role in valid_roles:
            result = ProjectInviteService.send_invite(
                project_slug=self.project.slug,
                recipient_email=f'{role}user@example.com',
                role=role,
                sender_user=self.owner
            )
            
            self.assertTrue(result['success'], f"Failed to send invite with role: {role}")
            self.assertEqual(result['invite'].role_to_assign, role)

    # ============================================
    # Test: Token Generation (Step C)
    # ============================================
    
    def test_invite_has_unique_token(self):
        """Test that each invite gets a unique secure token"""
        result1 = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='user1@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        result2 = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='user2@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        token1 = result1['invite'].token
        token2 = result2['invite'].token
        
        self.assertNotEqual(token1, token2)
        self.assertTrue(len(token1) > 30)  # Should be long secure token

    # ============================================
    # Test: Expiry Timestamp (Step C)
    # ============================================
    
    def test_invite_expires_in_72_hours(self):
        """Test that invites expire after 72 hours"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='user@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        invite = result['invite']
        current_time = now()
        time_diff = invite.expires_at - current_time
        
        # Should be approximately 72 hours
        self.assertTrue(
            timedelta(hours=71) < time_diff < timedelta(hours=73),
            f"Expiry is {time_diff} instead of ~72 hours"
        )

    def test_invite_is_valid_when_pending(self):
        """Test that pending invite is valid"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='user@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        invite = result['invite']
        self.assertTrue(invite.is_valid())

    def test_invite_is_not_expired_when_recent(self):
        """Test that recent invite is not expired"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='user@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        invite = result['invite']
        self.assertFalse(invite.is_expired())

    # ============================================
    # Test: Database Creation (Step D)
    # ============================================
    
    def test_invite_record_created_in_database(self):
        """Test that invite record is properly saved to database"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='unique@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        # Verify invite exists in DB
        invite_from_db = ProjectInvite.objects.get(email='unique@example.com')
        
        self.assertEqual(invite_from_db.project, self.project)
        self.assertEqual(invite_from_db.role_to_assign, 'developer')
        self.assertEqual(invite_from_db.invited_by, self.owner)
        self.assertEqual(invite_from_db.status, 'pending')

    # ============================================
    # Test: Invite Acceptance (Step F)
    # ============================================
    
    def test_user_can_accept_invite(self):
        """Test that a user can accept a project invitation"""
        # Send invite
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # User accepts invite
        response = ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=self.invitee
        )
        
        self.assertTrue(response['success'])
        self.assertIn('accepted', response['message'])
        self.assertEqual(response['project'].id, self.project.id)

    def test_user_added_to_project_on_accept(self):
        """Test that user is added as project member when accepting"""
        # Send invite
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='maintainer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # User accepts invite
        ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=self.invitee
        )
        
        # Verify membership was created
        membership = UserProjectRole.objects.get(
            user=self.invitee,
            project=self.project
        )
        self.assertEqual(membership.role, 'maintainer')

    def test_invite_status_updated_to_accepted(self):
        """Test that invite status changes to accepted after acceptance"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # Accept invite
        ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=self.invitee
        )
        
        # Verify status is updated
        invite = ProjectInvite.objects.get(token=token)
        self.assertEqual(invite.status, 'accepted')

    # ============================================
    # Test: Invite Decline
    # ============================================
    
    def test_user_can_decline_invite(self):
        """Test that a user can decline a project invitation"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # User declines invite
        response = ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='decline',
            user=self.invitee
        )
        
        self.assertTrue(response['success'])
        self.assertIn('declined', response['message'])

    def test_user_not_added_when_declining(self):
        """Test that user is NOT added to project when declining"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # User declines invite
        ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='decline',
            user=self.invitee
        )
        
        # Verify user is NOT a member
        is_member = UserProjectRole.objects.filter(
            user=self.invitee,
            project=self.project
        ).exists()
        self.assertFalse(is_member)

    def test_invite_status_updated_to_declined(self):
        """Test that invite status changes to declined after refusal"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # Decline invite
        ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='decline',
            user=self.invitee
        )
        
        # Verify status is updated
        invite = ProjectInvite.objects.get(token=token)
        self.assertEqual(invite.status, 'declined')

    # ============================================
    # Test: Email Verification
    # ============================================
    
    def test_only_invite_recipient_can_accept(self):
        """Test that only the invited email address can accept"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # Different user tries to accept
        response = ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=self.regular_user
        )
        
        self.assertFalse(response['success'])
        self.assertIn('email', response['message'].lower())

    # ============================================
    # Test: Expired Invite Handling
    # ============================================
    
    def test_cannot_accept_expired_invite(self):
        """Test that expired invites cannot be accepted"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        invite = result['invite']
        # Manually set expiry to past
        invite.expires_at = now() - timedelta(hours=1)
        invite.save()
        
        # Try to accept expired invite
        response = ProjectInviteResponseService.respond_to_invite(
            token=invite.token,
            action='accept',
            user=self.invitee
        )
        
        self.assertFalse(response['success'])
        self.assertIn('expired', response['message'].lower())

    def test_expired_invite_status_updated(self):
        """Test that expired invite status is marked as expired"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        invite = result['invite']
        invite.expires_at = now() - timedelta(hours=1)
        invite.save()
        
        # Try to respond to expired invite
        ProjectInviteResponseService.respond_to_invite(
            token=invite.token,
            action='accept',
            user=self.invitee
        )
        
        # Verify status is marked expired
        invite.refresh_from_db()
        self.assertEqual(invite.status, 'expired')

    # ============================================
    # Test: Invalid Token
    # ============================================
    
    def test_invalid_token_rejected(self):
        """Test that invalid token is rejected"""
        response = ProjectInviteResponseService.respond_to_invite(
            token='invalid_token_12345',
            action='accept',
            user=self.invitee
        )
        
        self.assertFalse(response['success'])
        self.assertIn('Invalid', response['message'])

    # ============================================
    # Test: Invalid Action
    # ============================================
    
    def test_invalid_action_rejected(self):
        """Test that invalid action is rejected"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        response = ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='maybe',  # Invalid action
            user=self.invitee
        )
        
        self.assertFalse(response['success'])
        self.assertIn('Invalid action', response['message'])

    # ============================================
    # Test: Once-Only Acceptance
    # ============================================
    
    def test_cannot_accept_already_accepted_invite(self):
        """Test that already accepted invites cannot be accepted again"""
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        
        token = result['invite'].token
        
        # Accept once
        ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=self.invitee
        )
        
        # Try to accept again
        response = ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=self.invitee
        )
        
        self.assertFalse(response['success'])
        self.assertIn('already', response['message'].lower())

    # ============================================
    # Test: Complete Flow
    # ============================================
    
    def test_complete_invite_flow(self):
        """Test complete invitation flow from send to acceptance"""
        # Step 1: Owner sends invite
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email='newdev@example.com',
            role='developer',
            sender_user=self.owner
        )
        
        self.assertTrue(result['success'])
        self.assertIsNotNone(result['invite'].token)
        self.assertIsNotNone(result['invite'].expires_at)
        
        # Create user with that email
        new_user = User.objects.create_user(
            username='newdev',
            email='newdev@example.com',
            password='testpass123'
        )
        
        # Step 2: User accepts invite
        token = result['invite'].token
        response = ProjectInviteResponseService.respond_to_invite(
            token=token,
            action='accept',
            user=new_user
        )
        
        self.assertTrue(response['success'])
        
        # Step 3: Verify membership created
        membership = UserProjectRole.objects.get(
            user=new_user,
            project=self.project
        )
        self.assertEqual(membership.role, 'developer')


# -------------------------------------------------
# Serializer & API integration tests
# -------------------------------------------------

class ProjectInviteSerializerTestCase(TestCase):
    def setUp(self):
        # reuse same users and project as service tests
        self.owner = User.objects.create_user(
            username='serializer_owner',
            email='serializer_owner@example.com',
            password='password'
        )
        self.regular_user = User.objects.create_user(
            username='serializer_user',
            email='serializer_user@example.com',
            password='password'
        )
        self.invitee = User.objects.create_user(
            username='serializer_invitee',
            email='serializer_invitee@example.com',
            password='password'
        )
        self.project = Project.objects.create(
            name='Serializer Project',
            description='project for serializer tests',
            created_by=self.owner
        )
        UserProjectRole.objects.create(
            user=self.owner,
            project=self.project,
            role='admin'
        )

    def test_serializer_create_invite_success(self):
        data = {
            'project_slug': self.project.slug,
            'email': 'new@example.com',
            'role_to_assign': 'developer'
        }
        request = type('r', (), {'user': self.owner})()
        serializer = ProjectInviteSerializer(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        invite = serializer.save()
        self.assertEqual(invite.email, 'new@example.com')
        self.assertEqual(invite.role_to_assign, 'developer')
        self.assertEqual(invite.project, self.project)

    def test_serializer_create_non_admin_raises(self):
        data = {
            'project_slug': self.project.slug,
            'email': 'new@example.com',
            'role_to_assign': 'developer'
        }
        request = type('r', (), {'user': self.regular_user})()
        serializer = ProjectInviteSerializer(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        with self.assertRaises(Exception):
            serializer.save()

    def test_serializer_update_accept(self):
        # create invite directly via service
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        invite = result['invite']
        data = {'action': 'accept'}
        request = type('r', (), {'user': self.invitee})()
        serializer = ProjectInviteSerializer(invite, data=data, partial=True, context={'request': request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        invite.refresh_from_db()
        self.assertEqual(invite.status, 'accepted')
        self.assertTrue(UserProjectRole.objects.filter(user=self.invitee, project=self.project).exists())

    def test_serializer_update_decline(self):
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        invite = result['invite']
        data = {'action': 'decline'}
        request = type('r', (), {'user': self.invitee})()
        serializer = ProjectInviteSerializer(invite, data=data, partial=True, context={'request': request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        invite.refresh_from_db()
        self.assertEqual(invite.status, 'declined')

    def test_serializer_update_invalid_action(self):
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        invite = result['invite']
        data = {'action': 'maybe'}
        request = type('r', (), {'user': self.invitee})()
        serializer = ProjectInviteSerializer(invite, data=data, partial=True, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('action must be', str(serializer.errors))

    def test_serializer_update_wrong_user(self):
        result = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )
        invite = result['invite']
        data = {'action': 'accept'}
        request = type('r', (), {'user': self.regular_user})()
        serializer = ProjectInviteSerializer(invite, data=data, partial=True, context={'request': request})
        # serializer should fail validation because email mismatch
        self.assertFalse(serializer.is_valid())
        self.assertIn('You can only respond to invitations sent to your email address.',
                      str(serializer.errors))


class ProjectInviteAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            username='api_owner',
            email='api_owner@example.com',
            password='password'
        )
        self.invitee = User.objects.create_user(
            username='api_invitee',
            email='api_invitee@example.com',
            password='password'
        )
        self.project = Project.objects.create(
            name='API Project',
            description='for api testing',
            created_by=self.owner
        )
        UserProjectRole.objects.create(
            user=self.owner,
            project=self.project,
            role='admin'
        )

    def test_send_project_invite_view(self):
        # DRF APIClient needs force_authenticate to set request.user
        self.client.force_authenticate(user=self.owner)
        url = reverse('send-project-invite', args=[self.project.slug])
        resp = self.client.post(url, {'email': 'invite2@example.com', 'role': 'developer'}, format='json')
        if resp.status_code != status.HTTP_201_CREATED:
            print('DEBUG send invite response:', resp.status_code, resp.data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn('invite_token', resp.data)

    def test_respond_to_invite_view_accept(self):
        # send first
        inv = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )['invite']
        self.client.force_authenticate(user=self.invitee)
        url = reverse('respond_to_invite') + f'?token={inv.token}&action=accept'
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('project', resp.data)

    def test_respond_to_invite_view_decline(self):
        inv = ProjectInviteService.send_invite(
            project_slug=self.project.slug,
            recipient_email=self.invitee.email,
            role='developer',
            sender_user=self.owner
        )['invite']
        self.client.force_authenticate(user=self.invitee)
        url = reverse('respond_to_invite') + f'?token={inv.token}&action=decline'
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertNotIn('project', resp.data)
