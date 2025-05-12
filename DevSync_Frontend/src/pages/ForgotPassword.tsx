"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail } from "lucide-react"
import {Link} from "react-router-dom"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<"email" | "code">("email")
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setStep("code")
        }, 1500)
    }

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            window.location.href = "/reset-password"
        }, 1500)
    }

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-16">
            <Card className="mx-auto w-full max-w-md border-gray-800 bg-gray-900/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        {step === "email"
                            ? "Enter your email address to reset your password."
                            : "Enter the verification code sent to your email."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-gray-700 bg-gray-800"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            <div className="text-center text-sm">
                                <Link href="/signin" className="text-emerald-500 hover:underline">
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleCodeSubmit} className="space-y-4">
                            <div className="mb-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">
                                <p className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4" />
                                    We&apos;ve sent a verification code to {email}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    placeholder="Enter 6-digit code"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="border-gray-700 bg-gray-800"
                                    maxLength={6}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "Verifying..."
                                ) : (
                                    <>
                                        Verify Code <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            <div className="text-center text-sm">
                                <button type="button" onClick={() => setStep("email")} className="text-emerald-500 hover:underline">
                                    Try a different email
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
