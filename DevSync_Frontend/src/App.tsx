import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import React, { lazy, Suspense } from 'react';
import PrivateRoute from '../src/lib/PrivateRoute';
import AuthGuard from '../src/components/auth_guard';
import { Toaster } from "sonner";


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
const IssuePage = lazy(() => import('./pages/IssuePage'));

function App() {
    return (
    <>
    {/*<Suspense fallback={<div>Loading...</div>}>*/}
    <Toaster position="top-right" />
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
            <Route path="/search" element={<SearchPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/p/:username" element={<PublicProfile />} />
            <Route path="/settings" element={<ProjectSettings />} />
            <Route path="/manage-collaborators" element={<ManageCollaborators />} />

            {/* New routes - dashboard sub-pages */}
            <Route path="/dashboard/explore" element={<ExplorePage />} />
            <Route path="/dashboard/starred" element={<ExplorePage />} />
            <Route path="/dashboard/teams" element={<ExplorePage />} />
            <Route path="/dashboard/activity" element={<ExplorePage />} />

            {/* New routes - auth aliases */}
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />

            {/* New routes - additional pages */}
            <Route path="/import-repository" element={<NewRepo />} />

            <Route element={<AuthGuard/>}>
                <Route path="/dashboard/:username" element={ <Dashboard /> } />
                <Route path="/:username/new-repo" element={ <NewRepo /> } />       
                <Route path="/:username/project/:slug/issues/new" element={<NewIssue />} />
                <Route path="/issue/:issueId" element={<IssuePage />} />
                <Route path="/:username/project/:slug/pull-request" element={<NewPullRequest />} />
                <Route path="/:username/notifications" element={<Notifications />} />
                <Route path="/:username/project/:id" element={<ProjectPage />} />
                <Route path="/:username/project/:slug/whiteboard/:whiteboard_id" element={<WhiteboardPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />      
                <Route path="/:username/project/:slug/collaborate" element={<CollaboratePage />} />
                <Route path="/:username/account/settings" element={<AccountSettings />} />
                <Route path="/:username/project/:slug/settings" element={<ProjectSettings />} />
                <Route path="/:username/project/:slug/manage-collaborators" element={<ManageCollaborators />} />
            </Route>
                    
        </Routes>
    {/*</Suspense>*/}
    </>
    );
}

export default App
