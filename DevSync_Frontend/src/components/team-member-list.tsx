import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Plus, UserPlus, UserCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { followUser, unfollowUser } from "../routes/profile"

export interface TeamMember {
  id: string
  username: string
  name: string
  role: string
  avatar?: string
  initials: string
  status: "online" | "away" | "offline" | "dnd"
  lastActive?: string
  isFollowing?: boolean
}

interface TeamMemberListProps {
  members: TeamMember[]
  onFollowChange?: (username: string, isFollowing: boolean) => void
}

export function TeamMemberList({ members, onFollowChange }: TeamMemberListProps) {
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(
    new Set(members.filter(m => m.isFollowing).map(m => m.username))
  )
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500"
      case "away":
        return "bg-amber-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-zinc-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "dnd":
        return "Do Not Disturb"
      default:
        return "Offline"
    }
  }

  const handleFollowToggle = async (username: string) => {
    setLoadingUsers(prev => new Set(prev).add(username))
    const isCurrentlyFollowing = followingUsers.has(username)

    try {
      if (isCurrentlyFollowing) {
        const result = await unfollowUser(username)
        if (result.success) {
          setFollowingUsers(prev => {
            const next = new Set(prev)
            next.delete(username)
            return next
          })
          onFollowChange?.(username, false)
        }
      } else {
        const result = await followUser(username)
        if (result.success) {
          setFollowingUsers(prev => new Set(prev).add(username))
          onFollowChange?.(username, true)
        }
      }
    } finally {
      setLoadingUsers(prev => {
        const next = new Set(prev)
        next.delete(username)
        return next
      })
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">Team Members</CardTitle>
          <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
            <Plus className="h-4 w-4 mr-1" /> Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.length === 0 && <p className="text-sm text-zinc-500">No teammates yet.</p>}
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={member.avatar || "/def-avatar.svg"} alt={member.name} />
                  <AvatarFallback className="bg-zinc-700 text-zinc-300">{member.initials}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${getStatusColor(
                    member.status,
                  )}`}
                  title={getStatusText(member.status)}
                ></div>
              </div>
              <div>
                <Link to={`/p/${member.username}`} className="font-medium text-white hover:text-emerald-300 transition-colors">
                  {member.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{member.role}</span>
                  {member.lastActive && (
                    <span className="text-xs text-zinc-500">Last active: {member.lastActive}</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              disabled={loadingUsers.has(member.username)}
              onClick={() => handleFollowToggle(member.username)}
              className={
                followingUsers.has(member.username)
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                  : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
              }
            >
              {followingUsers.has(member.username) ? (
                <UserCheck className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
