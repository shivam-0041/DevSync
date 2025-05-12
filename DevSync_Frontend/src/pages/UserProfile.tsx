"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
    Calendar,
    Mail,
    MapPin,
    Github,
    Twitter,
    Linkedin,
    Globe,
    Users,
    Star,
    GitFork,
    GitPullRequest,
    GitCommit,
    FileCode,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { Code } from "lucide-react"
import { DevToolsSidebar } from "../components/dev-tools-sidebar"

const UserProfile = () => {
    const { username } = useParams()
    const [isFollowing, setIsFollowing] = useState(false)

    // Mock user data
    const user = {
        name: "Alex Johnson",
        username: username || "alexjohnson",
        avatar: "/placeholder.svg?height=120&width=120",
        bio: "Full-stack developer passionate about building collaborative tools and open source software. Currently working on CodeCollab and contributing to React ecosystem.",
        location: "San Francisco, CA",
        email: "alex@example.com",
        website: "https://alexjohnson.dev",
        github: "alexjohnson",
        twitter: "alexjohnson",
        linkedin: "alexjohnson",
        joinedDate: "January 2020",
        followers: 245,
        following: 128,
        skills: [
            { name: "JavaScript", level: 95 },
            { name: "React", level: 90 },
            { name: "TypeScript", level: 85 },
            { name: "Node.js", level: 80 },
            { name: "GraphQL", level: 75 },
            { name: "Python", level: 65 },
        ],
        projects: [
            {
                id: 1,
                name: "CodeCollab Platform",
                description: "A collaborative platform for developers to work together on code projects.",
                stars: 128,
                forks: 45,
                language: "TypeScript",
                updated: "2 days ago",
            },
            {
                id: 2,
                name: "React Component Library",
                description: "A collection of reusable React components with TypeScript support.",
                stars: 87,
                forks: 23,
                language: "TypeScript",
                updated: "1 week ago",
            },
            {
                id: 3,
                name: "API Gateway Service",
                description: "A microservice gateway for handling API requests with authentication and rate limiting.",
                stars: 64,
                forks: 18,
                language: "JavaScript",
                updated: "3 weeks ago",
            },
        ],
        contributions: [
            {
                date: "May 10, 2023",
                type: "commit",
                project: "CodeCollab Platform",
                description: "Implemented real-time collaboration feature",
                url: "#",
            },
            {
                date: "May 8, 2023",
                type: "pull_request",
                project: "React Component Library",
                description: "Added new form components with validation",
                url: "#",
            },
            {
                date: "May 5, 2023",
                type: "issue",
                project: "API Gateway Service",
                description: "Fixed authentication token expiration issue",
                url: "#",
            },
            {
                date: "May 3, 2023",
                type: "commit",
                project: "CodeCollab Platform",
                description: "Updated dashboard UI with new analytics",
                url: "#",
            },
            {
                date: "April 28, 2023",
                type: "pull_request",
                project: "Open Source Project",
                description: "Contributed accessibility improvements to navigation",
                url: "#",
            },
        ],
    }

    const getLanguageColor = (language: string) => {
        const colors: Record<string, string> = {
            JavaScript: "bg-yellow-500/20 text-yellow-500",
            TypeScript: "bg-blue-500/20 text-blue-500",
            Python: "bg-green-500/20 text-green-500",
            Java: "bg-orange-500/20 text-orange-500",
            "C#": "bg-purple-500/20 text-purple-500",
            Ruby: "bg-red-500/20 text-red-500",
            Go: "bg-cyan-500/20 text-cyan-500",
            PHP: "bg-indigo-500/20 text-indigo-500",
            Swift: "bg-orange-500/20 text-orange-500",
            Kotlin: "bg-purple-500/20 text-purple-500",
            Rust: "bg-amber-500/20 text-amber-500",
        }

        return colors[language] || "bg-gray-500/20 text-gray-500"
    }

    const getContributionIcon = (type: string) => {
        const icons: Record<string, React.ComponentType<any>> = {
            commit: GitCommit,
            pull_request: GitPullRequest,
            issue: FileCode,
        }

        return icons[type] || FileCode
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <Code className="h-6 w-6 text-emerald-400" />
                                <span className="font-bold text-white">CodeCollab</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                                    <AvatarFallback className="bg-zinc-700 text-zinc-300">JD</AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-zinc-800">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-2xl bg-zinc-700 text-zinc-300">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                                        <p className="text-zinc-400">@{user.username}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            className={
                                                isFollowing
                                                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                                    : "bg-emerald-500 hover:bg-emerald-600"
                                            }
                                            onClick={() => setIsFollowing(!isFollowing)}
                                        >
                                            {isFollowing ? "Following" : "Follow"}
                                        </Button>
                                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                            Message
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-zinc-300">{user.bio}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{user.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${user.email}`} className="text-emerald-400 hover:text-emerald-300">
                                                {user.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Globe className="h-4 w-4" />
                                            <a
                                                href={user.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-400 hover:text-emerald-300"
                                            >
                                                {user.website.replace(/^https?:\/\//, "")}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Joined {user.joinedDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-zinc-500" />
                                        <span className="text-zinc-300">
                                            <strong className="text-white">{user.followers}</strong> followers
                                        </span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-zinc-300">
                                            <strong className="text-white">{user.following}</strong> following
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.github && (
                                        <a
                                            href={`https://github.com/${user.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-400 hover:text-white"
                                        >
                                            <Github className="h-5 w-5" />
                                        </a>
                                    )}
                                    {user.twitter && (
                                        <a
                                            href={`https://twitter.com/${user.twitter}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-400 hover:text-white"
                                        >
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                    )}
                                    {user.linkedin && (
                                        <a
                                            href={`https://linkedin.com/in/${user.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-400 hover:text-white"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills and Expertise */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                                <Badge key={skill.name} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700">
                                    {skill.name} ({skill.level}%)
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="bg-zinc-800 mb-6">
                            <TabsTrigger value="projects" className="data-[state=active]:bg-zinc-700">
                                Projects
                            </TabsTrigger>
                            <TabsTrigger value="contributions" className="data-[state=active]:bg-zinc-700">
                                Contributions
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="data-[state=active]:bg-zinc-700">
                                Activity
                            </TabsTrigger>
                            <TabsTrigger value="repositories" className="data-[state=active]:bg-zinc-700">
                                Repositories
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="space-y-6">
                            {user.projects.map((project) => (
                                <Card key={project.id} className="bg-zinc-900 border-zinc-800">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="text-zinc-400">{project.stars}</span>
                                                <GitFork className="h-4 w-4 text-zinc-500" />
                                                <span className="text-zinc-400">{project.forks}</span>
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 mt-2">{project.description}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <Badge className={getLanguageColor(project.language)}>{project.language}</Badge>
                                            <span className="text-zinc-500">Updated {project.updated}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="contributions" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Recent Contributions</CardTitle>
                                    <CardDescription>Summary of your recent contributions to open source projects.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user.contributions.map((contribution, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            {React.createElement(getContributionIcon(contribution.type), {
                                                className: "h-5 w-5 text-emerald-400",
                                            })}
                                            <div>
                                                <h4 className="text-sm font-medium text-white">{contribution.project}</h4>
                                                <p className="text-sm text-zinc-400">{contribution.description}</p>
                                                <div className="text-xs text-zinc-500">{contribution.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Activity</CardTitle>
                                    <CardDescription>Your recent activity on CodeCollab.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white">No activity to display.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="repositories" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Repositories</CardTitle>
                                    <CardDescription>Your public repositories on CodeCollab.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white">No repositories to display.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Enhanced Dev Tools Sidebar */}
            <DevToolsSidebar />
        </div>
    )
}

export default UserProfile;
