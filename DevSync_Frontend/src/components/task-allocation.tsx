import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"

export interface DashboardTask {
  id?: string | number
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
  } | null
}

interface TaskAllocationProps {
  tasks: DashboardTask[]
  sprintName?: string
  onUpdateStatus?: (taskId: string | number, newStatus: "to_do" | "in_progress" | "review" | "done") => void
  currentUserRole?: string
}

export function TaskAllocation({ tasks = [], sprintName = "Current sprint tasks", onUpdateStatus, currentUserRole }: TaskAllocationProps) {
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  // Map tasks to normalize differing backend/frontend data models
  const mappedTasks = safeTasks.map((t: any) => {
    const id = t.id || t.task_id;
    const task_id = t.task_id || String(t.id || "");
    const title = t.title || "";
    const status = t.status || "to_do";
    const priority = t.priority || "medium";
    const project_name = t.project_name || "";
    const dueDate = t.dueDate || t.deadline || "—";
    
    let assignee = t.assignee;
    if (!assignee && t.assign_to) {
      assignee = {
        name: t.assign_to,
        avatar: null,
        initials: t.assign_to.slice(0, 2).toUpperCase()
      };
    }
    
    return {
      id,
      task_id,
      title,
      status,
      priority,
      project_name,
      dueDate,
      assignee
    } as DashboardTask;
  });

  const completedTasks = mappedTasks.filter((task) => task.status === "done").length
  const totalTasks = mappedTasks.length
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
          {mappedTasks.map((task) => (
            <TaskCard key={task.task_id} task={task} onUpdateStatus={onUpdateStatus} currentUserRole={currentUserRole} />
          ))}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(mappedTasks.map((t) => t.assignee?.name).filter((n): n is string => !!n))).map((name) => {
              const assignee = mappedTasks.find((t) => t.assignee?.name === name)?.assignee
              if (!assignee) return null

              return (
                <div key={name} className="flex items-center gap-1 bg-zinc-800 rounded-full px-2 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatar ?? "/def-avatar.svg"} alt={name} />
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

function TaskCard({ task, onUpdateStatus, currentUserRole }: { task: DashboardTask; onUpdateStatus?: (taskId: string | number, newStatus: "to_do" | "in_progress" | "review" | "done") => void; currentUserRole?: string }) {
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

  const loggedInUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const isAssignedToMe = task.assignee?.name === loggedInUser.username;
  const isAdmin = currentUserRole === "admin";

  const showStartProgress = isAssignedToMe && task.status === "to_do";
  const showMarkAsDoneForAssignee = isAssignedToMe && task.status === "in_progress";
  const showMarkAsDoneForAdmin = isAdmin && task.status === "review";

  return (
    <div className={`p-3 rounded-md border-l-4 ${statusColors[task.status]} bg-zinc-800/50 flex flex-col gap-2`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm">{task.title}</h3>
        <Badge variant="outline" className={`${statusTextColors[task.status]} border-none p-0`}>
          {statusLabels[task.status]}
        </Badge>
      </div>
      <div className="flex justify-between mt-1 text-xs text-zinc-400">
        <div>Assigned to: {task.assignee?.name ?? "Unassigned"}</div>
        <div>Due: {task.dueDate ?? "—"}</div>
      </div>
      
      {onUpdateStatus && (showStartProgress || showMarkAsDoneForAssignee || showMarkAsDoneForAdmin) && (
        <div className="mt-2 pt-2 border-t border-zinc-800/50 flex justify-end">
          {showStartProgress && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 py-1 px-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all duration-200 rounded-md"
              onClick={() => onUpdateStatus(task.id || task.task_id, "in_progress")}
            >
              Start Progress
            </Button>
          )}
          {showMarkAsDoneForAssignee && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 py-1 px-3 border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 rounded-md"
              onClick={() => onUpdateStatus(task.id || task.task_id, "review")}
            >
              Mark as Done
            </Button>
          )}
          {showMarkAsDoneForAdmin && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 py-1 px-3 border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200 rounded-md"
              onClick={() => onUpdateStatus(task.id || task.task_id, "done")}
            >
              Mark as Done
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
