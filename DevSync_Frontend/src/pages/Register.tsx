import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Code, Github } from "lucide-react"
import { Link,useNavigate } from "react-router-dom"
import { useState, useEffect,setError } from "react";
import { handleRegisterSubmit, getCsrfToken } from "../routes/auth"; 
import React from "react";
export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        
    });

    const [error, setError] = useState("");

    useEffect(() => {
        getCsrfToken();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!formData.username || !formData.email || !formData.firstName || !formData.password) {
            setError("Please fill out all required fields.");
            return;
        }
        const result = await handleRegisterSubmit(formData);
        if (result.success) {
            // Redirect to dashboard
            navigate('/login');
        } else {
            setError(result.message);
            //alert(result.message);
        }
    };

    //const handleSubmit = async (e) => {
    //    e.preventDefault();
    //    navigate('/verify-email');
    //    //const result = await handleRegisterSubmit(formData);
    //    //if (result.success) {
    //    //    // Redirect to dashboard
    //    //    navigate('/verify-email');
    //    //} else {
    //    //    setError(result.message);
    //    //}
    //    //
    //    // Optionally redirect to login if result.success
    //};
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Code className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-100">DevSync</h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-zinc-100">Create your account</h2>
                    <p className="text-zinc-400 mt-2">Join thousands of developers building amazing software</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100">Sign up</CardTitle>
                        <CardDescription className="text-zinc-400">Enter your information to create an account</CardDescription>
                    </CardHeader>
                    <CardContent>

                        {error && (
                            <h1 className="text-red-500 text-sm mt-(-2) mb-2">
                                {error}
                            </h1>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-zinc-300">
                                            First name<span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            onChange={handleChange}
                                            placeholder="John"
                                            className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-zinc-300">
                                            Last name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-zinc-300">
                                        Username<span className="text-red-500">*</span>
                                    
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        onChange={handleChange}
                                        placeholder="johndoe"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-300">
                                        Email<span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="john@example.com"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-zinc-300">
                                        Password<span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                    />
                                    <p className="text-xs text-zinc-500">
                                        Password must be at least 8 characters long and include a number and a special character.
                                    </p>
                                </div>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Create account</Button>
                            </div>
                        </form>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-zinc-900 px-2 text-zinc-400">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t border-zinc-800 pt-6">
                        <p className="text-center text-sm text-zinc-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <div className="mt-8 text-center text-xs text-zinc-500">
                    <p>
                        By creating an account, you agree to our{" "}
                        <Link to="#" className="text-zinc-400 hover:text-zinc-300">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="#" className="text-zinc-400 hover:text-zinc-300">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
