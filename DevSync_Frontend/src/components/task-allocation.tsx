import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"

export interface DashboardTask {
  task_id: string
  title: string
  status: "to_do" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "critical"
  project_name: string
  dueDate: string
  assignee: {
    name: string
    avatar: string | null
    initials: string
  }
}

interface TaskAllocationProps {
  tasks: DashboardTask[]
  sprintName?: string
}

export function TaskAllocation({ tasks, sprintName = "Current sprint tasks" }: TaskAllocationProps) {
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const totalTasks = tasks.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100) || 0

  return (
    <Card className="bg-zinc-900 text-white border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Task Allocation</CardTitle>
        <p className="text-zinc-400 text-sm">{sprintName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-zinc-400">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-zinc-800" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Tasks</span>
          <span className="text-sm text-zinc-400">
            {completedTasks}/{totalTasks} completed
          </span>
        </div>

        <div className="space-y-3 mt-2">
          {tasks.map((task) => (
            <TaskCard key={task.task_id} task={task} />
          ))}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(tasks.map((t) => t.assignee?.name).filter((n): n is string => !!n))).map((name) => {
              const assignee = tasks.find((t) => t.assignee?.name === name)?.assignee
              if (!assignee) return null

              return (
                <div key={name} className="flex items-center gap-1 bg-zinc-800 rounded-full px-2 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatar ?? "/placeholder.svg"} alt={name} />
                    <AvatarFallback className="text-xs bg-zinc-700">{assignee.initials ?? name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskCard({ task }: { task: DashboardTask }) {
  const statusColors: Record<string, string> = {
    "to_do": "border-l-amber-500 bg-amber-500/10",
    "in_progress": "border-l-emerald-500 bg-emerald-500/10",
    "review": "border-l-purple-500 bg-purple-500/10",
    "done": "border-l-blue-500 bg-blue-500/10",
  }

  const statusTextColors: Record<string, string> = {
    "to_do": "text-amber-500",
    "in_progress": "text-emerald-500",
    "review": "text-purple-500",
    "done": "text-blue-500",
  }

  const statusLabels: Record<string, string> = {
    "to_do": "To Do",
    "in_progress": "In Progress",
    "review": "Review",
    "done": "Done",
  }

  return (
    <div className={`p-3 rounded-md border-l-4 ${statusColors[task.status]} bg-zinc-800/50`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm">{task.title}</h3>
        <Badge variant="outline" className={`${statusTextColors[task.status]} border-none`}>
          {statusLabels[task.status]}
        </Badge>
      </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-400">
          <div>Assigned to: {task.assignee?.name ?? "Unassigned"}</div>
          <div>Due: {task.dueDate ?? "—"}</div>
        </div>
    </div>
  )
}
