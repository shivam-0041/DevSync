"use client"

import React from "react"

import { useState, useEffect, useRef, type KeyboardEvent, type ChangeEvent } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { CheckCircle2, Mail, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom";
//import { handleRegistrationSubmit, verifyEmailCode } from "../routes/auth";

export default function VerifyEmailPage() {
    const navigate = useNavigate()
    const [code, setCode] = useState<string[]>(Array(6).fill(""))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
    const [isResending, setIsResending] = useState(false)

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Timer countdown effect
    useEffect(() => {
        if (timeLeft <= 0 || success) return

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [timeLeft, success])

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Handle input change
    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return

        // Update the code array
        const newCode = [...code]
        newCode[index] = value.slice(-1) // Only take the last character if multiple are pasted
        setCode(newCode)

        // Auto-focus next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // Handle key press
    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }

        // Handle arrow keys
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // Handle paste event
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").trim()

        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("")
            setCode(digits)

            // Focus the last input
            inputRefs.current[5]?.focus()
        }
    }

    // Handle form submission
    // ? UPDATED handleSubmit FUNCTION
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setIsSubmitting(true);
        setError("");

        // ? Retrieve user form data (you must pass this via location or context)
        const storedFormData = JSON.parse(sessionStorage.getItem("formData")); // ??Change this to prop/context if not using sessionStorage
        if (!storedFormData) {
            setError("User data not found. Please register again.");
            setIsSubmitting(false);
            return;
        }

        try {
            // ? First, verify the code with backend
            const verifyResult = await verifyEmailCode(storedFormData.email, fullCode);
            if (!verifyResult.success) {
                setError(verifyResult.message || "Invalid code.");
                setIsSubmitting(false);
                return;
            }

            // ? Then, send registration data to backend
            const registerResult = await handleRegistrationSubmit(storedFormData);
            if (!registerResult.success) {
                setError(registerResult.message || "Registration failed.");
                setIsSubmitting(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Handle code resend
    const handleResend = async () => {
        setIsResending(true);

        try {
            if (!email) {
                setError("No email found. Please register again.");
                return;
            }

            await verifyEmailCode(email); // ? NEW LINE: call resend API with email only
            setTimeLeft(180); // ? RESET timer
            setError("");
        } catch {
            setError("Failed to resend code. Try again.");
        } finally {
            setIsResending(false); // ? NEW LINE
        }
    };
    return (
        <div className="container mx-auto flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-16">
            <Card className="mx-auto w-full max-w-md border-gray-800 bg-gray-900/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>Enter the 6-digit code sent to your email to verify your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h3 className="mb-2 text-xl font-medium">Email Verified Successfully</h3>
                            <p className="mb-4 text-gray-400">
                                Your email has been verified. You will be redirected to your dashboard.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">
                                <p className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4" />
                                    We&apos;ve sent a verification code to your email
                                </p>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 flex items-center">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Verification Code</label>
                                    <div className={`text-sm ${timeLeft < 30 ? "text-red-400" : "text-gray-400"}`}>
                                        Time remaining: {formatTime(timeLeft)}
                                    </div>
                                </div>

                                <div className="flex justify-between gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <Input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={code[index]}
                                            onChange={(e) => handleChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className="h-14 w-12 text-center text-lg border-gray-700 bg-gray-800 focus:border-emerald-500"
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Enter the 6-digit code sent to your email. You can also paste the entire code.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                                    disabled={isSubmitting || timeLeft <= 0}
                                >
                                    {isSubmitting ? "Verifying..." : "Verify Email"}
                                </Button>

                                {timeLeft <= 0 ? (
                                    <div className="text-center">
                                        <p className="text-red-400 text-sm mb-2">Verification code expired</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-gray-700 text-emerald-500 hover:text-emerald-400"
                                            onClick={handleResend}
                                            disabled={isResending}
                                        >
                                            {isResending ? "Resending..." : "Resend Code"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center text-sm">
                                        <button
                                            type="button"
                                            className="text-emerald-500 hover:underline"
                                            onClick={handleResend}
                                            disabled={isResending}
                                        >
                                            {isResending ? "Resending..." : "Didn't receive a code? Resend"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
