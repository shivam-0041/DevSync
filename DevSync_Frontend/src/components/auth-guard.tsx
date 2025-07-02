"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../components/contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

interface AuthGuardProps {
    children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [shouldRedirect, setShouldRedirect] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            setShouldRedirect(true)
            // Add a small delay to show the auth prompt before redirecting
            const timer = setTimeout(() => {
                navigate(`/signin?redirect=${encodeURIComponent(location.pathname)}`)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [isAuthenticated, isLoading, navigate, location.pathname])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-gray-900 border-gray-800">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Authentication Required</CardTitle>
                        <CardDescription className="text-gray-400">You need to sign in to access this page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3">
                            <Link to={`/signin?redirect=${encodeURIComponent(location.pathname)}`}>
                                <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-600">Sign In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="outline" className="w-full border-gray-600">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                        {shouldRedirect && (
                            <p className="text-sm text-gray-500 text-center">Redirecting to sign in page in a few seconds...</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <>{children}</>
}

export default AuthGuard
