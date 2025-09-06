"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, Users, Tag, FileText, ArrowRight, Lightbulb, Bug, Zap } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import {AuthGuard} from "../components/auth_guard"
import { toast } from "sonner";
import { createNewIssue } from "../routes/projects" 
import { useParams } from "react-router-dom";

interface FormData {
  title: string
  description: string
  type: string
  priority: string
  assignees: string[]
  labels: string[]
  milestone: string
}

interface IssueTemplate {
  type: string
  title: string
  description: string
  icon: React.ReactNode
  template: string
}

interface TeamMember {
  id: number
  name: string
  username: string
  avatar: string
}

interface IssueLabel {
  name: string
  color: string
}

const NewIssuePage: React.FC = () => {

  const { slug, username } = useParams<{ slug: string; username: string }>(); 

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    id: slug,
    title: "",
    description: "",
    type: "bug",
    priority: "medium",
    assignees: [],
    labels: [],
    milestone: "",
  })
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<IssueTemplate | null>(null)
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  

  const issueTemplates = useMemo<IssueTemplate[]>(
    () => [
      {
        type: "bug",
        title: "Bug Report",
        description: "Report a bug or unexpected behavior",
        icon: <Bug className="h-5 w-5" />,
        template: `**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.`,
      },
      {
        type: "feature",
        title: "Feature Request",
        description: "Suggest a new feature or enhancement",
        icon: <Lightbulb className="h-5 w-5" />,
        template: `**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.`,
      },
      {
        type: "improvement",
        title: "Improvement",
        description: "Suggest an improvement to existing functionality",
        icon: <Zap className="h-5 w-5" />,
        template: `**What would you like to improve?**
A clear description of the current functionality that could be improved.

**How would you improve it?**
Describe your proposed improvement and why it would be beneficial.

**Expected benefits**
What benefits would this improvement provide to users?

**Additional context**
Add any other context, mockups, or examples here.`,
      },
    ],
    [],
  )

  const teamMembers = useMemo<TeamMember[]>(
    () => [
      { id: 1, name: "Alex Johnson", username: "alexj", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 2, name: "Sarah Chen", username: "sarahc", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 3, name: "Michael Rodriguez", username: "michaelr", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 4, name: "Emma Wilson", username: "emmaw", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    [],
  )

  const toggleLabel = (labelName: string) => {
    setFormData((prev) => {
      if (prev.labels.includes(labelName)) {
        // remove if already selected
        return { ...prev, labels: prev.labels.filter((l) => l !== labelName) };
      } else {
        // add if not selected
        return { ...prev, labels: [...prev.labels, labelName] };
      }
    });
  };

  const addCustomLabel = () => {
    if (customLabel.trim() !== "") {
      toggleLabel(customLabel.trim());
      setCustomLabel("");
      setShowCustomInput(false);
    }
  };


  const availableLabels = useMemo<IssueLabel[]>(
    () => [
      { name: "bug", color: "bg-red-500" },
      { name: "enhancement", color: "bg-blue-500" },
      { name: "feature", color: "bg-purple-500" },
      { name: "documentation", color: "bg-green-500" },
      { name: "help wanted", color: "bg-yellow-500" },
      { name: "good first issue", color: "bg-pink-500" },
      { name: "priority: high", color: "bg-red-600" },
      { name: "priority: low", color: "bg-gray-500" },
    ],
    [],
  )

  const milestones = useMemo(() => ["v1.2.1", "v1.3.0", "v1.4.0", "v2.0.0"], [])

  const useTemplate = (template: IssueTemplate) => {
    setSelectedTemplate(template)
    setFormData((prev) => ({
      ...prev,
      type: template.type,
      description: template.template,
    }))
  }

  const TemplateCard: React.FC<{ template: IssueTemplate }> = React.memo(({ template }) => (
    <Card
      className="border-gray-800 bg-gray-900/50 cursor-pointer hover:border-emerald-500/50 transition-colors"
      onClick={() => {
        setSelectedTemplate(template)
        setFormData((prev) => ({
          ...prev,
          type: template.type,
          description: template.template,
        }))
        toast.success("Description Updated")
      }}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto">
          {template.icon}
        </div>
        <h3 className="font-medium">{template.title}</h3>
        <p className="mt-2 text-sm text-gray-400">{template.description}</p>
        <Button className="mt-4 w-full bg-emerald-500 text-black hover:bg-emerald-600">Use Template</Button>
      </CardContent>
    </Card>
  ))

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const response = await createNewIssue(slug,formData);


      if (response.success) {
          navigate(`/dashboard/${username}`);
          toast.success("Issue Created!")
      } else {
          toast(`Failed to create: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
        console.error("Unexpected error:", error);
        toast("Unexpected error occurred. Please try again.");
    } finally {
        setIsCreating(false);
    }

    setTimeout(() => {
      setIsCreating(false)
      
    }, 2000)
  }, [slug, formData, username, navigate])

  return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create a New <span className="text-emerald-500">Issue</span>
          </h1>
          <p className="mt-2 text-gray-400">Report bugs, request features, or suggest improvements.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="bg-gray-900">
                <TabsTrigger value="form">Create Issue</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {issueTemplates.map((template) => (
                    <TemplateCard key={template.type} template={template} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="form" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card className="border-gray-800 bg-gray-900/50">
                    <CardHeader>
                      <CardTitle>Issue Details</CardTitle>
                      <CardDescription>Provide information about the issue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Brief description of the issue"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          className="border-gray-700 bg-gray-800"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide a detailed description of the issue..."
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                          className="border-gray-700 bg-gray-800"
                          rows={8}
                          required
                        />
                        <p className="text-xs text-gray-400">
                          Use Markdown to format your description. Include steps to reproduce, expected behavior, and
                          any relevant context.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="type">Issue Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="border-gray-700 bg-gray-800">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bug">
                                <div className="flex items-center">
                                  <Bug className="mr-2 h-4 w-4" />
                                  Bug Report
                                </div>
                              </SelectItem>
                              <SelectItem value="feature">
                                <div className="flex items-center">
                                  <Lightbulb className="mr-2 h-4 w-4" />
                                  Feature Request
                                </div>
                              </SelectItem>
                              <SelectItem value="improvement">
                                <div className="flex items-center">
                                  <Zap className="mr-2 h-4 w-4" />
                                  Improvement
                                </div>
                              </SelectItem>
                              <SelectItem value="question">
                                <div className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Question
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger className="border-gray-700 bg-gray-800">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="bg-emerald-500 text-black hover:bg-emerald-600"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        "Creating issue..."
                      ) : (
                        <>
                          Create issue <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Link to={`/${username}/project/${slug}`}>
                      <Button variant="outline" className="border-gray-700">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-emerald-500" />
                  Assignees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full border-gray-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Assign to someone
                  </Button>
                  <p className="text-xs text-gray-400">Assign this issue to team members who should work on it.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-emerald-500" />
                  Labels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {availableLabels.slice(0, 4).map((label) => (
                      <Badge
                        key={label.name}
                        variant={formData.labels.includes(label.name) ? "default" : "secondary"}
                        className={`
                          ${label.color} text-white text-xs cursor-pointer hover:opacity-80 
                          border-4 transition-colors duration-200
                          ${formData.labels.includes(label.name) ? "border-emerald-600" : "border-transparent"}
                        `}
                        onClick={() => toggleLabel(label.name)}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>

                  {showCustomInput && (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Enter custom label"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                    <Button
                      size="sm"
                      onClick={addCustomLabel}
                    >
                      Add
                    </Button>
                  </div>
                )}
                  <Button variant="outline" size="sm" className="w-full border-gray-700" onClick={() => setShowCustomInput(!showCustomInput)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add labels
                  </Button>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Labels:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.labels.length > 0 ? (
                        formData.labels.map((label, idx) => (
                          <Badge
                            key={idx}
                            className="bg-emerald-600 text-white text-xs cursor-pointer hover:opacity-80"
                            onClick={() => toggleLabel(label)}
                          >
                            {label} X
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No labels selected</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Labels help categorize and filter issues.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Milestone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Select
                    value={formData.milestone}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, milestone: value }))}
                  >
                    <SelectTrigger className="border-gray-700 bg-gray-800">
                      <SelectValue placeholder="Choose milestone" />
                    </SelectTrigger>
                    <SelectContent>
                      {milestones.map((milestone) => (
                        <SelectItem key={milestone} value={milestone}>
                          {milestone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400">Associate this issue with a project milestone.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-emerald-500" />
                  Issue Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Writing good issues:</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>� Use a clear, descriptive title</li>
                    <li>� Provide detailed steps to reproduce</li>
                    <li>� Include screenshots when helpful</li>
                    <li>� Add relevant labels and assignees</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Markdown support:</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>� **bold text**</li>
                    <li>� *italic text*</li>
                    <li>� \`code snippets\`</li>
                    <li>� - bullet points</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}

export default NewIssuePage
