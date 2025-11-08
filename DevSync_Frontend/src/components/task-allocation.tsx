import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"

interface Task {
  id: string
  title: string
  status: "In Progress" | "To Do" | "Review" | "Done"
  assign_to: string
  deadline: string
}

interface TaskAllocationProps {
  tasks: Task[]
  sprintName?: string
}

export function TaskAllocation({ tasks, sprintName = "Current sprint tasks" }: TaskAllocationProps) {
  const completedTasks = tasks.filter((task) => task.status === "Done").length
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
          <Progress value={progressPercentage} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Tasks</span>
          <span className="text-sm text-zinc-400">
            {completedTasks}/{totalTasks} completed
          </span>
        </div>

        <div className="space-y-3 mt-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(tasks.map((task) => task.assign_to))).map((name, index) => {
              const assign_to = tasks.find((task) => task.assign_to === name)?.assign_to
              if (!assign_to) return null

              return (
                <div key={index} className="flex items-center gap-1 bg-zinc-800 rounded-full px-2 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={"/placeholder.svg"} alt={assign_to} />
                    <AvatarFallback className="text-xs bg-zinc-700">{assign_to}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{assign_to}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskCard({ task }: { task: Task }) {
  const statusColors = {
    "In Progress": "border-l-emerald-500 bg-emerald-500/10",
    "To Do": "border-l-amber-500 bg-amber-500/10",
    Review: "border-l-purple-500 bg-purple-500/10",
    Done: "border-l-blue-500 bg-blue-500/10",
  }

  const statusTextColors = {
    "In Progress": "text-emerald-500",
    "To Do": "text-amber-500",
    Review: "text-purple-500",
    Done: "text-blue-500",
  }
  if(task.status=="to_do"){
    task.status="To Do"
  }
  else if(task.status=="in_progress"){
    task.status="In Progress"
  }
  else if(task.status=="done"){
    task.status="Done"
  }
  else if(task.status=="review"){
    task.status="Review"
  }

    return (
      <div className={`p-3 rounded-md border-l-4 ${statusColors[task.status]} bg-zinc-800/50`}>
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <Badge variant="outline" className={`${statusTextColors[task.status]} border-none`}>
            {task.status}
          </Badge>
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-400">
          <div>Assigned to: {task.assign_to}</div>
          <div>Due: {task.deadline}</div>
        </div>
      </div>
    )
}
