import type React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Code, GitBranch, GitPullRequest, MessageSquare, Users } from "lucide-react"
import {Link} from "react-router-dom"

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    See How <span className="text-emerald-500">DevSync</span> Works
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                    Discover how DevSync transforms your development workflow with powerful collaboration tools.
                </p>
            </div>

            <Tabs defaultValue="code" className="mb-16">
                <TabsList className="mx-auto grid w-full max-w-md grid-cols-3 bg-gray-900">
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
                    <TabsTrigger value="deploy">Deploy</TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="mt-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold">Write Code Your Way</h2>
                            <p className="mt-4 text-gray-300">
                                DevSync provides a flexible environment for writing code, whether you prefer our integrated editor or
                                your own IDE. With real-time collaboration, syntax highlighting, and intelligent code completion, you
                                can write better code faster.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <FeatureItem icon={<Code size={18} />} text="Powerful integrated editor" />
                                <FeatureItem icon={<GitBranch size={18} />} text="Seamless version control integration" />
                                <FeatureItem icon={<Users size={18} />} text="Real-time collaboration with team members" />
                            </ul>
                            <div className="mt-8">
                                <Link href="/signup">
                                    <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
                                        Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                            <Image
                                src="/placeholder.svg?height=300&width=500"
                                alt="Code Editor Screenshot"
                                width={500}
                                height={300}
                                className="rounded"
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="collaborate" className="mt-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold">Collaborate Seamlessly</h2>
                            <p className="mt-4 text-gray-300">
                                DevSync makes team collaboration effortless with integrated communication tools, code reviews, and
                                project management features. Keep everyone on the same page and moving in the same direction.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <FeatureItem icon={<GitPullRequest size={18} />} text="Streamlined code review process" />
                                <FeatureItem icon={<MessageSquare size={18} />} text="Contextual discussions right in your code" />
                                <FeatureItem icon={<Users size={18} />} text="Team management and role-based permissions" />
                            </ul>
                            <div className="mt-8">
                                <Link href="/signup">
                                    <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
                                        Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                            <Image
                                src="/placeholder.svg?height=300&width=500"
                                alt="Collaboration Screenshot"
                                width={500}
                                height={300}
                                className="rounded"
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="deploy" className="mt-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold">Deploy with Confidence</h2>
                            <p className="mt-4 text-gray-300">
                                DevSync streamlines your deployment process with integrated CI/CD pipelines, automated testing, and
                                one-click deployments to your preferred environments.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <FeatureItem icon={<Code size={18} />} text="Integrated CI/CD pipelines" />
                                <FeatureItem icon={<GitBranch size={18} />} text="Environment-specific configurations" />
                                <FeatureItem icon={<Users size={18} />} text="Deployment approvals and rollbacks" />
                            </ul>
                            <div className="mt-8">
                                <Link href="/signup">
                                    <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
                                        Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                            <Image
                                src="/placeholder.svg?height=300&width=500"
                                alt="Deployment Screenshot"
                                width={500}
                                height={300}
                                className="rounded"
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mb-16 rounded-lg border border-gray-800 bg-gray-900/50 p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Watch DevSync in Action</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-300">
                        See how DevSync can transform your development workflow in this short demo video.
                    </p>
                </div>
                <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400">Video Demo Placeholder</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center">
                <h2 className="text-3xl font-bold">Ready to transform your development workflow?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-gray-300">
                    Join thousands of developers who have already discovered the power of DevSync.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link to="/signup">
                        <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-600">
                            Start for free
                        </Button>
                    </Link>
                    <Link to="/contact">
                        <Button size="lg" variant="outline" className="border-gray-700">
                            Contact Sales
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-emerald-500">{icon}</div>
            <span>{text}</span>
        </div>
    )
}
