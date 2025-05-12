import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, GitBranch, MessageSquare, Users, Zap } from "lucide-react"
import {Link} from "react-router-dom"

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Powerful <span className="text-emerald-500">Features</span> for Modern Development
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                    DevSync provides all the tools you need to streamline your development workflow and collaborate effectively
                    with your team.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                    icon={<Code className="h-10 w-10" />}
                    title="Code Hosting"
                    description="Host your code repositories with advanced version control, code review, and CI/CD integration."
                />
                <FeatureCard
                    icon={<GitBranch className="h-10 w-10" />}
                    title="Branch Management"
                    description="Easily manage branches, pull requests, and merges with intuitive visual tools."
                />
                <FeatureCard
                    icon={<Users className="h-10 w-10" />}
                    title="Team Collaboration"
                    description="Work together seamlessly with real-time collaboration features and role-based permissions."
                />
                <FeatureCard
                    icon={<MessageSquare className="h-10 w-10" />}
                    title="Integrated Communication"
                    description="Chat, comment, and discuss code directly within the platform to keep conversations contextual."
                />
                <FeatureCard
                    icon={<Zap className="h-10 w-10" />}
                    title="Automation Tools"
                    description="Automate repetitive tasks with customizable workflows and integrations."
                />
                <Card className="flex flex-col items-center justify-center border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Ready to get started?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-gray-400">
                            Join thousands of developers already using DevSync to build amazing software.
                        </p>
                        <Link href="/signup">
                            <Button className="bg-emerald-500 text-black hover:bg-emerald-600">Sign up for free</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-20 rounded-lg border border-gray-800 bg-gray-900/50 p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold">Feature Comparison</h2>
                    <p className="mt-2 text-gray-400">See how DevSync stacks up against the competition</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="py-4 text-left">Feature</th>
                                <th className="py-4 text-center">DevSync</th>
                                <th className="py-4 text-center">Competitor A</th>
                                <th className="py-4 text-center">Competitor B</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-800">
                                <td className="py-4">Code Hosting</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                            </tr>
                            <tr className="border-b border-gray-800">
                                <td className="py-4">Real-time Collaboration</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-gray-500">?</td>
                            </tr>
                            <tr className="border-b border-gray-800">
                                <td className="py-4">Integrated CI/CD</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-gray-500">?</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                            </tr>
                            <tr className="border-b border-gray-800">
                                <td className="py-4">Visual Workflow Tools</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-gray-500">?</td>
                                <td className="py-4 text-center text-gray-500">?</td>
                            </tr>
                            <tr>
                                <td className="py-4">Unlimited Private Repos</td>
                                <td className="py-4 text-center text-emerald-500">?</td>
                                <td className="py-4 text-center text-gray-500">?</td>
                                <td className="py-4 text-center text-gray-500">?</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-400">{description}</CardDescription>
            </CardContent>
        </Card>
    )
}
