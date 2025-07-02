"use client"

import {Link} from "react-router-dom"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
    MapPin,
    LinkIcon,
    Calendar,
    Users,
    GitFork,
    Star,
    Eye,
    Settings,
    UserPlus,
    UserMinus,
    Mail,
    Github,
    Twitter,
    Linkedin,
    BookOpen,
    Clock,
} from "lucide-react"
import { useAuth } from "../components/contexts/auth-context"
import { Activity } from "lucide-react" // Import Activity icon

interface UserProfile {
    username: string
    name: string
    email: string
    avatar?: string
    bio?: string
    location?: string
    website?: string
    company?: string
    joinDate: string
    followers: number
    following: number
    publicRepos: number
    isFollowing?: boolean
    socialLinks?: {
        github?: string
        twitter?: string
        linkedin?: string
    }
}

interface Repository {
    id: string
    name: string
    description?: string
    language: string
    stars: number
    forks: number
    isPrivate: boolean
    updatedAt: string
}

// Mock data - in a real app, this would come from an API
const mockUsers: Record<string, UserProfile> = {
    johndoe: {
        username: "johndoe",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=120&width=120",
        bio: "Full-stack developer passionate about open source and modern web technologies. Building the future one commit at a time.",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        company: "TechCorp Inc.",
        joinDate: "2020-03-15",
        followers: 1234,
        following: 567,
        publicRepos: 89,
        isFollowing: false,
        socialLinks: {
            github: "https://github.com/johndoe",
            twitter: "https://twitter.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
        },
    },
    janedoe: {
        username: "janedoe",
        name: "Jane Doe",
        email: "jane@example.com",
        avatar: "/placeholder.svg?height=120&width=120",
        bio: "Frontend architect and UI/UX enthusiast. Love creating beautiful and accessible user experiences.",
        location: "New York, NY",
        website: "https://janedoe.design",
        company: "Design Studio",
        joinDate: "2019-08-22",
        followers: 2156,
        following: 432,
        publicRepos: 156,
        isFollowing: true,
        socialLinks: {
            github: "https://github.com/janedoe",
            twitter: "https://twitter.com/janedoe",
        },
    },
}

const mockRepositories: Repository[] = [
    {
        id: "1",
        name: "awesome-react-components",
        description: "A collection of reusable React components for modern web applications",
        language: "TypeScript",
        stars: 1234,
        forks: 89,
        isPrivate: false,
        updatedAt: "2024-01-15",
    },
    {
        id: "2",
        name: "api-gateway-service",
        description: "Microservices API gateway built with Node.js and Express",
        language: "JavaScript",
        stars: 567,
        forks: 45,
        isPrivate: false,
        updatedAt: "2024-01-10",
    },
    {
        id: "3",
        name: "ml-data-pipeline",
        description: "Machine learning data processing pipeline using Python and Apache Airflow",
        language: "Python",
        stars: 234,
        forks: 23,
        isPrivate: false,
        updatedAt: "2024-01-08",
    },
]

const mockActivityItems: {
    id: string
    type: "commit" | "pr" | "issue" | "fork" | "star"
    repository: string
    description: string
    timestamp: string
}[] = [
        {
            id: "1",
            type: "commit",
            repository: "awesome-react-components",
            description: "Added new Button component with accessibility features",
            timestamp: "2024-01-15T10:30:00Z",
        },
        {
            id: "2",
            type: "pr",
            repository: "api-gateway-service",
            description: "Opened pull request: Implement rate limiting middleware",
            timestamp: "2024-01-14T15:45:00Z",
        },
        {
            id: "3",
            type: "star",
            repository: "ml-data-pipeline",
            description: "Starred repository: tensorflow/tensorflow",
            timestamp: "2024-01-13T09:20:00Z",
        },
    ]

const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
        TypeScript: "bg-blue-500",
        JavaScript: "bg-yellow-500",
        Python: "bg-green-500",
        Java: "bg-red-500",
        Go: "bg-cyan-500",
        Rust: "bg-orange-500",
    }
    return colors[language] || "bg-gray-500"
}

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export default function ProfilePage() {
    const params = useParams()
    //const { user: currentUser } = useAuth()
    const username = params.username as string

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [activity, setActivity] = useState<
        {
            id: string
            type: "commit" | "pr" | "issue" | "fork" | "star"
            repository: string
            description: string
            timestamp: string
        }[]
    >([])
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const userProfile = mockUsers[username]
            if (userProfile) {
                setProfile(userProfile)
                setRepositories(mockRepositories)
                setActivity(mockActivityItems)
                setIsFollowing(userProfile.isFollowing || false)
            }
            setLoading(false)
        }, 1000)
    }, [username])

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing)
        // In a real app, this would make an API call
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
                        <p className="text-gray-400 mb-8">The user @{username} doesn't exist or has been removed.</p>
                        <Button onClick={() => navigate("/")} className="bg-emerald-500 text-black hover:bg-emerald-600">
                            Go Home
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    //const isOwnProfile = currentUser?.email === profile.email

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex-shrink-0">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                            <AvatarFallback className="text-2xl">
                                {profile.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                                <p className="text-xl text-gray-400">@{profile.username}</p>
                            </div>

                            <div className="flex gap-2 mt-4 sm:mt-0">
                                {isOwnProfile ? (
                                    <Button onClick={() => navigate("/settings/profile")} variant="outline" className="border-gray-600">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleFollowToggle}
                                            variant={isFollowing ? "outline" : "default"}
                                            className={isFollowing ? "border-gray-600" : "bg-emerald-500 text-black hover:bg-emerald-600"}
                                        >
                                            {isFollowing ? (
                                                <>
                                                    <UserMinus className="h-4 w-4 mr-2" />
                                                    Unfollow
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Follow
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" className="border-gray-600">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {profile.bio && <p className="text-gray-300 mb-4 max-w-2xl">{profile.bio}</p>}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                            {profile.company && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {profile.company}
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {profile.location}
                                </div>
                            )}
                            {profile.website && (
                                <div className="flex items-center gap-1">
                                    <LinkIcon className="h-4 w-4" />
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-emerald-400"
                                    >
                                        {profile.website.replace(/^https?:\/\//, "")}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Joined {formatDate(profile.joinDate)}
                            </div>
                        </div>

                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">{profile.followers.toLocaleString()}</span>
                                <span className="text-gray-400">followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">{profile.following.toLocaleString()}</span>
                                <span className="text-gray-400">following</span>
                            </div>
                        </div>

                        {profile.socialLinks && (
                            <div className="flex gap-3 mt-4">
                                {profile.socialLinks.github && (
                                    <a
                                        href={profile.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.socialLinks.twitter && (
                                    <a
                                        href={profile.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.socialLinks.linkedin && (
                                    <a
                                        href={profile.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Separator className="bg-gray-800 mb-8" />

                {/* Profile Content */}
                <Tabs defaultValue="repositories" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-900">
                        <TabsTrigger
                            value="repositories"
                            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Repositories ({profile.publicRepos})
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black">
                            <Activity className="h-4 w-4 mr-2" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger value="stars" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black">
                            <Star className="h-4 w-4 mr-2" />
                            Stars
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="repositories" className="mt-6">
                        <div className="grid gap-4">
                            {repositories.map((repo) => (
                                <Card key={repo.id} className="bg-gray-900 border-gray-800">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-emerald-400 hover:text-emerald-300">
                                                        <Link to={`/${username}/${repo.name}`}>{repo.name}</Link>
                                                    </h3>
                                                    {repo.isPrivate && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Private
                                                        </Badge>
                                                    )}
                                                </div>
                                                {repo.description && <p className="text-gray-400 text-sm mb-3">{repo.description}</p>}
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                                                        {repo.language}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4" />
                                                        {repo.stars}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <GitFork className="h-4 w-4" />
                                                        {repo.forks}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Updated {getRelativeTime(repo.updatedAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-6">
                        <div className="space-y-4">
                            {activity.map((item) => (
                                <Card key={item.id} className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {item.type === "commit" && <GitFork className="h-4 w-4 text-green-500" />}
                                                {item.type === "pr" && <GitFork className="h-4 w-4 text-blue-500" />}
                                                {item.type === "star" && <Star className="h-4 w-4 text-yellow-500" />}
                                                {item.type === "issue" && <Eye className="h-4 w-4 text-red-500" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="text-emerald-400">{item.repository}</span>
                                                    <span className="text-gray-400 mx-2">•</span>
                                                    {item.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{getRelativeTime(item.timestamp)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="stars" className="mt-6">
                        <div className="text-center py-16">
                            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No starred repositories yet</h3>
                            <p className="text-gray-400">Starred repositories will appear here.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
