import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ProjectPage from "./pages/ProjectPage"
import WhiteboardPage from "./pages/WhiteboardPage"
import ProfilePage from "./pages/ProfilePage"
import SearchPage from "./pages/SearchPage"
import CollaboratePage from "./pages/CollaboratePage"
import HomePage from "./pages/Landing"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import ExplorePage from "./pages/ExplorePage"
import AccountSettings from "./pages/AccountSettings"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                 <Route path="/login" element={<LoginPage />} /> 
                 <Route path="/register" element={<RegisterPage />} /> 
                {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
                {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
                {/* <Route path="/verify-email" element={<VerifyEmailPage />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="/project/:id/whiteboard" element={<WhiteboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/collaborate/:id" element={<CollaboratePage />} />
                <Route path="/account/settings" element={<AccountSettings />} />
            </Routes>
        </Router>
    )
}

export default App
