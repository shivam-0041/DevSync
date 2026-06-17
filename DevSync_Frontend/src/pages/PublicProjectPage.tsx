import { Link, useParams, useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
    Code,
    GitBranch,
    Star,
    Eye,
    Download,
    FileCode,
    Folder,
    ChevronDown,
    Clock,
    MessageSquare,
    GitCommit,
    GitPullRequest,
    AlertCircle,
    Check,
    Lock,
    Globe,
    LogIn,
    Users,
    Activity,
    ExternalLink,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { fetchPublicProjectDetail, downloadFiles, toggleStarProject } from "../routes/projects"
import { useEffect, useState, useMemo } from "react"

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const formatSafeDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "unknown"
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "unknown"
        return formatDistanceToNow(date, { addSuffix: true })
    } catch {
        return "unknown"
    }
}

function markdownToHtml(markdown?: string | null) {
    if (!markdown) return ""
    let html = markdown
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gm, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
        .replace(/\n/gm, "<br>")
    html = html.replace(/```([\s\S]*?)```/gm, (_m: string, p1: string) => `<pre><code>${p1.trim()}</code></pre>`)
    return html
}

// ─────────────────────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────────────────────
interface FileItemData {
    id: number
    name: string
    item_type: "file" | "folder"
    filetype?: string
    file_url?: string
    size?: number
    uploaded_at?: string
    uploaded_by?: string
    branch?: string
    children?: FileItemData[]
    depth?: number
}

interface IssueData {
    id: number
    title: string
    status: string
    issue_type?: string
    priority?: string
    labels?: string[]
    created_by_username?: string
    created_at?: string
}

interface PullRequestData {
    id: number
    from_branch?: string
    to_branch?: string
    created_by?: string
    message?: string
    status: string
    is_draft?: boolean
    created_at?: string
}

interface DiscussionData {
    id: number
    thread_id?: string
    title: string
    thread_type?: string
    created_by?: string
    created_at?: string
    comment_count?: number
    is_closed?: boolean
    last_activity?: string
    labels?: string[]
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────
function PublicFileItem({
    name,
    type,
    size,
    lastUpdated,
    depth = 0,
}: {
    name: string
    type: string
    size: string
    lastUpdated: string
    depth?: number
}) {
    return (
        <div
            className="flex items-center justify-between px-3 py-2.5 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/70 transition-colors border-b border-zinc-100 dark:border-zinc-800"
            style={{ paddingLeft: `${16 + depth * 16}px` }}
        >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {type === "folder" ? (
                    <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                    <FileCode className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                )}
                <span className={`text-sm truncate ${type === "folder" ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {name}
                </span>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                {size && size !== "0 B" && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 w-12 text-right">{size}</span>
                )}
                <span className="text-xs text-zinc-500 dark:text-zinc-400 w-24 text-right">{lastUpdated}</span>
            </div>
        </div>
    )
}

function IssueRow({ issue }: { issue: IssueData }) {
    return (
        <Link to={`/issue/${issue.id}`} className="block">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <AlertCircle className={`h-4 w-4 flex-shrink-0 ${issue.status === "open" ? "text-emerald-500" : "text-zinc-400"}`} />
                            <h3 className="font-medium text-sm truncate">{issue.title}</h3>
                            <Badge variant="outline" className="text-xs">#{issue.id}</Badge>
                            {issue.priority && (
                                <Badge variant="outline" className={`text-xs ${issue.priority === "high" ? "border-red-400 text-red-500" : issue.priority === "medium" ? "border-amber-400 text-amber-500" : "border-zinc-400"}`}>
                                    {issue.priority}
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                            Opened by <span className="font-medium">@{issue.created_by_username || "unknown"}</span> · {formatSafeDate(issue.created_at)}
                        </p>
                    </div>
                    <Badge variant={issue.status === "open" ? "secondary" : "outline"} className="flex-shrink-0">
                        {issue.status}
                    </Badge>
                </div>
            </div>
        </Link>
    )
}

function PullRequestRow({ pr }: { pr: PullRequestData }) {
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <GitPullRequest className={`h-4 w-4 flex-shrink-0 ${pr.status === "open" ? "text-purple-500" : "text-zinc-400"}`} />
                        <h3 className="font-medium text-sm truncate">
                            {pr.message || `Merge ${pr.from_branch} into ${pr.to_branch}`}
                        </h3>
                        <Badge variant="outline" className="text-xs">#{pr.id}</Badge>
                        {pr.is_draft && <Badge variant="outline" className="text-xs text-zinc-500">Draft</Badge>}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{pr.from_branch}</span>
                        <span className="mx-1">→</span>
                        <span className="font-mono text-zinc-600 dark:text-zinc-400">{pr.to_branch}</span>
                        {pr.created_by && <> · by <span className="font-medium">@{pr.created_by}</span></>}
                        {" · "}{formatSafeDate(pr.created_at)}
                    </p>
                </div>
                <Badge variant={pr.status === "open" ? "secondary" : "outline"} className="flex-shrink-0">
                    {pr.status}
                </Badge>
            </div>
        </div>
    )
}

function DiscussionRow({ thread }: { thread: DiscussionData }) {
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <MessageSquare className={`h-4 w-4 flex-shrink-0 ${thread.is_closed ? "text-zinc-400" : "text-blue-500"}`} />
                        <h3 className="font-medium text-sm truncate">{thread.title}</h3>
                        {thread.thread_type && (
                            <Badge variant="outline" className="text-xs capitalize">{thread.thread_type}</Badge>
                        )}
                        {thread.is_closed && <Badge variant="outline" className="text-xs text-zinc-400">Closed</Badge>}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                        Started by <span className="font-medium">@{thread.created_by || "unknown"}</span>
                        {" · "}{formatSafeDate(thread.created_at)}
                        {" · "}{thread.comment_count || 0} comment{thread.comment_count !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Login CTA Banner (shown when unauthenticated)
// ─────────────────────────────────────────────────────────────
function LoginCTABanner() {
    return (
        <div className="bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl px-5 py-3.5 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <LogIn className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        Sign in to collaborate on this project
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Create issues, open pull requests, join discussions, and more.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/login">
                    <Button size="sm" variant="outline" className="border-emerald-400/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                        Sign In
                    </Button>
                </Link>
                <Link to="/register">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Register
                    </Button>
                </Link>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Auth-gate inline banner (inside tabs)
// ─────────────────────────────────────────────────────────────
function AuthGateBanner({ action }: { action: string }) {
    return (
        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-5 text-center my-4">
            <Lock className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sign in to {action}</p>
            <p className="text-xs text-zinc-500 mb-3">You need a DevSync account to do this.</p>
            <div className="flex items-center justify-center gap-2">
                <Link to="/login">
                    <Button size="sm" variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">Register</Button>
                </Link>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Flatten nested file tree helper
// ─────────────────────────────────────────────────────────────
function flattenFiles(files: FileItemData[]): FileItemData[] {
    if (!Array.isArray(files)) return []
    const result: FileItemData[] = []
    const traverse = (items: FileItemData[], depth: number = 0) => {
        items.forEach((item) => {
            result.push({ ...item, depth })
            if (item.children && item.children.length > 0) traverse(item.children, depth + 1)
        })
    }
    traverse(files)
    return result
}

function formatFileSize(bytes?: number): string {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────
export default function PublicProjectPage() {
    const { username, slug } = useParams<{ username: string; slug: string }>()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [project, setProject] = useState<any>(null)
    const [currentBranch, setCurrentBranch] = useState<string>("main")
    const [branches, setBranches] = useState<string[]>([])

    // Detect if the user is logged in (for conditional UI)
    const isLoggedIn = !!localStorage.getItem("access")

    // ── Fetch project data ──
    useEffect(() => {
        if (!username || !slug) return
        setLoading(true)
        setIsPrivate(false)
        fetchPublicProjectDetail(username, slug)
            .then((result) => {
                if (result.success && result.data) {
                    setProject(result.data)
                } else if (result.status === 403) {
                    setIsPrivate(true)
                } else if (result.status === 404) {
                    // Could be private or genuinely not found
                    setNotFound(true)
                } else {
                    setNotFound(true)
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [username, slug])

    // ── Populate branch list once project loads ──
    useEffect(() => {
        if (project?.branches) {
            const names = project.branches.map((b: any) => b.name)
            setBranches(names)
            const defaultBranch = project.branches.find((b: any) => b.is_default)
            if (defaultBranch) setCurrentBranch(defaultBranch.name)
        }
    }, [project])

    // ── Memoised derived data ──
    const fileRows = useMemo(() => flattenFiles(project?.files || []), [project?.files])
    const issues = useMemo(() => (Array.isArray(project?.issues) ? project.issues : []), [project?.issues])
    const pullRequests = useMemo(() => (Array.isArray(project?.pull_requests) ? project.pull_requests : []), [project?.pull_requests])
    const discussions = useMemo(() => (Array.isArray(project?.discussions) ? project.discussions : []), [project?.discussions])
    const recentActivities = useMemo(() => (Array.isArray(project?.activities) ? project.activities.slice(0, 5) : []), [project?.activities])
    const contributors = useMemo(() => (Array.isArray(project?.contributors) ? project.contributors : []), [project?.contributors])
    const languageRows = useMemo(() => {
        if (!project?.languages || typeof project.languages !== "object") return []
        return Array.isArray(project.languages)
            ? project.languages.slice(0, 5)
            : Object.entries(project.languages).map(([name, percentage]) => ({ name, percentage })).slice(0, 5)
    }, [project?.languages])

    // ── Star toggle ──
    const handleToggleStar = async () => {
        if (!isLoggedIn) {
            navigate("/login")
            return
        }
        try {
            const result = await toggleStarProject(project.slug)
            if (result) {
                setProject((prev: any) => ({ ...prev, is_starred: result.is_starred, stars: result.stars }))
                toast.success(result.is_starred ? "Starred project" : "Unstarred project")
            }
        } catch {
            toast.error("Failed to toggle star")
        }
    }

    // ── Download ZIP ──
    const handleDownload = async () => {
        try {
            const result = await downloadFiles(project.slug, currentBranch)
            if (result.success) {
                toast.success("Download started")
            } else {
                toast.error(result.error || "Failed to download")
            }
        } catch {
            toast.error("Download failed")
        }
    }

    // ─────────────────────────────────────────────
    // Loading state
    // ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    <p className="text-sm text-zinc-500">Loading project…</p>
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────
    // Error / private / not found state
    // ─────────────────────────────────────────────
    if (notFound || !project) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-6">
                        {isPrivate
                            ? <Lock className="h-8 w-8 text-zinc-400" />
                            : <Globe className="h-8 w-8 text-zinc-400" />
                        }
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">
                        {isPrivate ? "This project is private" : "Project not found"}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
                        {isPrivate
                            ? "You need to be a member of this project to view it."
                            : "The project you're looking for doesn't exist or may have been removed."}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link to="/">
                            <Button variant="outline">Go Home</Button>
                        </Link>
                        <Link to="/explore">
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Explore Projects</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const langColors = ["bg-yellow-500", "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500", "bg-pink-500"]

    // ─────────────────────────────────────────────
    // Main render
    // ─────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* ── Header ── */}
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <Code className="h-6 w-6 text-emerald-500" />
                            <span className="font-bold">DevSync</span>
                        </Link>
                        <span className="text-zinc-400">/</span>
                        <Link to={`/p/${project.created_by?.username}`} className="text-sm hover:underline text-zinc-600 dark:text-zinc-400">
                            {project.created_by?.username || username}
                        </Link>
                        <span className="text-zinc-400">/</span>
                        <span className="text-sm font-medium">{project.name}</span>
                        <Badge
                            variant={project.visibility === "public" ? "secondary" : "outline"}
                            className="ml-2 text-xs"
                        >
                            {project.visibility === "public"
                                ? <><Globe className="h-3 w-3 mr-1" />Public</>
                                : <><Lock className="h-3 w-3 mr-1" />Private</>
                            }
                        </Badge>
                        {/* Public view indicator chip */}
                        <span className="ml-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Eye className="h-3 w-3" /> Public View
                        </span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* ── CTA Banner for unauthenticated users ── */}
                {!isLoggedIn && <LoginCTABanner />}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ── Main content ── */}
                    <div className="flex-1 max-w-5xl">
                        {/* Project title & action buttons */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                {project.created_by?.avatar && (
                                    <Avatar className="h-10 w-10 ring-2 ring-emerald-500/20">
                                        <AvatarImage src={project.created_by.avatar} />
                                        <AvatarFallback className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                            {(project.created_by?.username || "?")[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div>
                                    <h1 className="text-2xl font-bold">{project.name}</h1>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-0.5">{project.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" /> Watch
                                </Button>
                                <Button
                                    variant={project.is_starred ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleToggleStar}
                                    className={project.is_starred ? "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500" : ""}
                                >
                                    <Star className={`h-4 w-4 mr-1 ${project.is_starred ? "fill-white" : ""}`} />
                                    {project.is_starred ? "Starred" : "Star"} ({project.stars || 0})
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-1" /> Download
                                </Button>
                            </div>
                        </div>

                        {/* ── Code pane (branch selector + file tree + readme) ── */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-8">
                            {/* Branch bar */}
                            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1 rounded-full shadow-sm text-xs border-emerald-300/70 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40"
                                            >
                                                <GitBranch className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                <span className="font-medium">Branch</span>
                                                <span className="mx-1 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-900/60 bg-white/70 dark:bg-white/10 text-emerald-800 dark:text-emerald-200">
                                                    {currentBranch}
                                                </span>
                                                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-48">
                                            <div className="px-2 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">Switch branch</div>
                                            {branches.length > 0 ? (
                                                branches.map((b) => (
                                                    <DropdownMenuItem
                                                        key={b}
                                                        onSelect={() => setCurrentBranch(b)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {b === currentBranch ? (
                                                            <Check className="h-4 w-4 text-emerald-500" />
                                                        ) : (
                                                            <span className="w-4" />
                                                        )}
                                                        <span className="truncate">{b}</span>
                                                    </DropdownMenuItem>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-xs text-zinc-500">No branches</div>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                        <GitBranch className="h-3.5 w-3.5 mr-1" /> {project.branch_count || branches.length}
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                        <GitCommit className="h-3.5 w-3.5 mr-1" /> {project.commit_count || 0}
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        Updated {formatSafeDate(project.updated_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="code">
                                <div className="border-b border-zinc-200 dark:border-zinc-800">
                                    <TabsList className="p-0 bg-transparent border-b-0">
                                        <TabsTrigger
                                            value="code"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <FileCode className="h-4 w-4 mr-2" /> Code
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="issues"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <AlertCircle className="h-4 w-4 mr-2" /> Issues ({project.issues_count || issues.length})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="pull-requests"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <GitPullRequest className="h-4 w-4 mr-2" /> Pull Requests ({project.pull_requests_count || pullRequests.length})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="discussions"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" /> Discussions ({discussions.length})
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                {/* ── Code Tab ── */}
                                <TabsContent value="code" className="p-0 m-0">
                                    <div className="p-4">
                                        {/* File tree */}
                                        {fileRows.length > 0 ? (
                                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden mb-5">
                                                <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center gap-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    <div className="flex-1">Name</div>
                                                    <div className="w-12 text-right">Size</div>
                                                    <div className="w-24 text-right">Modified</div>
                                                </div>
                                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                                    {fileRows.map((file: FileItemData) => (
                                                        <PublicFileItem
                                                            key={file.id}
                                                            name={file.name}
                                                            type={file.item_type}
                                                            size={formatFileSize(file.size)}
                                                            lastUpdated={formatSafeDate(file.uploaded_at)}
                                                            depth={(file as any).depth || 0}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg mb-5 p-8 text-center text-zinc-500 text-sm">
                                                <FileCode className="h-8 w-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                                                No files have been uploaded yet
                                            </div>
                                        )}

                                        {/* README */}
                                        {project.readme && (
                                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                                                <div className="bg-zinc-50 dark:bg-zinc-900 p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                                                    <FileCode className="h-4 w-4 text-zinc-400" />
                                                    <h3 className="font-medium text-sm">README.md</h3>
                                                </div>
                                                <div className="p-5 prose dark:prose-invert max-w-none prose-sm">
                                                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(project.readme) }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* ── Issues Tab ── */}
                                <TabsContent value="issues" className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {issues.length} issue{issues.length !== 1 ? "s" : ""}
                                        </h3>
                                        {isLoggedIn ? (
                                            <Link to={`/${username}/project/${slug}/issues/new`}>
                                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                                    New Issue
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link to="/login">
                                                <Button size="sm" variant="outline" className="text-xs">
                                                    <LogIn className="h-3.5 w-3.5 mr-1" /> Sign in to create issue
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                    {issues.length === 0 ? (
                                        <div className="text-center py-10 text-zinc-500">
                                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                                            <p className="text-sm">No issues yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {issues.map((issue: IssueData) => (
                                                <IssueRow key={issue.id} issue={issue} />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                {/* ── Pull Requests Tab ── */}
                                <TabsContent value="pull-requests" className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {pullRequests.length} pull request{pullRequests.length !== 1 ? "s" : ""}
                                        </h3>
                                        {isLoggedIn ? (
                                            <Link to={`/${username}/project/${slug}/pull-request`}>
                                                <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                                                    New Pull Request
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link to="/login">
                                                <Button size="sm" variant="outline" className="text-xs">
                                                    <LogIn className="h-3.5 w-3.5 mr-1" /> Sign in to create PR
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                    {pullRequests.length === 0 ? (
                                        <div className="text-center py-10 text-zinc-500">
                                            <GitPullRequest className="h-8 w-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                                            <p className="text-sm">No pull requests yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pullRequests.map((pr: PullRequestData) => (
                                                <PullRequestRow key={pr.id} pr={pr} />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                {/* ── Discussions Tab ── */}
                                <TabsContent value="discussions" className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {discussions.length} discussion{discussions.length !== 1 ? "s" : ""}
                                        </h3>
                                        {isLoggedIn ? (
                                            <Link to={`/${username}/project/${slug}`}>
                                                <Button size="sm" variant="outline" className="text-xs border-blue-400/40 text-blue-700 dark:text-blue-400">
                                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                                    Open in full workspace
                                                </Button>
                                            </Link>
                                        ) : null}
                                    </div>

                                    {/* Read-only notice */}
                                    {!isLoggedIn && (
                                        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                            <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                                            You are viewing discussions in read-only mode. Sign in to participate.
                                        </div>
                                    )}

                                    {discussions.length === 0 ? (
                                        <div className="text-center py-10 text-zinc-500">
                                            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                                            <p className="text-sm">No discussions yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {discussions.map((thread: DiscussionData) => (
                                                <DiscussionRow key={thread.id} thread={thread} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Auth gate for starting discussion */}
                                    {!isLoggedIn && discussions.length >= 0 && (
                                        <AuthGateBanner action="start a discussion or leave a comment" />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="w-full lg:w-80 space-y-5">
                        {/* About */}
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                <CardTitle className="text-sm">About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {project.description && (
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{project.description}</p>
                                )}
                                {project.license && (
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                            {project.license}
                                        </span>
                                        <span className="text-xs">License</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
                                    <span className="flex items-center gap-1.5">
                                        <Star className="h-4 w-4 text-amber-400" />
                                        <span className="font-medium">{project.stars || 0}</span>
                                        <span className="text-xs text-zinc-500">stars</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <GitBranch className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium">{project.branch_count || 0}</span>
                                        <span className="text-xs text-zinc-500">branches</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4 text-red-400" />
                                        <span className="font-medium">{project.issues_count || 0}</span>
                                        <span className="text-xs text-zinc-500">issues</span>
                                    </span>
                                </div>
                                {project.updated_at && (
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        Updated {formatSafeDate(project.updated_at)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contributors */}
                        {contributors.length > 0 && (
                            <Card>
                                <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Users className="h-4 w-4 text-zinc-400" />
                                        Contributors
                                        <span className="ml-auto text-xs text-zinc-500 font-normal">{contributors.length}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {contributors.map((c: any) => {
                                            const initials = (c.username || "?")[0].toUpperCase()
                                            return (
                                                <Link key={c.id} to={`/p/${c.username}`} title={c.username}>
                                                    <Avatar className="h-8 w-8 ring-2 ring-zinc-200 dark:ring-zinc-700 hover:ring-emerald-400 transition-all">
                                                        {c.avatar ? (
                                                            <AvatarImage src={c.avatar} />
                                                        ) : null}
                                                        <AvatarFallback className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                                            {initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Languages */}
                        {languageRows.length > 0 && (
                            <Card>
                                <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <CardTitle className="text-sm">Languages</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    {languageRows.map((lang: any, idx: number) => {
                                        const pct = typeof lang.percentage === "number" ? lang.percentage : 0
                                        return (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm">{lang.name || `Language ${idx + 1}`}</span>
                                                    <span className="text-xs text-zinc-500">{pct.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                                                    <div
                                                        className={`${langColors[idx % langColors.length]} h-1.5 rounded-full transition-all duration-500`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Activity */}
                        {recentActivities.length > 0 && (
                            <Card>
                                <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-zinc-400" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    {recentActivities.map((act: any) => {
                                        const uname = act.user?.username || "Unknown"
                                        const initials = uname[0].toUpperCase()
                                        return (
                                            <div key={act.id} className="flex gap-3 items-start">
                                                <Avatar className="h-6 w-6 flex-shrink-0">
                                                    <AvatarFallback className="text-[9px] bg-zinc-200 dark:bg-zinc-700">{initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-sm leading-tight">
                                                        <span className="font-medium">{uname}</span>{" "}
                                                        <span className="text-zinc-600 dark:text-zinc-400">{act.action}</span>
                                                    </p>
                                                    <p className="text-xs text-zinc-500 mt-0.5">{formatSafeDate(act.timestamp)}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* Owner card */}
                        <Card>
                            <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                <CardTitle className="text-sm">Project Owner</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Link to={`/p/${project.created_by?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <Avatar className="h-10 w-10 ring-2 ring-emerald-500/20">
                                        {project.created_by?.avatar && <AvatarImage src={project.created_by.avatar} />}
                                        <AvatarFallback className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm">
                                            {(project.created_by?.username || "?")[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{project.created_by?.username}</p>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                            <ExternalLink className="h-3 w-3" />View profile
                                        </p>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
