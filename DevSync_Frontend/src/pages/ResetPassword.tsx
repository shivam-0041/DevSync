"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { CheckCircle2 } from "lucide-react"
import {Link} from "react-router-dom"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            // Redirect to home page after showing success message
            setTimeout(() => {
                window.location.href = "/"
            }, 3000)
        }, 1500)
    }

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-16">
            <Card className="mx-auto w-full max-w-md border-gray-800 bg-gray-900/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>Create a new password for your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h3 className="mb-2 text-xl font-medium">Password Reset Successful</h3>
                            <p className="mb-4 text-gray-400">
                                Your password has been reset successfully. You will be redirected to the home page shortly.
                            </p>
                            <Link to="/">
                                <Button className="bg-emerald-500 text-black hover:bg-emerald-600">Go to Home Page</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-gray-700 bg-gray-800"
                                />
                                <p className="text-xs text-gray-400">Password must be at least 8 characters long</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border-gray-700 bg-gray-800"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Resetting Password..." : "Reset Password"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
