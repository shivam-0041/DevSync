import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
//import Dashboard from "./pages/Dashboard"
//import ProjectPage from "./pages/ProjectPage"
//import WhiteboardPage from "./pages/WhiteboardPage"
//import ProfilePage from "./pages/ProfilePage"
//import SearchPage from "./pages/SearchPage"
//import CollaboratePage from "./pages/CollaboratePage"
//import HomePage from "./pages/Landing"
//import LoginPage from "./pages/Login"
//import RegisterPage from "./pages/Register"
//import ExplorePage from "./pages/ExplorePage"
//import AccountSettings from "./pages/AccountSettings"
//import ForgotPasswordPage from "./pages/ForgotPassword"
//import ResetPasswordPage from "./pages/ResetPassword"
//import AboutPage from "./pages/About"
//import FeaturesPage from "./pages/Features"
//import ContactPage from "./pages/Contactus"
//import WorkflowPage from "./pages/Workflow"
//import HowItWorksPage from "./pages/HowItWorks"
//import ProjectSettings from "./pages/ProjectSettings"
//import ManageCollaborators from "./pages/ManageCollaborators"
//import UserProfile from "./pages/UserProfile"
//import VerifyEmailPage from "./pages/VerifyEmail"

import React, { lazy, Suspense } from 'react';


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
                    <Route path="/project/:id" element={<ProjectPage />} />
                    <Route path="/project/:id/whiteboard" element={<WhiteboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/collaborate/:id" element={<CollaboratePage />} />
                    <Route path="/account/settings" element={<AccountSettings />} />
                    <Route path="/project/:id/settings" element={<ProjectSettings />} />
                    <Route path="/project/:id/manage-collaborators" element={<ManageCollaborators />} />
                    <Route path="/user/:id" element={<UserProfile />} />
                    
                </Routes>
            {/*</Suspense>*/}
        </Router>
    );
}

export default App
