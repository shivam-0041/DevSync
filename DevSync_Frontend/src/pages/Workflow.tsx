import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Code, GitBranch, GitPullRequest, Zap } from "lucide-react"
import Link from "next/link"

export default function WorkflowPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Streamlined <span className="text-emerald-500">Workflow</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                    DevSync optimizes your development process from idea to deployment, making collaboration seamless and
                    efficient.
                </p>
            </div>

            <div className="mb-20">
                <div className="relative">
                    <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-800"></div>
                    <div className="space-y-12">
                        <WorkflowStep
                            number="01"
                            icon={<Code />}
                            title="Code Creation"
                            description="Write code in your preferred environment or use our integrated editor with real-time collaboration."
                            isLeft={true}
                        />
                        <WorkflowStep
                            number="02"
                            icon={<GitBranch />}
                            title="Branch Management"
                            description="Create branches for features, fixes, and experiments with visual branch management tools."
                            isLeft={false}
                        />
                        <WorkflowStep
                            number="03"
                            icon={<GitPullRequest />}
                            title="Code Review"
                            description="Submit pull requests and conduct thorough code reviews with inline comments and suggestions."
                            isLeft={true}
                        />
                        <WorkflowStep
                            number="04"
                            icon={<Zap />}
                            title="Automated Testing"
                            description="Run automated tests and CI/CD pipelines to ensure code quality and prevent regressions."
                            isLeft={false}
                        />
                        <WorkflowStep
                            number="05"
                            icon={<CheckCircle2 />}
                            title="Deployment"
                            description="Deploy your code to staging or production environments with one-click deployments."
                            isLeft={true}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-bold">Ready to optimize your workflow?</h2>
                        <p className="mt-4 text-gray-300">
                            Join thousands of developers who have streamlined their development process with DevSync. Our platform
                            integrates seamlessly with your existing tools and workflows.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/signup">
                                <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/how-it-works">
                                <Button variant="outline" className="border-gray-700">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">30% Faster Development</h3>
                                    <p className="text-gray-400">Teams using DevSync report 30% faster development cycles on average.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function WorkflowStep({
    number,
    icon,
    title,
    description,
    isLeft,
}: {
    number: string
    icon: React.ReactNode
    title: string
    description: string
    isLeft: boolean
}) {
    return (
        <div className={`flex ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
            <div className="w-1/2"></div>
            <div className="relative flex items-center justify-center">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black">
                    {icon}
                </div>
            </div>
            <div className="w-1/2">
                <Card className={`border-gray-800 bg-gray-900/50 ${isLeft ? "ml-6" : "mr-6"} relative overflow-visible`}>
                    <div className="absolute -left-3 top-6 h-6 w-6 rotate-45 bg-gray-900/50 border-l border-b border-gray-800"></div>
                    <CardHeader>
                        <div className="text-sm font-medium text-emerald-500">Step {number}</div>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-gray-400">{description}</CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
