"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Calendar } from "../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { User, CalendarIcon, Tag, AlertTriangle, Clock, FileText, X, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { DialogDescription } from "@radix-ui/react-dialog"
import { createTask } from "../routes/projects"
import { toast } from "sonner";
import { useNavigate,useParams } from "react-router-dom"

interface TaskData {
  project:string,
  title: string
  description: string
  assignee: string
  priority: "low" | "medium" | "high" | "critical"
  deadline: Date | undefined
  labels: string[]
  estimatedHours: string
  dependencies: string[]
  attachments: File[]
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (task: TaskData) => void
}

export function CreateTaskModal({ isOpen, onClose, onCreateTask }: CreateTaskModalProps) {
  const navigate = useNavigate();
  const { id, username } = useParams<{ id: string; username: string }>(); 
  

  const [taskData, setTaskData] = useState<TaskData>({
    project:id,
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    deadline: undefined,
    labels: [],
    estimatedHours: "",
    dependencies: [],
    attachments: [],
  })

  const [newLabel, setNewLabel] = useState("")
  const [newDependency, setNewDependency] = useState("")

  // Mock data for team members
  const teamMembers = [
    { name: "John Doe", username: "johndoe", avatar: "/placeholder.svg", initials: "JD", role: "Frontend Developer" },
    { name: "Sarah Liu", username: "sarahliu", avatar: "/placeholder.svg", initials: "SL", role: "Backend Developer" },
    { name: "Mike Kim", username: "mikekim", avatar: "/placeholder.svg", initials: "MK", role: "UI/UX Designer" },
    { name: "Alex Johnson", username: "alexj", avatar: "/placeholder.svg", initials: "AJ", role: "DevOps Engineer" },
    { name: "Emma Wilson", username: "emmaw", avatar: "/placeholder.svg", initials: "EW", role: "QA Engineer" },
  ]

  const predefinedLabels = ["frontend", "backend", "design", "testing", "documentation", "bug-fix", "feature"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskData.title.trim() || !taskData.assignee) {
      return
    }

    onCreateTask(taskData)

    // Reset form
    setTaskData({
      project:id,
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      deadline: undefined,
      labels: [],
      estimatedHours: "",
      dependencies: [],
      attachments: [],
    })

    try {
      const response = await createTask(id,taskData);

      if (response.success) {
          navigate(`/${username}/project/${id}`);
          toast.success("Task Created!")
      } else {
          toast(`Failed to create: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
        console.error("Unexpected error:", error);
        toast("Unexpected error occurred. Please try again.");
    }

    onClose()
  }

  const addLabel = () => {
    if (newLabel.trim() && !taskData.labels.includes(newLabel.trim())) {
      setTaskData((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }))
      setNewLabel("")
    }
  }

  const removeLabel = (label: string) => {
    setTaskData((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== label),
    }))
  }

  const addPredefinedLabel = (label: string) => {
    if (!taskData.labels.includes(label)) {
      setTaskData((prev) => ({
        ...prev,
        labels: [...prev.labels, label],
      }))
    }
  }

  const addDependency = () => {
    if (newDependency.trim() && !taskData.dependencies.includes(newDependency.trim())) {
      setTaskData((prev) => ({
        ...prev,
        dependencies: [...prev.dependencies, newDependency.trim()],
      }))
      setNewDependency("")
    }
  }

  const removeDependency = (dependency: string) => {
    setTaskData((prev) => ({
      ...prev,
      dependencies: prev.dependencies.filter((d) => d !== dependency),
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20"
    }
  }

  const selectedMember = teamMembers.find((member) => member.username === taskData.assignee)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Create New Task
            </DialogTitle>
            {/* <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[65vh] space-y-6 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <DialogTitle className="text-sm font-medium">Task Title *</DialogTitle>
            <Input
              value={taskData.title}
              onChange={(e) => setTaskData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <DialogDescription>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={taskData.description}
              onChange={(e) => setTaskData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task in detail..."
              className="min-h-[100px] bg-zinc-800 border-zinc-700"
            />
            </DialogDescription>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Assign to *
              </label>
              <Select
                value={taskData.assignee}
                onValueChange={(value) => setTaskData((prev) => ({ ...prev, assignee: value }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-600">
                  {teamMembers.map((member) => (
                    <SelectItem key={member.username} value={member.username}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs bg-zinc-700">{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-zinc-400">{member.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMember && (
                <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedMember.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs bg-zinc-700">{selectedMember.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{selectedMember.name}</div>
                    <div className="text-xs text-zinc-400">{selectedMember.role}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Priority
              </label>
              <Select
                value={taskData.priority}
                onValueChange={(value) => setTaskData((prev) => ({ ...prev, priority: value as TaskData["priority"] }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-600">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={getPriorityColor(taskData.priority)}>
                <span className="capitalize">{taskData.priority}</span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Deadline
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {taskData.deadline? taskData.deadline: "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-600" align="start">
                  <Calendar
                    mode="single"
                    selected={taskData.deadline}
                    onSelect={(date) =>
                      setTaskData((prev) => ({
                        ...prev,
                        deadline: date ? format(date, "yyyy-MM-dd") : "",
                      }))
                    }
                    initialFocus
                    className="bg-zinc-900"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Estimated Hours */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estimated Hours
              </label>
              <Input
                type="number"
                value={taskData.estimatedHours}
                onChange={(e) => setTaskData((prev) => ({ ...prev, estimatedHours: e.target.value }))}
                placeholder="e.g., 8"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Labels
            </label>

            {/* Predefined Labels */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-400">Quick add:</div>
              <div className="flex flex-wrap gap-2">
                {predefinedLabels.map((label) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="sm"
                    onClick={() => addPredefinedLabel(label)}
                    disabled={taskData.labels.includes(label)}
                    className="h-6 text-xs border-zinc-600 hover:bg-emerald-600/20"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Label Input */}
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add custom label..."
                className="bg-zinc-800 border-zinc-700"
                onKeyPress={(e) => e.key === "Enter" && addLabel()}
              />
              <Button onClick={addLabel} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Labels */}
            {taskData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taskData.labels.map((label) => (
                  <Badge key={label} variant="outline" className="flex items-center gap-1">
                    {label}
                    <button onClick={() => removeLabel(label)} className="ml-1 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Dependencies */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Dependencies</label>
            <div className="flex gap-2">
              <Input
                value={newDependency}
                onChange={(e) => setNewDependency(e.target.value)}
                placeholder="Task ID or name that must be completed first..."
                className="bg-zinc-800 border-zinc-700"
                onKeyPress={(e) => e.key === "Enter" && addDependency()}
              />
              <Button onClick={addDependency} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {taskData.dependencies.length > 0 && (
              <div className="space-y-2">
                {taskData.dependencies.map((dependency) => (
                  <div key={dependency} className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
                    <span className="text-sm">{dependency}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDependency(dependency)}
                      className="h-6 w-6 p-0 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Summary */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Task Summary</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Title:</strong> {taskData.title || "Not set"}
                </div>
                <div>
                  <strong>Assignee:</strong> {selectedMember?.name || "Not assigned"}
                </div>
                <div>
                  <strong>Priority:</strong> <span className="capitalize">{taskData.priority}</span>
                </div>
                <div>
                  <strong>Deadline:</strong> {taskData.deadline ? format(taskData.deadline, "PPP") : "Not set"}
                </div>
                <div>
                  <strong>Estimated Hours:</strong> {taskData.estimatedHours || "Not set"}
                </div>
                <div>
                  <strong>Labels:</strong> {taskData.labels.length ? taskData.labels.join(", ") : "None"}
                </div>
                <div>
                  <strong>Dependencies:</strong> {taskData.dependencies.length ? taskData.dependencies.length : "None"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={onClose} className="border-zinc-600 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!taskData.title.trim() || !taskData.assignee}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
