import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Plus, MessageSquare, Video } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  initials: string
  status: "online" | "away" | "offline" | "dnd"
  lastActive?: string
}

interface TeamMemberListProps {
  members: TeamMember[]
}

export function TeamMemberList({ members }: TeamMemberListProps) {
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
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
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
                <div className="font-medium text-white">{member.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{member.role}</span>
                  {member.status !== "online" && member.lastActive && (
                    <span className="text-xs text-zinc-500">Last active {member.lastActive}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
