import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React, { lazy, Suspense } from 'react';
import PrivateRoute from '../src/lib/PrivateRoute';

const HomePage = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmail'));
const AboutPage = lazy(() => import('./pages/About'));
const FeaturesPage = lazy(() => import('./pages/Features'));
const ContactPage = lazy(() => import('./pages/Contactus'));
const WorkflowPage = lazy(() => import('./pages/Workflow'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorks'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const WhiteboardPage = lazy(() => import('./pages/WhiteboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const CollaboratePage = lazy(() => import('./pages/CollaboratePage'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const ProjectSettings = lazy(() => import('./pages/ProjectSettings'));
const ManageCollaborators = lazy(() => import('./pages/ManageCollaborators'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const NewRepo = lazy(() => import('./pages/NewRepo'));
const NewIssue = lazy(() => import('./pages/NewIssue'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NewPullRequest = lazy(() => import('./pages/NewPullReq'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));

function App() {
    return (
        <Router>
            {/*<Suspense fallback={<div>Loading...</div>}>*/}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    {/*<Route path="/verify-code" element={<VerifyEmailPage />} />*/}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/workflow" element={<WorkflowPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/dashboard/:username" element={<Dashboard />} />
                    <Route path="/new-repo" element={<NewRepo />} />
                    <Route path="/new-issue" element={<NewIssue />} />
                    <Route path="/new-pull-request" element={<NewPullRequest />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/project/:id" element={<ProjectPage />} />
                    <Route path="/project/:id/whiteboard" element={<WhiteboardPage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/devsync/:username" element={<PublicProfile />} />
                    <Route path="/collaborate/:id" element={<CollaboratePage />} />
                    <Route path="/account/settings/:username" element={<AccountSettings />} />
                    <Route path="/project/:id/settings" element={<ProjectSettings />} />
                    <Route path="/project/:id/manage-collaborators" element={<ManageCollaborators />} />
                    <Route path="/user/:id" element={<UserProfile />} />
                    
                </Routes>
            {/*</Suspense>*/}
        </Router>
    );
}

export default App
