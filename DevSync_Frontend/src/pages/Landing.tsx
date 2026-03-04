"use client"

import { Button } from "../components/ui/button"
import {
    Code,
    GitBranch,
    GitPullRequest,
    MessageSquare,
    Shield,
    Users,
    Zap,
    ArrowRight,
    Globe,
    Lock,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useAuth } from "../components/contexts/auth-context"

export default function LandingPage() {
    const { isAuthenticated, isLoading, user } = useAuth()
    const navigate = useNavigate()

    // useEffect(() => {
    //     if (!isLoading && isAuthenticated && user) {
    //         // Redirect to dashboard if user is authenticated
    //         navigate(`/dashboard/${user.username}`)
    //     }
    // }, [isAuthenticated, isLoading, user, navigate])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const featureVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="border-b border-zinc-900 py-5 px-8 fixed w-full bg-zinc-950/90 backdrop-blur-md z-50"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-950 flex items-center justify-center">
                            <Code className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight">DevSync</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        <Link to="/features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                            Features
                        </Link>
                        <Link to="/workflow" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                            Workflow
                        </Link>
                        <Link to="/about" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                            About
                        </Link>
                        <Link to="/contact" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                            Contact us
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="pt-36 pb-24 px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-sm mb-8"
                    >
                        <Zap className="h-3.5 w-3.5" />
                        <span>Introducing DevSync 2.0</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
                    >
                        Where <span className="text-emerald-400">Ideas</span> Become{" "}
                        <span className="text-emerald-400">Reality</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        DevSync is the modern platform for developers to collaborate seamlessly. Host code, track tasks, visualize
                        ideas, and communicate-all in one unified workspace.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5"
                    >
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-8 rounded-md h-12"
                            >
                                Start for free
                            </Button>
                        </Link>
                        <Link to="/how-it-works">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 w-full sm:w-auto px-8 rounded-md h-12"
                            >
                                See how it works
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Visual Preview Section */}
            <section className="py-20 px-8 bg-gradient-to-b from-zinc-950 to-zinc-900">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
                    >
                        <div className="border-b border-zinc-800 p-4 flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="text-xs text-zinc-500 ml-2">project/src/components/App.tsx</div>
                        </div>
                        <div className="p-6 text-sm font-mono text-zinc-300 overflow-x-auto">
                            <pre className="text-xs md:text-sm">
                                <code>
                                    <span className="text-purple-400">import</span>
                                    <span className="text-zinc-300">
                                        {" "}
                                        React, {"{"} useState {"}"}{" "}
                                    </span>
                                    <span className="text-purple-400">from</span>
                                    <span className="text-zinc-300"> </span>
                                    <span className="text-emerald-300">'react'</span>
                                    <span className="text-zinc-300">;</span>
                                    <br />
                                    <span className="text-purple-400">import</span>
                                    <span className="text-zinc-300">
                                        {" "}
                                        {"{"} motion {"}"}{" "}
                                    </span>
                                    <span className="text-purple-400">from</span>
                                    <span className="text-zinc-300"> </span>
                                    <span className="text-emerald-300">'framer-motion'</span>
                                    <span className="text-zinc-300">;</span>
                                    <br />
                                    <br />
                                    <span className="text-purple-400">function</span>
                                    <span className="text-blue-400"> App</span>
                                    <span className="text-zinc-300">() {"{"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"  "}</span>
                                    <span className="text-purple-400">const</span>
                                    <span className="text-zinc-300"> [isOpen, setIsOpen] = useState(</span>
                                    <span className="text-yellow-400">false</span>
                                    <span className="text-zinc-300">);</span>
                                    <br />
                                    <br />
                                    <span className="text-zinc-300">{"  "}</span>
                                    <span className="text-purple-400">return</span>
                                    <span className="text-zinc-300"> (</span>
                                    <br />
                                    <span className="text-zinc-300">{"    "}</span>
                                    <span className="text-blue-300">{"<motion.div "}</span>
                                    <span className="text-yellow-300">initial</span>
                                    <span className="text-zinc-300">={"{{"}</span>
                                    <span className="text-zinc-300"> opacity: 0 {"}}"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"               "}</span>
                                    <span className="text-yellow-300">animate</span>
                                    <span className="text-zinc-300">={"{{"}</span>
                                    <span className="text-zinc-300"> opacity: 1 {"}}"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"               "}</span>
                                    <span className="text-yellow-300">className</span>
                                    <span className="text-zinc-300">=</span>
                                    <span className="text-emerald-300">"app"</span>
                                    <span className="text-blue-300">{">"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"      "}</span>
                                    <span className="text-blue-300">{"<header "}</span>
                                    <span className="text-yellow-300">className</span>
                                    <span className="text-zinc-300">=</span>
                                    <span className="text-emerald-300">"app-header"</span>
                                    <span className="text-blue-300">{">"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"        "}</span>
                                    <span className="text-blue-300">{"<h1>"}</span>
                                    <span className="text-zinc-300">Welcome to DevSync</span>
                                    <span className="text-blue-300">{"</h1>"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"        "}</span>
                                    <span className="text-blue-300">{"<p>"}</span>
                                    <span className="text-zinc-300">Where ideas become reality</span>
                                    <span className="text-blue-300">{"</p>"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"      "}</span>
                                    <span className="text-blue-300">{"</header>"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"      "}</span>
                                    <span className="text-blue-300">{"<main>"}</span>
                                    <span className="text-zinc-300">{"..."}</span>
                                    <span className="text-blue-300">{"</main>"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"    "}</span>
                                    <span className="text-blue-300">{"</motion.div>"}</span>
                                    <br />
                                    <span className="text-zinc-300">{"  "});</span>
                                    <br />
                                    <span className="text-zinc-300">{"}"}</span>
                                    <br />
                                    <br />
                                    <span className="text-purple-400">export</span>
                                    <span className="text-purple-400"> default</span>
                                    <span className="text-zinc-300"> App;</span>
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={fadeIn.hidden}
                        whileInView={fadeIn.visible}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl font-bold mb-6">A New Way to Collaborate</h2>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                            DevSync combines the best tools for modern development teams in one seamless platform.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-900/50 hover:bg-zinc-900 hover:scale-105"
                        >
                            <div className="h-14 w-14 rounded-xl bg-emerald-950 flex items-center justify-center mb-6">
                                <Code className="h-7 w-7 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Intelligent Code Hosting</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Host your code with advanced version control, AI-powered suggestions, and automatic dependency
                                management.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-900/50 hover:bg-zinc-900 hover:scale-105"
                        >
                            <div className="h-14 w-14 rounded-xl bg-purple-950 flex items-center justify-center mb-6">
                                <GitPullRequest className="h-7 w-7 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Visual Collaboration</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Integrated whiteboards, diagrams, and visual tools that make complex ideas simple to understand and
                                implement.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-900/50 hover:bg-zinc-900 hover:scale-105"
                        >
                            <div className="h-14 w-14 rounded-xl bg-blue-950 flex items-center justify-center mb-6">
                                <MessageSquare className="h-7 w-7 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Contextual Communication</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Chat and discussions tied directly to code, tasks, and documents for focused, productive conversations.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-900/50 hover:bg-zinc-900 hover:scale-105"
                        >
                            <div className="h-14 w-14 rounded-xl bg-yellow-950 flex items-center justify-center mb-6">
                                <GitBranch className="h-7 w-7 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Smart Branching</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                AI-assisted branch management that predicts conflicts, suggests optimal merge strategies, and automates
                                routine tasks.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-900/50 hover:bg-zinc-900 hover:scale-105"
                        >
                            <div className="h-14 w-14 rounded-xl bg-red-950 flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7 text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Advanced Security</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Proactive vulnerability detection, dependency scanning, and compliance monitoring built into your
                                workflow.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-900/50 hover:bg-zinc-900 hover:scale-105"
                        >
                            <div className="h-14 w-14 rounded-xl bg-teal-950 flex items-center justify-center mb-6">
                                <Users className="h-7 w-7 text-teal-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Team Insights</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Visualize team performance, identify bottlenecks, and optimize workflows with actionable analytics.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-24 px-8 bg-gradient-to-b from-zinc-900 to-zinc-950">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={fadeIn.hidden}
                        whileInView={fadeIn.visible}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl font-bold mb-6">Streamlined Workflow</h2>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                            From idea to deployment, DevSync provides a seamless experience for your entire team.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-12"
                        >
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-900">
                                        <span className="text-lg font-semibold text-emerald-400">1</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Ideation & Planning</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Start with collaborative whiteboards and planning tools to define your project scope and
                                        architecture.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-900">
                                        <span className="text-lg font-semibold text-emerald-400">2</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Development & Collaboration</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Write code with real-time collaboration, AI-assisted suggestions, and integrated documentation.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-900">
                                        <span className="text-lg font-semibold text-emerald-400">3</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Review & Testing</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Streamlined code reviews with automated testing, quality checks, and visual diff comparisons.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-900">
                                        <span className="text-lg font-semibold text-emerald-400">4</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Deployment & Monitoring</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        One-click deployments with integrated monitoring, rollback capabilities, and performance analytics.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl"
                        >
                            <div className="border-b border-zinc-800 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-emerald-950 flex items-center justify-center">
                                        <Code className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <span className="font-medium">Project Workflow</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-emerald-400">1</span>
                                                </div>
                                                <span className="font-medium">Planning Phase</span>
                                            </div>
                                            <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-1 rounded-full">Completed</span>
                                        </div>
                                        <div className="pl-8">
                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                                <span>Architecture diagram created</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                                <span>User stories defined</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                                <span>Sprint planning completed</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-blue-400">2</span>
                                                </div>
                                                <span className="font-medium">Development Phase</span>
                                            </div>
                                            <span className="text-xs text-blue-400 bg-blue-950 px-2 py-1 rounded-full">In Progress</span>
                                        </div>
                                        <div className="pl-8">
                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                                <span>Backend API implementation (75%)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                                <span>Frontend components (60%)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <div className="h-2 w-2 rounded-full bg-zinc-600"></div>
                                                <span>Integration tests</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-zinc-400">3</span>
                                                </div>
                                                <span className="font-medium">Testing Phase</span>
                                            </div>
                                            <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">
                                                Pending
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-zinc-400">4</span>
                                                </div>
                                                <span className="font-medium">Deployment Phase</span>
                                            </div>
                                            <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">
                                                Pending
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={fadeIn.hidden}
                        whileInView={fadeIn.visible}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-6">Loved by Developers</h2>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                            See what teams around the world are saying about DevSync.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-emerald-900/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-zinc-300 mb-6 leading-relaxed">
                                "DevSync has transformed how our team works. The integrated whiteboard and chat features have made
                                remote collaboration feel natural and efficient."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <span className="text-sm font-medium">SL</span>
                                </div>
                                <div>
                                    <p className="font-medium">Sarah Liu</p>
                                    <p className="text-sm text-zinc-500">CTO, TechNova</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-emerald-900/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-zinc-300 mb-6 leading-relaxed">
                                "The task allocation system is a game-changer. We've reduced our sprint planning time by 40% and
                                everyone knows exactly what they need to work on."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <span className="text-sm font-medium">MJ</span>
                                </div>
                                <div>
                                    <p className="font-medium">Marcus Johnson</p>
                                    <p className="text-sm text-zinc-500">Lead Developer, Quantum Labs</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={featureVariant}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-emerald-900/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-zinc-300 mb-6 leading-relaxed">
                                "As a startup, we needed something flexible that could grow with us. DevSync's intuitive interface and
                                powerful features have exceeded our expectations."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <span className="text-sm font-medium">AP</span>
                                </div>
                                <div>
                                    <p className="font-medium">Aisha Patel</p>
                                    <p className="text-sm text-zinc-500">Founder, Nimbus AI</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-950 to-zinc-900 rounded-2xl p-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your development workflow?</h2>
                    <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto">
                        Join thousands of developers and teams who are building better software, faster with DevSync.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-8 rounded-md h-12"
                            >
                                Get started for free
                            </Button>
                        </Link>
                        <Link to="#features">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-emerald-800 text-zinc-200 hover:bg-emerald-900/30 hover:text-zinc-100 w-full sm:w-auto px-8 rounded-md h-12"
                            >
                                Schedule a demo
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-16 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-9 w-9 rounded-lg bg-emerald-950 flex items-center justify-center">
                                    <Code className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h1 className="text-xl font-semibold tracking-tight">DevSync</h1>
                            </div>
                            <p className="text-zinc-400 mb-6 max-w-md">
                                DevSync is the modern platform for developers to collaborate seamlessly. Host code, track tasks,
                                visualize ideas, and communicate�all in one unified workspace.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link to="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                                <Link to="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                                <Link to="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </Link>
                                <Link to="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Security
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Team
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Enterprise
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between">
                        <p className="text-zinc-500 text-sm mb-4 md:mb-0">� 2025 DevSync, Inc. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link
                                to="#"
                                className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-sm"
                            >
                                <Globe className="h-4 w-4" />
                                <span>English (US)</span>
                            </Link>
                            <Link
                                to="#"
                                className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-sm"
                            >
                                <Lock className="h-4 w-4" />
                                <span>Privacy & Terms</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
