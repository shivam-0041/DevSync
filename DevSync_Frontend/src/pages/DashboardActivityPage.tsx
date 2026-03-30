import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Activity, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { fetchProjects } from "../routes/projects"
import { useAuth } from "../components/contexts/auth-context"

type ActivityFeedItem = {
  user: {
    name: string
    initials: string
  }
  action: string
  project: string
  time: string
}

function getInitials(name: string) {
  const source = (name || "").trim()
  if (!source) {
    return "NA"
  }

  const parts = source.split(" ").filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
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

function ActivityItem({ activity }: { activity: ActivityFeedItem }) {
  return (
    <div className="flex gap-4 p-3 rounded-md hover:bg-zinc-800/70">
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

export default function DashboardActivityPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate, user])

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
  }, [])

  const recentActivities = useMemo<ActivityFeedItem[]>(() => {
    const actorName = user?.username || "You"
    const actorInitials = getInitials(actorName)

    const projectActivities = projects
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
  }, [projects, user?.username])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> Recent Activity
            </h1>
            <p className="text-zinc-400 text-sm mt-1">All recent activity from your projects</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={`${activity.project}-${index}`} activity={activity} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
