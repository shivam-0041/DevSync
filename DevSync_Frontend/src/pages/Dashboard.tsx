import { Link, useParams, useNavigate} from "react-router-dom"
import {
  Search,
  GitBranch,
  Star,
  Clock,
  Bell,
  Settings,
  Code,
  Users,
  Folder,
  Sparkles,
  Zap,
  Bookmark,
  Flame,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { TaskAllocation, type DashboardTask } from "../components/task-allocation"
import { ProjectCard } from "../components/project-card"
// import { AIAssistant } from "../components/ai-assistant"
import { QuickActions, QuickActionsHeader } from "../components/quick-actions"
import { TeamMemberList, type TeamMember } from "../components/team-member-list"
import { DevToolsSidebar } from "../components/dev-tools-sidebar"
//import ProjectPage from "./ProjectPage"
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/contexts/auth-context";
import { fetchUserProfile } from '../routes/profile';
import { fetchDashboardTeammates, fetchProjects, fetchMyTasks } from "../routes/projects"
import { useNotifications } from "../components/contexts/notifications-context"
import { getBrandHomePath } from "../lib/brand-link"

interface UserState {
    name?: string;
    username?: string;
    avatar?: string;
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  maintainer: "Maintainer",
  developer: "Developer",
  guest: "Guest",
}

const INITIAL_VISIBLE_ITEMS = 3

type RepoUpdate = {
  language: string
  framework: string
  repo: string
  description: string
  updated: string
  url: string
}

type ToolTrend = {
  name: string
  description: string
  category: string
  trending: number
  updated: string
  url: string
}

type ActivityFeedItem = {
  user: {
    name: string
    initials: string
  }
  action: string
  project: string
  time: string
}

const LANGUAGE_REPO_UPDATES: Record<string, RepoUpdate[]> = {
  javascript: [
    {
      language: "JavaScript",
      framework: "Next.js",
      repo: "vercel/next.js",
      description: "App Router and build pipeline improvements in latest updates.",
      updated: "2 days ago",
      url: "https://github.com/vercel/next.js",
    },
    {
      language: "JavaScript",
      framework: "Vue",
      repo: "vuejs/core",
      description: "Recent core patches and reactivity optimizations.",
      updated: "3 days ago",
      url: "https://github.com/vuejs/core",
    },
  ],
  typescript: [
    {
      language: "TypeScript",
      framework: "Angular",
      repo: "angular/angular",
      description: "New framework updates around tooling and DX.",
      updated: "1 day ago",
      url: "https://github.com/angular/angular",
    },
    {
      language: "TypeScript",
      framework: "TanStack Query",
      repo: "TanStack/query",
      description: "Cache and server-state updates from recent releases.",
      updated: "4 days ago",
      url: "https://github.com/TanStack/query",
    },
  ],
  python: [
    {
      language: "Python",
      framework: "Django",
      repo: "django/django",
      description: "Security and ORM updates in latest branch activity.",
      updated: "2 days ago",
      url: "https://github.com/django/django",
    },
    {
      language: "Python",
      framework: "FastAPI",
      repo: "fastapi/fastapi",
      description: "Recent performance and validation updates.",
      updated: "5 days ago",
      url: "https://github.com/fastapi/fastapi",
    },
  ],
  java: [
    {
      language: "Java",
      framework: "Spring Boot",
      repo: "spring-projects/spring-boot",
      description: "Actuator and dependency updates in current cycle.",
      updated: "3 days ago",
      url: "https://github.com/spring-projects/spring-boot",
    },
  ],
  rust: [
    {
      language: "Rust",
      framework: "Axum",
      repo: "tokio-rs/axum",
      description: "HTTP and middleware ecosystem updates.",
      updated: "6 days ago",
      url: "https://github.com/tokio-rs/axum",
    },
  ],
}

const DEFAULT_REPO_UPDATES: RepoUpdate[] = [
  {
    language: "Web",
    framework: "React",
    repo: "facebook/react",
    description: "Core and concurrent features updated recently.",
    updated: "2 days ago",
    url: "https://github.com/facebook/react",
  },
  {
    language: "Backend",
    framework: "Node.js",
    repo: "nodejs/node",
    description: "Runtime patches and performance updates.",
    updated: "3 days ago",
    url: "https://github.com/nodejs/node",
  },
  {
    language: "TypeScript",
    framework: "SvelteKit",
    repo: "sveltejs/kit",
    description: "Routing and adapter updates in recent releases.",
    updated: "4 days ago",
    url: "https://github.com/sveltejs/kit",
  },
  {
    language: "Python",
    framework: "Flask",
    repo: "pallets/flask",
    description: "Recent maintenance and extension ecosystem updates.",
    updated: "6 days ago",
    url: "https://github.com/pallets/flask",
  },
  {
    language: "Backend",
    framework: "Laravel",
    repo: "laravel/framework",
    description: "Framework patches and DX improvements.",
    updated: "5 days ago",
    url: "https://github.com/laravel/framework",
  },
  {
    language: "Data",
    framework: "Apache Airflow",
    repo: "apache/airflow",
    description: "Scheduler and provider package updates.",
    updated: "2 days ago",
    url: "https://github.com/apache/airflow",
  },
]

const LANGUAGE_TRENDING_TOOLS: Record<string, ToolTrend[]> = {
  javascript: [
    {
      name: "Vite",
      description: "Blazing-fast build tooling and plugin ecosystem growth.",
      category: "Frontend",
      trending: 39,
      updated: "2 days ago",
      url: "https://github.com/vitejs/vite",
    },
    {
      name: "Express",
      description: "Mature backend framework with active middleware updates.",
      category: "Backend",
      trending: 22,
      updated: "4 days ago",
      url: "https://github.com/expressjs/express",
    },
  ],
  typescript: [
    {
      name: "NestJS",
      description: "Structured TypeScript backend with frequent releases.",
      category: "Backend",
      trending: 41,
      updated: "3 days ago",
      url: "https://github.com/nestjs/nest",
    },
    {
      name: "ts-rest",
      description: "Type-safe API contracts gaining adoption.",
      category: "API",
      trending: 31,
      updated: "5 days ago",
      url: "https://github.com/ts-rest/ts-rest",
    },
  ],
  python: [
    {
      name: "FastAPI",
      description: "Performance-focused API framework with active community.",
      category: "Backend",
      trending: 47,
      updated: "2 days ago",
      url: "https://github.com/fastapi/fastapi",
    },
    {
      name: "Pydantic",
      description: "Data validation and settings tooling with rapid improvements.",
      category: "Validation",
      trending: 28,
      updated: "6 days ago",
      url: "https://github.com/pydantic/pydantic",
    },
  ],
  java: [
    {
      name: "Spring Boot",
      description: "Core enterprise framework with dependable updates.",
      category: "Backend",
      trending: 34,
      updated: "3 days ago",
      url: "https://github.com/spring-projects/spring-boot",
    },
  ],
  rust: [
    {
      name: "Axum",
      description: "Async web framework momentum continues this month.",
      category: "Backend",
      trending: 44,
      updated: "5 days ago",
      url: "https://github.com/tokio-rs/axum",
    },
  ],
}

const DEFAULT_TRENDING_TOOLS: ToolTrend[] = [
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for rapid UI development",
    category: "Frontend",
    trending: 35,
    updated: "2 days ago",
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
  {
    name: "Prisma ORM",
    description: "Next-generation ORM for Node.js and TypeScript",
    category: "Backend",
    trending: 42,
    updated: "4 days ago",
    url: "https://github.com/prisma/prisma",
  },
  {
    name: "Rust Web Framework",
    description: "High-performance web framework written in Rust",
    category: "Backend",
    trending: 78,
    updated: "6 days ago",
    url: "https://github.com/tokio-rs/axum",
  },
  {
    name: "SvelteKit",
    description: "Meta-framework for building apps with Svelte",
    category: "Frontend",
    trending: 26,
    updated: "3 days ago",
    url: "https://github.com/sveltejs/kit",
  },
  {
    name: "Supabase",
    description: "Open source backend platform for modern apps",
    category: "Backend",
    trending: 33,
    updated: "2 days ago",
    url: "https://github.com/supabase/supabase",
  },
  {
    name: "Bun",
    description: "Fast JavaScript runtime and tooling stack",
    category: "Runtime",
    trending: 37,
    updated: "4 days ago",
    url: "https://github.com/oven-sh/bun",
  },
]

function normalizeLanguageKey(value: string) {
  return value.trim().toLowerCase()
}

function extractProjectLanguages(project: any): string[] {
  const detected: string[] = []

  if (Array.isArray(project?.languages)) {
    detected.push(...project.languages)
  } else if (typeof project?.languages === "string") {
    detected.push(...project.languages.split(","))
  }

  if (typeof project?.language === "string") {
    detected.push(project.language)
  }

  return detected.map((item) => item.trim()).filter(Boolean)
}

function getInitials(name: string, username: string) {
  const source = (name || username || "").trim()
  if (!source) {
    return "NA"
  }

  const parts = source.split(" ").filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function formatLastActive(lastActivity: string | null) {
  if (!lastActivity) {
    return undefined
  }

  const parsed = new Date(lastActivity)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  const minutes = Math.floor((Date.now() - parsed.getTime()) / 60000)
  if (minutes < 1) {
    return "just now"
  }
  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }

  const days = Math.floor(hours / 24)
  if (days > 30) {
    return "more than 30 days ago"
  }
  return `${days} day${days > 1 ? "s" : ""} ago`
}

function normalizeAvatar(avatar: string | null | undefined) {
  if (!avatar || avatar === "null" || avatar === "undefined") {
    return "/def-avatar.svg"
  }

  if (avatar.includes("placeholder.svg") || avatar.includes("def-avatar.svg")) {
    return "/def-avatar.svg"
  }

  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar
  }

  if (avatar.startsWith("/media/")) {
    return `http://localhost:8000${avatar}`
  }

  return "/def-avatar.svg"
}

function formatActivityTime(dateValue?: string | null) {
  if (!dateValue) {
    return "Recently"
  }

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    return "Recently"
  }

  const minutes = Math.floor((Date.now() - parsed.getTime()) / 60000)
  if (minutes < 1) {
    return "Just now"
  }
  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }

  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

const Dashboard = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const { username } = useParams();
    const loggedInUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    const [usser, setUser] = useState<UserState>({});
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [showAllRecommendations, setShowAllRecommendations] = useState(false)
    const [showAllTrendingTools, setShowAllTrendingTools] = useState(false)

    const languageBasedUpdates = useMemo(() => {
      const languages = new Set<string>()

      projects.forEach((project: any) => {
        const projectLanguages = extractProjectLanguages(project)
        projectLanguages.forEach((language) => languages.add(normalizeLanguageKey(language)))
      })

      const updates = Array.from(languages).flatMap((language) => LANGUAGE_REPO_UPDATES[language] || [])

      const uniqueByRepo = new Map<string, RepoUpdate>()
      updates.forEach((update) => {
        if (!uniqueByRepo.has(update.repo)) {
          uniqueByRepo.set(update.repo, update)
        }
      })

      const items = Array.from(uniqueByRepo.values())
      if (items.length === 0) {
        return DEFAULT_REPO_UPDATES
      }

      return items
    }, [projects])

    const languageBasedTrendingTools = useMemo(() => {
      const languages = new Set<string>()

      projects.forEach((project: any) => {
        const projectLanguages = extractProjectLanguages(project)
        projectLanguages.forEach((language) => languages.add(normalizeLanguageKey(language)))
      })

      const tools = Array.from(languages).flatMap((language) => LANGUAGE_TRENDING_TOOLS[language] || [])

      const uniqueByName = new Map<string, ToolTrend>()
      tools.forEach((tool) => {
        if (!uniqueByName.has(tool.name)) {
          uniqueByName.set(tool.name, tool)
        }
      })

      const items = Array.from(uniqueByName.values())
      if (items.length === 0) {
        return DEFAULT_TRENDING_TOOLS
      }

      return items
    }, [projects])

    const visibleRecommendations = showAllRecommendations
      ? languageBasedUpdates
      : languageBasedUpdates.slice(0, INITIAL_VISIBLE_ITEMS)

    const visibleTrendingTools = showAllTrendingTools
      ? languageBasedTrendingTools
      : languageBasedTrendingTools.slice(0, INITIAL_VISIBLE_ITEMS)

    const hasMoreRecommendations = languageBasedUpdates.length > INITIAL_VISIBLE_ITEMS
    const hasMoreTrendingTools = languageBasedTrendingTools.length > INITIAL_VISIBLE_ITEMS

    const recentActivities = useMemo<ActivityFeedItem[]>(() => {
      const actorName = usser.name || user?.username || "You"
      const actorInitials = getInitials(actorName, user?.username || "")

      const projectActivities = (projects as any[])
        .map((project) => {
          const createdAt = project?.created_at || null
          const updatedAt = project?.updated_at || null
          const hasBeenUpdated = Boolean(updatedAt && createdAt && updatedAt !== createdAt)
          const sourceTime = hasBeenUpdated ? updatedAt : createdAt || updatedAt

          return {
            user: {
              name: actorName,
              initials: actorInitials,
            },
            action: hasBeenUpdated ? "updated" : "created",
            project: project?.name || "Untitled Project",
            time: formatActivityTime(sourceTime),
            sortTime: sourceTime ? new Date(sourceTime).getTime() : 0,
          }
        })
        .sort((a, b) => b.sortTime - a.sortTime)
        .slice(0, 5)
        .map(({ sortTime: _sortTime, ...activity }) => activity)

      if (projectActivities.length > 0) {
        return projectActivities
      }

      return [
        {
          user: {
            name: actorName,
            initials: actorInitials,
          },
          action: "started",
          project: "your workspace",
          time: "Recently",
        },
      ]
    }, [projects, usser.name, user?.username])

    const visibleRecentActivities = recentActivities.slice(0, INITIAL_VISIBLE_ITEMS)

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login");
        }

        if (username && user && user?.username !== username) {
            navigate(`/dashboard/${user.username}`);
        }
      

    }, [isAuthenticated, isLoading, user, username, navigate]);

    if (isLoading || !user || !isAuthenticated) {
        return <div className="text-white">Loading...</div>;
    }

    useEffect(() => {
        fetchUserProfile()
            .then((data) => {
                const avatar = data.avatar;
                
                const isInvalidAvatar =
                    !avatar ||
                    avatar === "null" ||
                    avatar === "undefined" ||
                    (typeof avatar === "string" && avatar.includes("placeholder.svg"));

                // Map backend fields to frontend template
                setUser({
                    name: data.name,
                    username: data.username,
                    avatar: isInvalidAvatar ? "/def-avatar.svg" : avatar,

                });
            })
            .catch((err: any) => console.error(err));
    }, []);

    useEffect(() => {
      fetchProjects()
        .then((data) => {
          setProjects(data);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
        });
    }, []);


  const [tasks, setTasks] = useState<DashboardTask[]>([])
  const { unreadCount, markAllAsRead } = useNotifications()

  useEffect(() => {
    if (user?.username) {
      fetchMyTasks(user.username)
        .then(setTasks)
        .catch((err) => {
          console.error("Error fetching tasks:", err);
          setTasks([]);
        });
    }
  }, [user?.username])

  useEffect(() => {
    if (!user?.username) {
      setTeamMembers([])
      return
    }

    fetchDashboardTeammates()
      .then((result) => {
        if (!result.success) {
          setTeamMembers([])
          return
        }

        const currentUserId = String(user.id || "")
        const localUserId = String(loggedInUser?.id || "")
        const excludedUserIds = new Set([currentUserId, localUserId].filter(Boolean))

        const currentUsername = String(user.username || "").trim().toLowerCase()
        const localUsername = String(loggedInUser?.username || "").trim().toLowerCase()

        const mappedMembers: TeamMember[] = result.teammates
        .filter((member) => {
          const teammateId = String(member.id)
          const teammateUsername = String(member.username || "").trim().toLowerCase()

          if (excludedUserIds.has(teammateId)) {
            return false
          }

          return teammateUsername !== currentUsername && teammateUsername !== localUsername
        })
        .map((member) => ({
          id: String(member.id),
          username: member.username,
          name: member.display_name || member.username,
          role: roleLabels[member.role] || member.role,
          avatar: normalizeAvatar(member.avatar),
          initials: getInitials(member.display_name, member.username),
          status: member.status,
          lastActive: formatLastActive(member.last_activity),
        }))

        setTeamMembers(mappedMembers.slice(0, 5))
      })
      .catch((err) => {
        console.error("Error fetching teammates:", err)
        setTeamMembers([])
      })
  }, [user?.username])

  // Sample tasks data
  // const tasks = [
  //   {
  //     id: "1",
  //     title: "Implement dropdown component",
  //     status: "In Progress",
  //     assignee: {
  //       name: "John Doe",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       initials: "JD",
  //     },
  //     dueDate: "Tomorrow",
  //   },
  //   {
  //     id: "2",
  //     title: "Fix responsive layout issues",
  //     status: "To Do",
  //     assignee: {
  //       name: "Sarah Liu",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       initials: "SL",
  //     },
  //     dueDate: "3 days",
  //   },
  //   {
  //     id: "3",
  //     title: "Update documentation",
  //     status: "Review",
  //     assignee: {
  //       name: "Mike Kim",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       initials: "MK",
  //     },
  //     dueDate: "2 days",
  //   },
  //   {
  //     id: "4",
  //     title: "Add unit tests for API",
  //     status: "Done",
  //     assignee: {
  //       name: "Alex Kim",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       initials: "AK",
  //     },
  //     dueDate: "Yesterday",
  //   },
  // ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link to={getBrandHomePath()} className="flex items-center gap-2">
                <Code className="h-6 w-6 text-emerald-400" />
                <span className="font-bold text-white">DevSync</span>
              </Link>
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-zinc-300">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800">
                  <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <div className="max-h-[300px] overflow-auto">
                    <NotificationItem
                      title="New pull request"
                      description="Alex Kim requested a review on 'Add product search functionality'"
                      time="10 minutes ago"
                      read={false}
                    />
                    <NotificationItem
                      title="Task assigned"
                      description="Sarah Liu assigned you to 'Fix responsive layout issues'"
                      time="1 hour ago"
                      read={false}
                    />
                    <NotificationItem
                      title="Comment on issue #42"
                      description="Mike Kim commented: 'I've found a solution for this'"
                      time="3 hours ago"
                      read={false}
                    />
                    <NotificationItem
                      title="Project invitation"
                      description="You've been invited to collaborate on 'Data Visualization'"
                      time="Yesterday"
                      read={true}
                    />
                    <NotificationItem
                      title="Deployment successful"
                      description="E-commerce Platform was deployed successfully"
                      time="2 days ago"
                      read={true}
                    />
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="justify-center text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 cursor-pointer">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
               </DropdownMenu>
                <Link to={`/${loggedInUser.username}/account/settings`}>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-300">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
               <Link to={`/profile/${loggedInUser.username}`}>
                <Avatar>
                    <AvatarImage src={usser.avatar || "/def-avatar.svg"} alt={usser.name} />
                    <AvatarFallback>{ }</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 ">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-80 space-y-6 max-w-6xl mx-auto px-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="space-y-1">
                  <Link to="/dashboard" className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md text-white">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">My Projects</span>
                  </Link>
                  <Link
                    to="/dashboard/explore"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-sm font-medium">Explore</span>
                  </Link>
                  <Link
                    to="/dashboard/starred"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Starred</span>
                  </Link>
                  <Link
                    to="/dashboard/teams"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Teams</span>
                  </Link>
                  <Link
                    to="/dashboard/activity"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Activity</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <TaskAllocation tasks={tasks} />

            <TeamMemberList members={teamMembers} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-5xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">My Projects</h1>
              <QuickActionsHeader />
            </div>

            <Tabs defaultValue="all" className="text-white">
              <TabsList className="mb-6 bg-zinc-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
                  All Projects
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-zinc-700">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="archived" className="data-[state=active]:bg-zinc-700">
                  Archived
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="archived">
                <div className="text-center py-10">
                  <p className="text-zinc-500">No archived projects</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* AI Assistant Section */}
            {/*
            <div className="mt-10">
              <AIAssistant />
            </div>
            */}

            {/* For You Section */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 flex items-center text-white">
                <Sparkles className="h-5 w-5 mr-2 text-amber-400" /> For You
              </h2>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-white">
                      <Zap className="h-5 w-5 mr-2 text-amber-400" /> Language-Based Repo Updates
                    </CardTitle>
                    <CardDescription className="text-zinc-400">Based on languages used in your projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {visibleRecommendations.map((update, index) => (
                      <RecommendedItem
                        key={index}
                        title={update.framework}
                        description={update.description}
                        icon={<GitBranch className="h-4 w-4" />}
                        stats={`${update.repo} - Updated ${update.updated}`}
                        link={update.url}
                      />
                    ))}
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                      onClick={() => setShowAllRecommendations((prev) => !prev)}
                      disabled={!hasMoreRecommendations}
                    >
                      {!hasMoreRecommendations
                        ? "No More Recommendations"
                        : showAllRecommendations
                          ? "Show Fewer Recommendations"
                          : "View More Recommendations"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-white">
                      <Flame className="h-5 w-5 mr-2 text-orange-400" /> Language-Based Trending Tools
                    </CardTitle>
                    <CardDescription className="text-zinc-400">Tools trending in the languages you actively use</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {visibleTrendingTools.map((tool, index) => (
                      <RecommendedItem
                        key={index}
                        title={tool.name}
                        description={tool.description}
                        icon={<Bookmark className="h-4 w-4" />}
                        stats={`${tool.category} - ${tool.trending}% growth - Updated ${tool.updated}`}
                        link={tool.url}
                      />
                    ))}
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                      onClick={() => setShowAllTrendingTools((prev) => !prev)}
                      disabled={!hasMoreTrendingTools}
                    >
                      {!hasMoreTrendingTools
                        ? "No More Trending Tools"
                        : showAllTrendingTools
                          ? "Show Fewer Trending Tools"
                          : "Explore Trending Tools"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {visibleRecentActivities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 px-4 py-2">
                  <Link to="/dashboard/activity" className="mx-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                    >
                      View All Activity
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Quick Actions */}
      <QuickActions />

      {/* Dev Tools Sidebar */}
      <DevToolsSidebar />
    </div>
  )
}

function ActivityItem({ activity }: { activity: ActivityFeedItem }) {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-zinc-700 text-zinc-300">{activity.user.initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-white">
          <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
          <span className="font-medium">{activity.project}</span>
        </p>
        <p className="text-xs text-zinc-500">{activity.time}</p>
      </div>
    </div>
  )
}

function NotificationItem({ title, description, time, read }: { title: string; description: string; time: string; read: boolean }) {
  return (
    <div className={`px-4 py-3 hover:bg-zinc-800 ${!read ? "bg-zinc-800/50" : ""}`}>
      <div className="flex items-start gap-2">
        {!read && <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
        <div className={`flex-1 ${!read ? "font-medium" : ""}`}>
          <p className="text-sm text-white">{title}</p>
          <p className="text-xs text-zinc-400 mt-1">{description}</p>
          <p className="text-xs text-zinc-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}

function RecommendedItem({ title, description, icon, stats, link }: { title: string; description: string; icon: any; stats: string; link?: string }) {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-zinc-800 rounded-md">
      <div className="mt-0.5 text-zinc-400">{icon}</div>
      <div>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="font-medium text-sm text-white hover:text-emerald-300">
            {title}
          </a>
        ) : (
          <h4 className="font-medium text-sm text-white">{title}</h4>
        )}
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
        <p className="text-xs text-zinc-500 mt-1">{stats}</p>
      </div>
    </div>
  )
}

export default Dashboard;