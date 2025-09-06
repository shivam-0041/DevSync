"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
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
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
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

export function IssuePage() {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState("")

  // Mock issue data - in a real app, this would be fetched based on issueId
  const issue: Issue = {
    id: issueId || "1",
    number: 42,
    title: "Fix checkout form validation",
    description: `The checkout form is not properly validating credit card information. Users can submit the form with invalid card numbers, which causes errors on the payment processing side.

## Steps to reproduce:
1. Go to checkout page
2. Enter invalid credit card number (e.g., "1234")
3. Click submit
4. Form submits without validation

## Expected behavior:
Form should validate credit card format before submission and show appropriate error messages.

## Additional context:
This affects the user experience and could lead to frustrated customers.`,
    status: "open",
    priority: "high",
    labels: ["bug", "frontend", "urgent"],
    assignees: [
      {
        name: "Sarah Liu",
        username: "sarahliu",
        avatar: "/placeholder.svg",
        initials: "SL",
      },
    ],
    author: {
      name: "Alex Kim",
      username: "alexkim",
      avatar: "/placeholder.svg",
      initials: "AK",
    },
    createdAt: "2 days ago",
    updatedAt: "1 day ago",
    milestone: "v2.1.0",
    comments: [
      {
        id: "1",
        author: {
          name: "John Doe",
          username: "johndoe",
          avatar: "/placeholder.svg",
          initials: "JD",
        },
        content:
          "I can reproduce this issue. It seems like the validation library is not being imported correctly in the checkout component.",
        timestamp: "1 day ago",
        reactions: { thumbsUp: 3, thumbsDown: 0 },
      },
      {
        id: "2",
        author: {
          name: "Sarah Liu",
          username: "sarahliu",
          avatar: "/placeholder.svg",
          initials: "SL",
        },
        content:
          "Thanks for reporting this! I'll take a look at the validation logic. We should also add some unit tests to prevent this from happening again.",
        timestamp: "1 day ago",
        reactions: { thumbsUp: 2, thumbsDown: 0 },
      },
      {
        id: "3",
        author: {
          name: "Mike Kim",
          username: "mikekim",
          avatar: "/placeholder.svg",
          initials: "MK",
        },
        content:
          "I can help with the UI side of the validation messages. Should we follow the same pattern as the login form?",
        timestamp: "12 hours ago",
        reactions: { thumbsUp: 1, thumbsDown: 0 },
      },
    ],
  }

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-emerald-500" />
              <h1 className="text-xl font-semibold">{issue.title}</h1>
              <Badge variant="outline" className="text-xs">
                #{issue.number}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
            <Badge variant={issue.status === "open" ? "default" : "secondary"}>{issue.status}</Badge>
            <span>opened by @{issue.author.username}</span>
            <span>•</span>
            <span>{issue.createdAt}</span>
            <span>•</span>
            <span>{issue.comments.length} comments</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Issue Description */}
            <div className="mb-8">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={issue.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-zinc-700">{issue.author.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{issue.author.name}</div>
                      <div className="text-xs text-zinc-400">{issue.createdAt}</div>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-zinc-300">{issue.description}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comments */}
            <div className="space-y-6 mb-8">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({issue.comments.length})
              </h3>

              {issue.comments.map((comment) => (
                <Card key={comment.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs bg-zinc-700">{comment.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-xs text-zinc-400">{comment.timestamp}</span>
                          {comment.isEdited && (
                            <Badge variant="outline" className="text-xs">
                              edited
                            </Badge>
                          )}
                        </div>
                        <div className="text-zinc-300 mb-4 whitespace-pre-wrap">{comment.content}</div>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.reactions.thumbsUp}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            {comment.reactions.thumbsDown}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <Quote className="h-3 w-3 mr-1" />
                            Quote
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Comment */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h4 className="font-medium mb-4">Add a comment</h4>
                <div className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="min-h-[120px] bg-zinc-800 border-zinc-700"
                  />
                  <div className="flex items-center justify-between">
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Priority */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Priority
                </h4>
                <Badge className={getPriorityColor(issue.priority)}>
                  {getPriorityIcon(issue.priority)}
                  <span className="ml-1 capitalize">{issue.priority}</span>
                </Badge>
              </CardContent>
            </Card>

            {/* Assignees */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignees
                </h4>
                <div className="space-y-2">
                  {issue.assignees.length ? (
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
              </CardContent>
            </Card>

            {/* Labels */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Labels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {issue.labels.length ? (
                    issue.labels.map((label) => (
                      <Badge key={label} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">None yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestone */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Milestone
                </h4>
                <p className="text-sm text-zinc-400">{issue.milestone || "No milestone"}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Issue
              </Button>
              <Button variant="outline" className="w-full border-zinc-600 bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Close Issue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
