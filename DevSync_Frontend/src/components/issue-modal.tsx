"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  MessageSquare,
  Tag,
  Calendar,
  User,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Quote,
  Paperclip,
  Send,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"

interface Comment {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    initials: string
  }
  content: string
  timestamp: string
  reactions: {
    thumbsUp: number
    thumbsDown: number
    userReacted?: "up" | "down" | null
  }
  isEdited?: boolean
}

interface Issue {
  id: string
  number: number
  title: string
  description: string
  status: "open" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  labels: string[]
  assignees: Array<{
    name: string
    username: string
    avatar: string
    initials: string
  }>
  author: {
    name: string
    username: string
    avatar: string
    initials: string
  }
  createdAt: string
  updatedAt: string
  comments: Comment[]
  milestone?: string
}

interface IssueModalProps {
  issue: Issue | null
  isOpen: boolean
  onClose: () => void
  onUpdateIssue?: (issue: Issue) => void
  isNewIssue?: boolean
}

export function IssueModal({ issue, isOpen, onClose, onUpdateIssue, isNewIssue = false }: IssueModalProps) {
  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(isNewIssue)
  const [editedTitle, setEditedTitle] = useState(issue?.title || "")
  const [editedDescription, setEditedDescription] = useState(issue?.description || "")
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(issue?.assignees.map((a) => a.username) || [])
  const [selectedLabels, setSelectedLabels] = useState<string[]>(issue?.labels || [])
  const [selectedPriority, setSelectedPriority] = useState(issue?.priority || "medium")

  // Mock data for assignees and labels
  const availableAssignees = [
    { name: "John Doe", username: "johndoe", avatar: "/placeholder.svg", initials: "JD" },
    { name: "Sarah Liu", username: "sarahliu", avatar: "/placeholder.svg", initials: "SL" },
    { name: "Mike Kim", username: "mikekim", avatar: "/placeholder.svg", initials: "MK" },
    { name: "Alex Johnson", username: "alexj", avatar: "/placeholder.svg", initials: "AJ" },
  ]

  const availableLabels = ["bug", "feature", "enhancement", "documentation", "help wanted", "good first issue"]

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        username: "currentuser",
        avatar: "/placeholder.svg",
        initials: "CU",
      },
      content: newComment,
      timestamp: "just now",
      reactions: { thumbsUp: 0, thumbsDown: 0 },
    }

    // In a real app, this would make an API call
    console.log("Adding comment:", comment)
    setNewComment("")
  }

  const handleSaveIssue = () => {
    if (!editedTitle.trim()) return

    const updatedIssue: Issue = {
      id: issue?.id || Date.now().toString(),
      number: issue?.number || Math.floor(Math.random() * 1000),
      title: editedTitle,
      description: editedDescription,
      status: issue?.status || "open",
      priority: selectedPriority as Issue["priority"],
      labels: selectedLabels,
      assignees: availableAssignees.filter((a) => selectedAssignees.includes(a.username)),
      author: issue?.author || {
        name: "Current User",
        username: "currentuser",
        avatar: "/placeholder.svg",
        initials: "CU",
      },
      createdAt: issue?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: issue?.comments || [],
    }

    onUpdateIssue?.(updatedIssue)
    setIsEditing(false)
    if (isNewIssue) {
      onClose()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-500 bg-red-500/10"
      case "high":
        return "text-orange-500 bg-orange-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "low":
        return "text-green-500 bg-green-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!issue && !isNewIssue) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-zinc-900 text-white border-zinc-800">
        <DialogHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Issue title"
                  className="text-xl font-semibold bg-zinc-800 border-zinc-700"
                />
              ) : (
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-emerald-500" />
                  {issue?.title}
                  <Badge variant="outline" className="text-xs">
                    #{issue?.number}
                  </Badge>
                </DialogTitle>
              )}
              {!isEditing && issue && (
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                  <Badge variant={issue.status === "open" ? "default" : "secondary"}>{issue.status}</Badge>
                  <span>opened by @{issue.author.username}</span>
                  <span>•</span>
                  <span>{issue.createdAt}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isNewIssue && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Issue Description */}
            <div className="mb-6">
              {isEditing ? (
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  className="min-h-[120px] bg-zinc-800 border-zinc-700"
                />
              ) : (
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue?.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-zinc-700">{issue?.author.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{issue?.author.name}</span>
                    <span className="text-xs text-zinc-400">{issue?.createdAt}</span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300">{issue?.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            {!isNewIssue && issue?.comments && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({issue.comments.length})
                </h3>

                {issue.comments.map((comment) => (
                  <Card key={comment.id} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs bg-zinc-700">{comment.author.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{comment.author.name}</span>
                            <span className="text-xs text-zinc-400">{comment.timestamp}</span>
                            {comment.isEdited && (
                              <Badge variant="outline" className="text-xs">
                                edited
                              </Badge>
                            )}
                          </div>
                          <p className="text-zinc-300 mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.reactions.thumbsUp}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              {comment.reactions.thumbsDown}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Quote className="h-3 w-3 mr-1" />
                              Quote
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add Comment */}
            {!isNewIssue && (
              <div className="space-y-3">
                <h4 className="font-medium">Add a comment</h4>
                <div className="bg-zinc-800 rounded-lg border border-zinc-700">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="border-0 bg-transparent resize-none"
                    rows={4}
                  />
                  <div className="flex items-center justify-between p-3 border-t border-zinc-700">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4 overflow-y-auto">
            {/* Priority */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Priority
                </h4>
                {isEditing ? (
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-600">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getPriorityColor(issue?.priority || "medium")}>
                    {getPriorityIcon(issue?.priority || "medium")}
                    <span className="ml-1 capitalize">{issue?.priority}</span>
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Assignees */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignees
                </h4>
                {isEditing ? (
                  <div className="space-y-2">
                    {availableAssignees.map((assignee) => (
                      <label key={assignee.username} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAssignees.includes(assignee.username)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAssignees([...selectedAssignees, assignee.username])
                            } else {
                              setSelectedAssignees(selectedAssignees.filter((u) => u !== assignee.username))
                            }
                          }}
                          className="rounded"
                        />
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs bg-zinc-700">{assignee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {issue?.assignees.length ? (
                      issue.assignees.map((assignee) => (
                        <div key={assignee.username} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs bg-zinc-700">{assignee.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{assignee.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-400">No one assigned</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Labels */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Labels
                </h4>
                {isEditing ? (
                  <div className="space-y-2">
                    {availableLabels.map((label) => (
                      <label key={label} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLabels.includes(label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLabels([...selectedLabels, label])
                            } else {
                              setSelectedLabels(selectedLabels.filter((l) => l !== label))
                            }
                          }}
                          className="rounded"
                        />
                        <Badge variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {issue?.labels.length ? (
                      issue.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-400">None yet</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Milestone */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Milestone
                </h4>
                <p className="text-sm text-zinc-400">{issue?.milestone || "No milestone"}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            {isEditing && (
              <div className="space-y-2">
                <Button onClick={handleSaveIssue} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {isNewIssue ? "Create Issue" : "Save Changes"}
                </Button>
                {!isNewIssue && (
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full border-zinc-600">
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
