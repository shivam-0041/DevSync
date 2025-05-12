import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Code, Github } from "lucide-react"
import { Link } from "react-router-dom"
import { loginUser } from '../routes/api';
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    // Handle input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // Handle form submission
    //console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        // Call loginUser with the destructured username and password
        const response = await loginUser(username, password);
        if (response.success) {
            navigate('/dashboard');
        } else {
            setError(response.message || 'Login failed.');
        }
    };
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
                    <h2 className="text-2xl font-bold text-zinc-100">Sign in to DevSync</h2>
                    <p className="text-zinc-400 mt-2">Access your repositories, issues, and pull requests</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100">Sign in</CardTitle>
                        <CardDescription className="text-zinc-400">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-300">
                                        Email or username
                                    </Label>
                                    <Input
                                        id="email"
                                        name="username"
                                        onChange={handleChange }
                                        placeholder="Email or username"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-zinc-300">
                                            Password
                                        </Label>
                                        <Link to="#" className="text-sm text-emerald-400 hover:text-emerald-300">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember" className="text-sm text-zinc-400">
                                        Remember me for 30 days
                                    </Label>
                                </div>
                                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Sign in</Button>
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
                            New to DevHub?{" "}
                            <Link to="/register" className="text-emerald-400 hover:text-emerald-300">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <div className="mt-8 text-center text-xs text-zinc-500">
                    <p>
                        By signing in, you agree to our{" "}
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
