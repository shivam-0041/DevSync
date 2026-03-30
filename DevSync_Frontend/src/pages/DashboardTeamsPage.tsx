import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { TeamMemberList, type TeamMember } from "../components/team-member-list"
import { fetchDashboardTeammates } from "../routes/projects"
import { useAuth } from "../components/contexts/auth-context"

const roleLabels: Record<string, string> = {
  admin: "Admin",
  maintainer: "Maintainer",
  developer: "Developer",
  guest: "Guest",
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

export default function DashboardTeamsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate, user])

  useEffect(() => {
    if (!user?.username) {
      setTeamMembers([])
      return
    }

    const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {}

    fetchDashboardTeammates()
      .then((result) => {
        if (!result.success) {
          setTeamMembers([])
          return
        }

        const currentUserId = String(user.id || "")
        const localUserId = String(localUser?.id || "")
        const excludedUserIds = new Set([currentUserId, localUserId].filter(Boolean))

        const currentUsername = String(user.username || "").trim().toLowerCase()
        const localUsername = String(localUser?.username || "").trim().toLowerCase()

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

        setTeamMembers(mappedMembers)
      })
      .catch(() => {
        setTeamMembers([])
      })
  }, [user?.id, user?.username])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" /> Teams
            </h1>
            <p className="text-zinc-400 text-sm mt-1">All collaborators across your DevSync projects</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <TeamMemberList members={teamMembers} />
      </div>
    </div>
  )
}
