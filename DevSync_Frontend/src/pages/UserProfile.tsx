"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
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
    ExternalLink,
    Edit,
    GitBranch,
    Loader2,
    Activity,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useParams, Link } from "react-router-dom"
import { Code } from "lucide-react"
import { DevToolsSidebar } from "../components/dev-tools-sidebar"
import {
    followUser,
    unfollowUser,
    checkIsFollowing,
    fetchPublicProfile,
    fetchUserActivity,
    fetchPublicUserProjects,
} from "../routes/profile"
import { toggleStarProject } from "../routes/projects"
import { useAuth } from "../components/contexts/auth-context"

// ─── Types ───────────────────────────────────────────────────────────────────

interface ActivityItem {
    id: number
    action: string
    timestamp: string
    project: string | null
    project_slug: string | null
    project_owner: string | null
    extra_data: Record<string, any>
}

interface ProfileProject {
    slug: string
    name: string
    description: string
    visibility: string
    languages: string | string[]
    stars: number
    forks?: number
    updated_at: string
    is_starred: boolean
    created_by?: string
}

interface ProfileData {
    name: string
    username: string
    avatar: string
    bio: string
    location: string
    email: string
    website: string
    joinedDate: string
    followers: number
    following: number
    repositories: number
    contributions: number
    skills: (string | { name: string; level?: number })[]
    socialLinks: {
        github: string
        twitter: string
        linkedin: string
        personal_website: string
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
    if (!iso) return ""
    try {
        const date = new Date(iso)
        if (isNaN(date.getTime())) return ""
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
        if (seconds < 60) return "just now"
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        if (days < 30) return `${days}d ago`
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
        return ""
    }
}

function getActivityIcon(action: string): React.ReactNode {
    const a = (action || "").toLowerCase()
    if (a.includes("commit") || a.includes("push"))
        return <GitCommit className="h-4 w-4 text-emerald-400" />
    if (a.includes("pull") || a.includes("pr") || a.includes("merge"))
        return <GitPullRequest className="h-4 w-4 text-purple-400" />
    if (a.includes("branch"))
        return <GitBranch className="h-4 w-4 text-blue-400" />
    if (a.includes("issue"))
        return <FileCode className="h-4 w-4 text-orange-400" />
    return <Activity className="h-4 w-4 text-zinc-400" />
}

function getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
        JavaScript: "bg-yellow-500/20 text-yellow-400",
        TypeScript: "bg-blue-500/20 text-blue-400",
        Python: "bg-green-500/20 text-green-400",
        Java: "bg-orange-500/20 text-orange-400",
        "C#": "bg-purple-500/20 text-purple-400",
        Ruby: "bg-red-500/20 text-red-400",
        Go: "bg-cyan-500/20 text-cyan-400",
        PHP: "bg-indigo-500/20 text-indigo-400",
        Swift: "bg-orange-400/20 text-orange-300",
        Kotlin: "bg-purple-400/20 text-purple-300",
        Rust: "bg-amber-500/20 text-amber-400",
    }
    return colors[language] || "bg-zinc-700/50 text-zinc-400"
}

function extractSkillName(skill: string | { name: string; level?: number }): string {
    if (typeof skill === "string") return skill
    return skill?.name || ""
}

function primaryLang(languages: string | string[] | undefined | null): string | null {
    if (!languages) return null
    if (Array.isArray(languages)) return (languages as string[])[0] || null
    const parts = String(languages).split(",").map((s) => s.trim()).filter(Boolean)
    return parts[0] || null
}

function resolveUrl(raw: string, prefix: string): string {
    if (!raw) return ""
    if (raw.startsWith("http")) return raw
    return `${prefix}${raw}`
}

// ─── Contribution Graph ───────────────────────────────────────────────────────

function ContributionGraph({ activities }: { activities: ActivityItem[] }) {
    const { weeks, months, totalContributions } = useMemo(() => {
        const dateMap: Record<string, number> = {}
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

        activities.forEach((act) => {
            if (!act.timestamp) return
            const date = new Date(act.timestamp)
            if (date >= oneYearAgo) {
                const key = date.toISOString().split("T")[0]
                dateMap[key] = (dateMap[key] || 0) + 1
            }
        })

        const today = new Date()
        today.setHours(23, 59, 59, 999)

        // Go back ~52 weeks and align to Sunday
        const start = new Date(today)
        start.setDate(start.getDate() - 364)
        start.setDate(start.getDate() - start.getDay()) // rewind to Sunday

        const weeksData: { date: string; count: number; future: boolean }[][] = []
        const monthLabels: { label: string; week: number }[] = []
        const cursor = new Date(start)
        let lastMonth = -1

        for (let w = 0; w < 53; w++) {
            const week: { date: string; count: number; future: boolean }[] = []
            for (let d = 0; d < 7; d++) {
                const dateStr = cursor.toISOString().split("T")[0]
                const future = cursor > today
                week.push({ date: dateStr, count: dateMap[dateStr] || 0, future })
                const m = cursor.getMonth()
                if (d === 0 && m !== lastMonth && !future) {
                    monthLabels.push({
                        label: cursor.toLocaleDateString("en-US", { month: "short" }),
                        week: w,
                    })
                    lastMonth = m
                }
                cursor.setDate(cursor.getDate() + 1)
            }
            weeksData.push(week)
        }

        const total = Object.values(dateMap).reduce((s, c) => s + c, 0)
        return { weeks: weeksData, months: monthLabels, totalContributions: total }
    }, [activities])

    const cellColor = (count: number, future: boolean) => {
        if (future) return "bg-zinc-900"
        if (count === 0) return "bg-zinc-800"
        if (count === 1) return "bg-emerald-900"
        if (count <= 3) return "bg-emerald-700"
        if (count <= 6) return "bg-emerald-500"
        return "bg-emerald-400"
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium">
                    {totalContributions} contributions in the last year
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto pb-1">
                    {/* Month labels row */}
                    <div className="flex gap-[3px] mb-1">
                        {weeks.map((_, wi) => {
                            const ml = months.find((m) => m.week === wi)
                            return (
                                <div key={wi} className="w-[11px] shrink-0 text-[9px] text-zinc-500 leading-none">
                                    {ml ? ml.label : ""}
                                </div>
                            )
                        })}
                    </div>
                    {/* Grid */}
                    <div className="flex gap-[3px]">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[3px]">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        title={day.future ? "" : `${day.date}: ${day.count} ${day.count === 1 ? "activity" : "activities"}`}
                                        className={`w-[11px] h-[11px] rounded-sm ${cellColor(day.count, day.future)} cursor-default transition-opacity hover:opacity-80`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-500">
                    <span>Less</span>
                    {["bg-zinc-800", "bg-emerald-900", "bg-emerald-700", "bg-emerald-500", "bg-emerald-400"].map((c) => (
                        <div key={c} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
                    ))}
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const UserProfile = () => {
    const { username } = useParams<{ username: string }>()
    const { user: authUser } = useAuth()

    // ── State ──
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [userProjects, setUserProjects] = useState<ProfileProject[]>([])
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFollowLoading, setIsFollowLoading] = useState(false)
    const [isFetchingProfile, setIsFetchingProfile] = useState(true)
    const [followerCount, setFollowerCount] = useState(0)
    const [starringSlug, setStarringSlug] = useState<string | null>(null)
    const [projectStarState, setProjectStarState] = useState<
        Record<string, { is_starred: boolean; stars: number }>
    >({})

    // Determine logged-in username (from auth context, fall back to localStorage)
    const loggedInUsername =
        authUser?.username ||
        (() => {
            try { return JSON.parse(localStorage.getItem("user") || "{}").username } catch { return null }
        })()

    const isOwnProfile = !!loggedInUsername && loggedInUsername === username

    // ── Fetch profile ──
    useEffect(() => {
        if (!username) return
        setIsFetchingProfile(true)
        fetchPublicProfile(username)
            .then((data) => {
                if (data) {
                    setProfileData(data as ProfileData)
                    setFollowerCount(data.followers ?? 0)
                }
            })
            .finally(() => setIsFetchingProfile(false))
    }, [username])

    // ── Fetch projects ──
    useEffect(() => {
        if (!username) return
        fetchPublicUserProjects(username).then((projects) => {
            setUserProjects(projects)
            const starMap: Record<string, { is_starred: boolean; stars: number }> = {}
            projects.forEach((p: ProfileProject) => {
                starMap[p.slug] = { is_starred: p.is_starred ?? false, stars: p.stars ?? 0 }
            })
            setProjectStarState(starMap)
        })
    }, [username])

    // ── Fetch activity ──
    useEffect(() => {
        if (!username) return
        fetchUserActivity(username).then((data) => {
            setActivities(Array.isArray(data?.activities) ? data.activities : [])
        })
    }, [username])

    // ── Check following (skip for own profile) ──
    useEffect(() => {
        if (!username || isOwnProfile) return
        checkIsFollowing(username).then(setIsFollowing)
    }, [username, isOwnProfile])

    // ── Follow / Unfollow ──
    const handleFollowToggle = async () => {
        if (!username) return
        setIsFollowLoading(true)
        try {
            if (isFollowing) {
                const res = await unfollowUser(username)
                if (res.success) { setIsFollowing(false); setFollowerCount((c) => Math.max(0, c - 1)) }
            } else {
                const res = await followUser(username)
                if (res.success) { setIsFollowing(true); setFollowerCount((c) => c + 1) }
            }
        } finally {
            setIsFollowLoading(false)
        }
    }

    // ── Star toggle ──
    const handleStarProject = async (slug: string) => {
        if (starringSlug) return
        setStarringSlug(slug)
        try {
            const result = await toggleStarProject(slug)
            if (result) {
                setProjectStarState((prev) => ({ ...prev, [slug]: result }))
            }
        } finally {
            setStarringSlug(null)
        }
    }

    // ── Derived display values ──
    const displayName = profileData?.name || username || "Unknown User"
    const avatar = profileData?.avatar || ""
    const bio = profileData?.bio || ""
    const location = profileData?.location || ""
    const email = profileData?.email || ""
    const website = profileData?.website || ""
    const joinedDate = profileData?.joinedDate
        ? new Date(profileData.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : ""
    const skills = Array.isArray(profileData?.skills) ? profileData!.skills : []
    const social = profileData?.socialLinks || { github: "", twitter: "", linkedin: "", personal_website: "" }

    const recentActivities = activities.slice(0, 20)

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* ── Header ── */}
            <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <Code className="h-6 w-6 text-emerald-400" />
                            <span className="font-bold text-white">DevSync</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link to={loggedInUsername ? `/dashboard/${loggedInUsername}` : "/login"}>
                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to={loggedInUsername ? `/dashboard/${loggedInUsername}` : "/login"}>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarFallback className="bg-zinc-700 text-zinc-300 text-sm">
                                        {loggedInUsername ? loggedInUsername.substring(0, 2).toUpperCase() : "?"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {/* ── Loading ── */}
                    {isFetchingProfile && (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                        </div>
                    )}

                    {!isFetchingProfile && (
                        <>
                            {/* ── Profile header ── */}
                            <div className="mb-8">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-zinc-800 shrink-0">
                                        <AvatarImage src={avatar} alt={displayName} />
                                        <AvatarFallback className="text-2xl bg-zinc-700 text-zinc-300">
                                            {displayName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 space-y-4 min-w-0">
                                        {/* Name + action buttons */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div>
                                                <h1 className="text-2xl md:text-3xl font-bold text-white">{displayName}</h1>
                                                <p className="text-zinc-400">@{username}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isOwnProfile ? (
                                                    <Link to={`/${loggedInUsername}/account/settings`}>
                                                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Profile
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <Button
                                                            disabled={isFollowLoading}
                                                            onClick={handleFollowToggle}
                                                            className={
                                                                isFollowing
                                                                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                                                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                            }
                                                        >
                                                            {isFollowLoading ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : isFollowing ? "Following" : "Follow"}
                                                        </Button>
                                                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                                            Message
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bio + meta */}
                                        <div className="space-y-2">
                                            {bio && <p className="text-zinc-300">{bio}</p>}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-zinc-400">
                                                {location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" /> {location}
                                                    </span>
                                                )}
                                                {email && (
                                                    <a href={`mailto:${email}`} className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
                                                        <Mail className="h-3.5 w-3.5 shrink-0" /> {email}
                                                    </a>
                                                )}
                                                {website && (
                                                    <a
                                                        href={website.startsWith("http") ? website : `https://${website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                                                    >
                                                        <Globe className="h-3.5 w-3.5 shrink-0" />
                                                        {website.replace(/^https?:\/\//, "")}
                                                    </a>
                                                )}
                                                {joinedDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 shrink-0" /> Joined {joinedDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Followers / following */}
                                        <div className="flex items-center gap-1 text-sm">
                                            <Users className="h-4 w-4 text-zinc-500" />
                                            <span className="text-zinc-300">
                                                <strong className="text-white">{followerCount}</strong> followers
                                            </span>
                                            <span className="text-zinc-600 mx-1">·</span>
                                            <span className="text-zinc-300">
                                                <strong className="text-white">{profileData?.following ?? 0}</strong> following
                                            </span>
                                        </div>

                                        {/* Social links */}
                                        <div className="flex items-center gap-3">
                                            {social.github && (
                                                <a
                                                    href={resolveUrl(social.github, "https://github.com/")}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="text-zinc-400 hover:text-white transition-colors"
                                                    title="GitHub"
                                                >
                                                    <Github className="h-5 w-5" />
                                                </a>
                                            )}
                                            {social.twitter && (
                                                <a
                                                    href={resolveUrl(social.twitter, "https://twitter.com/")}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="text-zinc-400 hover:text-white transition-colors"
                                                    title="Twitter / X"
                                                >
                                                    <Twitter className="h-5 w-5" />
                                                </a>
                                            )}
                                            {social.linkedin && (
                                                <a
                                                    href={resolveUrl(social.linkedin, "https://linkedin.com/in/")}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="text-zinc-400 hover:text-white transition-colors"
                                                    title="LinkedIn"
                                                >
                                                    <Linkedin className="h-5 w-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Skills ── */}
                            {skills.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-white mb-4">Skills &amp; Expertise</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, i) => (
                                            <Badge key={i} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700">
                                                {extractSkillName(skill)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Contribution graph (always shown) ── */}
                            <div className="mb-8">
                                <ContributionGraph activities={activities} />
                            </div>

                            {/* ── Tabs ── */}
                            <Tabs defaultValue="projects" className="w-full">
                                <TabsList className="bg-zinc-800 mb-6">
                                    <TabsTrigger value="projects" className="data-[state=active]:bg-zinc-700 text-zinc-300">
                                        Projects ({userProjects.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="activity" className="data-[state=active]:bg-zinc-700 text-zinc-300">
                                        Activity
                                    </TabsTrigger>
                                    <TabsTrigger value="contributions" className="data-[state=active]:bg-zinc-700 text-zinc-300">
                                        Contributions
                                    </TabsTrigger>
                                    <TabsTrigger value="repositories" className="data-[state=active]:bg-zinc-700 text-zinc-300">
                                        Repositories
                                    </TabsTrigger>
                                </TabsList>

                                {/* ── Projects tab ── */}
                                <TabsContent value="projects" className="space-y-4">
                                    {userProjects.length === 0 ? (
                                        <Card className="bg-zinc-900 border-zinc-800">
                                            <CardContent className="p-6 text-zinc-400">No public projects yet.</CardContent>
                                        </Card>
                                    ) : (
                                        userProjects.map((project) => {
                                            const starState = projectStarState[project.slug]
                                            const isStarred = starState?.is_starred ?? project.is_starred
                                            const starCount = starState?.stars ?? project.stars
                                            const lang = primaryLang(project.languages)

                                            return (
                                                <Card key={project.slug} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                    <Link
                                                                        to={`/${username}/project/${project.slug}`}
                                                                        className="text-base font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                                                    >
                                                                        {project.name}
                                                                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                                    </Link>
                                                                    <Badge variant="outline" className="bg-zinc-800 text-zinc-500 border-zinc-700 text-xs py-0">
                                                                        {project.visibility}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{project.description}</p>
                                                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                                                    {lang && (
                                                                        <span className="flex items-center gap-1">
                                                                            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                                                                            {lang}
                                                                        </span>
                                                                    )}
                                                                    <span className="flex items-center gap-1">
                                                                        <Star className="h-3.5 w-3.5" /> {starCount}
                                                                    </span>
                                                                    {project.forks !== undefined && (
                                                                        <span className="flex items-center gap-1">
                                                                            <GitFork className="h-3.5 w-3.5" /> {project.forks}
                                                                        </span>
                                                                    )}
                                                                    <span>Updated {formatRelativeTime(project.updated_at)}</span>
                                                                </div>
                                                            </div>

                                                            {/* Star button */}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={starringSlug === project.slug}
                                                                onClick={() => handleStarProject(project.slug)}
                                                                className={
                                                                    isStarred
                                                                        ? "text-amber-400 hover:text-amber-300 hover:bg-zinc-800 shrink-0"
                                                                        : "text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 shrink-0"
                                                                }
                                                                title={isStarred ? "Unstar" : "Star this project"}
                                                            >
                                                                <Star className={`h-4 w-4 ${isStarred ? "fill-amber-400" : ""}`} />
                                                                <span className="ml-1 text-xs hidden sm:inline">
                                                                    {isStarred ? "Starred" : "Star"}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                    )}
                                </TabsContent>

                                {/* ── Activity tab ── */}
                                <TabsContent value="activity" className="space-y-4">
                                    {recentActivities.length === 0 ? (
                                        <Card className="bg-zinc-900 border-zinc-800">
                                            <CardContent className="p-6 text-zinc-400">No recent activity to show.</CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="bg-zinc-900 border-zinc-800">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-white text-base">Recent Activity</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-zinc-800">
                                                    {recentActivities.map((act) => (
                                                        <div
                                                            key={act.id}
                                                            className="flex items-start gap-3 p-4 hover:bg-zinc-800/40 transition-colors"
                                                        >
                                                            <div className="mt-0.5 shrink-0">{getActivityIcon(act.action)}</div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-zinc-200">
                                                                    {act.action}
                                                                    {act.project && (
                                                                        <>
                                                                            {" in "}
                                                                            <Link
                                                                                to={`/${act.project_owner || username}/project/${act.project_slug}`}
                                                                                className="text-emerald-400 hover:text-emerald-300 font-medium"
                                                                            >
                                                                                {act.project}
                                                                            </Link>
                                                                        </>
                                                                    )}
                                                                </p>
                                                                {act.extra_data?.message && (
                                                                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                                                                        {act.extra_data.message}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-zinc-600 mt-1">
                                                                    {formatRelativeTime(act.timestamp)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                {/* ── Contributions tab ── */}
                                <TabsContent value="contributions" className="space-y-6">
                                    <ContributionGraph activities={activities} />
                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-white text-base">Recent Contributions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {activities.length === 0 ? (
                                                <p className="text-zinc-400 p-4 text-sm">No contributions yet.</p>
                                            ) : (
                                                <div className="divide-y divide-zinc-800">
                                                    {activities.slice(0, 15).map((act) => {
                                                        const a = (act.action || "").toLowerCase()
                                                        const Icon = a.includes("pull") ? GitPullRequest
                                                            : a.includes("issue") ? FileCode
                                                            : GitCommit
                                                        return (
                                                            <div key={act.id} className="flex items-center gap-4 p-4">
                                                                <Icon className="h-5 w-5 text-emerald-400 shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-white truncate">
                                                                        {act.project || "Unknown project"}
                                                                    </p>
                                                                    <p className="text-sm text-zinc-400 truncate">{act.action}</p>
                                                                    <p className="text-xs text-zinc-500 mt-0.5">{formatRelativeTime(act.timestamp)}</p>
                                                                </div>
                                                                {act.project_slug && (
                                                                    <Link
                                                                        to={`/${act.project_owner || username}/project/${act.project_slug}`}
                                                                        className="text-zinc-500 hover:text-white shrink-0 transition-colors"
                                                                        title="View project"
                                                                    >
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* ── Repositories tab ── */}
                                <TabsContent value="repositories" className="space-y-4">
                                    {userProjects.length === 0 ? (
                                        <Card className="bg-zinc-900 border-zinc-800">
                                            <CardContent className="p-6 text-zinc-400">No public repositories yet.</CardContent>
                                        </Card>
                                    ) : (
                                        userProjects.map((project) => {
                                            const lang = primaryLang(project.languages)
                                            const starCount = projectStarState[project.slug]?.stars ?? project.stars
                                            return (
                                                <Card key={project.slug} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <Link
                                                                    to={`/${username}/project/${project.slug}`}
                                                                    className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                                                >
                                                                    {project.name}
                                                                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                                </Link>
                                                                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{project.description}</p>
                                                                <div className="flex items-center flex-wrap gap-3 mt-3">
                                                                    {lang && (
                                                                        <Badge className={getLanguageColor(lang)}>{lang}</Badge>
                                                                    )}
                                                                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                                                                        <Star className="h-3.5 w-3.5" /> {starCount}
                                                                    </span>
                                                                    <span className="text-xs text-zinc-500">
                                                                        Updated {formatRelativeTime(project.updated_at)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                    )}
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </div>
            </div>

            <DevToolsSidebar />
        </div>
    )
}

export default UserProfile
