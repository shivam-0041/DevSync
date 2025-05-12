import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from "lucide-react"
import {Link} from "react-router-dom"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    About <span className="text-emerald-500">DevSync</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                    We're on a mission to make development collaboration seamless, efficient, and enjoyable.
                </p>
            </div>

            <div className="grid gap-16 md:grid-cols-2">
                <div>
                    <h2 className="mb-6 text-2xl font-bold">Our Story</h2>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            DevSync was founded in 2020 by a team of developers who were frustrated with the fragmented nature of
                            development tools. We believed there had to be a better way to collaborate on code, track issues, and
                            communicate with team members.
                        </p>
                        <p>
                            What started as a simple tool for our own use quickly grew into a comprehensive platform that developers
                            around the world rely on. Today, DevSync is used by thousands of teams, from small startups to large
                            enterprises.
                        </p>
                        <p>
                            Our mission is to create the most intuitive and powerful development collaboration platform, enabling
                            teams to build better software, faster.
                        </p>
                    </div>

                    <h2 className="mb-6 mt-12 text-2xl font-bold">Our Values</h2>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-500">•</span>
                            <span>
                                <strong className="font-medium">Developer-First:</strong> We build tools that we would want to use
                                ourselves, prioritizing developer experience above all.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-500">•</span>
                            <span>
                                <strong className="font-medium">Simplicity:</strong> We believe the best tools get out of your way and
                                let you focus on what matters.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-500">•</span>
                            <span>
                                <strong className="font-medium">Collaboration:</strong> We're building bridges between developers,
                                designers, and stakeholders.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-500">•</span>
                            <span>
                                <strong className="font-medium">Innovation:</strong> We're constantly pushing the boundaries of what's
                                possible in development tools.
                            </span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="mb-6 text-2xl font-bold">Meet Our Team</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <TeamMember name="Alex Johnson" role="Founder & CEO" image="/placeholder.svg?height=200&width=200" />
                        <TeamMember name="Sarah Chen" role="CTO" image="/placeholder.svg?height=200&width=200" />
                        <TeamMember name="Michael Rodriguez" role="Head of Product" image="/placeholder.svg?height=200&width=200" />
                        <TeamMember name="Emma Wilson" role="Lead Designer" image="/placeholder.svg?height=200&width=200" />
                    </div>

                    <div className="mt-12 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                        <h2 className="mb-4 text-2xl font-bold">Join Our Team</h2>
                        <p className="mb-6 text-gray-300">
                            We're always looking for talented individuals who are passionate about building great developer tools.
                            Check out our open positions.
                        </p>
                        <Link to="/careers">
                            <Button className="bg-emerald-500 text-black hover:bg-emerald-600">View Open Positions</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeamMember({
    name,
    role,
    image,
}: {
    name: string
    role: string
    image: string
}) {
    return (
        <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={image || "/placeholder.svg"} alt={name} />
                        <AvatarFallback>
                            {name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-lg font-medium">{name}</h3>
                    <p className="text-sm text-gray-400">{role}</p>
                    <div className="mt-4 flex space-x-3">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Linkedin size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
