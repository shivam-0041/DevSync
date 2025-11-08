"use client"

import React,{ useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Code,
  Settings,
  Users,
  Shield,
  GitBranch,
  Webhook,
  AlertTriangle,
  Globe,
  Lock,
  Trash2,
  Save,
  X,
  Plus,
  Edit,
  Key,
  Database,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { fetchProjectData } from "../routes/projects"
import { useParams } from "react-router-dom";

export default function ProjectSettings() {

    const [loading, setLoading] = useState(true);
    const { username, slug } = useParams<{ username: string; slug: string  }>();

    const [project, setProject] = useState<any>({
        project_id: "",      
        name: "",
        description: "",
        visibility: "private",            
        contributors: [],    
        tasks: [],      
        slug: "",           
        logo: "",           
        readme: "",
        status: "active", 
    });
    useEffect( () => {
            if (slug) {
                setLoading(true);
                fetchProjectData(slug)
                .then((data) => {
                    console.log(data);
                    setProject(data);
                })
                .catch((err) => {
                    console.error("Error fetching project data:", err);
                }).finally(()=> setLoading(false));
            }
        }, [slug]);

    const [activeTab, setActiveTab] = useState("general")
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setProject((prev: any) => ({ ...prev, [name]: value }));
    };
    
    const handleVisibility = (checked: boolean) => {
        setProject(prev => ({
            ...prev,
            visibility: checked ? "public" : "private"
        }));
    };
    
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
    const [errors, setErrors] = useState<FormErrors>({})


    const handleSave = () => {
        e.preventDefault();
        setSaveStatus("saving");

       

        if (result?.success) {
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
            setSaveStatus("idle");
            
        }
    }

    const sidebarItems = [
        { id: "general", label: "General", icon: Settings },
        { id: "access", label: "Access", icon: Users },
        { id: "branches", label: "Branches", icon: GitBranch },
        { id: "security", label: "Security", icon: Shield },
        { id: "integrations", label: "Integrations", icon: Database },
        { id: "webhooks", label: "Webhooks", icon: Webhook },
        { id: "danger", label: "Danger Zone", icon: AlertTriangle },
    ]

    const VisibilityOption: React.FC<{
        type: "public" | "private"
        icon: React.ReactNode
        title: string
        description: string
    }> = React.memo(({ type, icon, title, description }) => (
        <div
            className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${project.visibility === type ? "border-emerald-500 bg-emerald-500/5" : "border-gray-700 hover:border-gray-600"
                }`}
            onClick={() => handleVisibilityChange(type)}
        >
            <input
                type="radio"
                name="visibility"
                value={type}
                checked={project.visibility === type}
                onChange={() => handleVisibilityChange(type)}
                className="mt-1"
            />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    {icon}
                    <span className="font-medium">{title}</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
        </div>
    ))

    const handleInputChange = useCallback(
        (field: keyof FormData, value: string | boolean) => {
            setProject((prev) => ({ ...prev, [field]: value }))
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: null }))
            }
        },
        [errors],
    )

    const handleVisibilityChange = useCallback(
        (visibility: "public" | "private") => {
            handleInputChange("visibility", visibility)
        },
        [handleInputChange],
    )

        

    // const webhooks = [
    //     {
    //     id: 1,
    //     url: "https://api.example.com/webhook",
    //     events: ["push", "pull_request"],
    //     active: true,
    //     lastDelivery: "2 hours ago",
    //     },
    //     {
    //     id: 2,
    //     url: "https://discord.com/api/webhooks/123456789",
    //     events: ["issues", "pull_request"],
    //     active: false,
    //     lastDelivery: "1 week ago",
    //     },
    // ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to={`/dashboard/${username}`} className="flex items-center gap-2">
                <Code className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">DevSync</span>
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <Link to={`/dashboard/${username}`} className="text-zinc-400 hover:text-white">
                  Dashboard
                </Link>
                <span className="text-zinc-600">/</span>
                <Link to={`${username}/project/${slug}`} className="text-zinc-400 hover:text-white">
                  {project.name}
                </Link>
                <span className="text-zinc-600">/</span>
                <span className="text-white">Settings</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saveStatus === "idle" && <Save className="h-3 w-3 mr-1" />}
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Saved"}
                {saveStatus === "idle" && "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === item.id
                        ? "bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-600"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {activeTab === "general" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-white">General Settings</h1>
                  <p className="text-sm text-zinc-400">Manage your project's basic information</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Project Information</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Update your project's name and description
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name" className="text-zinc-300 text-sm">
                        Project Name
                      </Label>
                      <Input
                        id="project-name"
                        value={project.name}
                        onChange={handleChange}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description" className="text-zinc-300 text-sm">
                        Description
                      </Label>
                      <Textarea
                        id="project-description"
                        value={project.description}
                        onChange={handleChange}
                        className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Visibility</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Control who can see this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label>Visibility</Label>
                        <div className="space-y-3">
                            <VisibilityOption
                                type="public"
                                icon={<Globe className="h-5 w-5 text-emerald-500" />}
                                title="Public"
                                description="Anyone on the internet can see this repository. You choose who can commit."
                            />
                            <VisibilityOption
                                type="private"
                                icon={<Lock className="h-5 w-5 text-emerald-500" />}
                                title="Private"
                                description="You choose who can see and commit to this repository."
                            />
                        </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Project Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Issues</p>
                        <p className="text-zinc-400 text-xs">Enable issue tracking</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator className="bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Pull Requests</p>
                        <p className="text-zinc-400 text-xs">Enable pull request reviews</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator className="bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Discussions</p>
                        <p className="text-zinc-400 text-xs">Enable community discussions</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "access" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white">Access Management</h1>
                    <p className="text-sm text-zinc-400">Manage who has access to this project</p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Collaborator
                  </Button>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Collaborators</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      People with access to this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.contributors.map((contributors, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={contributors.avatar || "/placeholder.svg"} alt={contributors.name} />
                              <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">
                                {contributors.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white text-sm font-medium">{contributors.name}</p>
                              <p className="text-zinc-400 text-xs">@{contributors.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select defaultValue={contributors.role.toLowerCase()}>
                              <SelectTrigger className="w-24 h-8 bg-zinc-800 border-zinc-700 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="write">Write</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                              </SelectContent>
                            </Select>
                            {contributors.role !== "Owner" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Invite Collaborator</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">Add new people to this project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input placeholder="Enter username or email" className="bg-zinc-800 border-zinc-700 text-white" />
                      <Select defaultValue="write">
                        <SelectTrigger className="w-24 bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Invite
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "branches" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Branch Protection</h1>
                  <p className="text-sm text-zinc-400">Configure branch protection rules</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Branches</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">Manage your repository branches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {branches.map((branch, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <GitBranch className="h-4 w-4 text-zinc-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-medium">{branch.name}</span>
                                {branch.isDefault && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0">
                                    Default
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {branch.isProtected ? (
                              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 text-xs">
                                Protected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Unprotected
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Protection Rules</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Configure protection for the main branch
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Require pull request reviews</p>
                        <p className="text-zinc-400 text-xs">Require at least one review before merging</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator className="bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Require status checks</p>
                        <p className="text-zinc-400 text-xs">Require CI/CD checks to pass</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator className="bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Restrict pushes</p>
                        <p className="text-zinc-400 text-xs">Only allow specific people to push</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Security Settings</h1>
                  <p className="text-sm text-zinc-400">Configure security and access controls</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Security Alerts</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Get notified about security vulnerabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Dependency alerts</p>
                        <p className="text-zinc-400 text-xs">Get alerts for vulnerable dependencies</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator className="bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Secret scanning</p>
                        <p className="text-zinc-400 text-xs">Scan for accidentally committed secrets</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Access Tokens</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Manage API access tokens for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <Key className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="text-white text-sm">Development Token</p>
                          <p className="text-zinc-400 text-xs">Created 30 days ago • Expires in 60 days</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 h-8">
                        Revoke
                      </Button>
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-3 w-3 mr-1" />
                      Generate New Token
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Integrations</h1>
                  <p className="text-sm text-zinc-400">Connect external services to your project</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">CI/CD</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Continuous integration and deployment services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-emerald-600 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-bold">GH</span>
                        </div>
                        <div>
                          <p className="text-white text-sm">GitHub Actions</p>
                          <p className="text-zinc-400 text-xs">Connected • Last run: 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 h-8 bg-transparent">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-bold">V</span>
                        </div>
                        <div>
                          <p className="text-white text-sm">Vercel</p>
                          <p className="text-zinc-400 text-xs">Not connected</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Communication</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Team communication and notification services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <div>
                          <p className="text-white text-sm">Slack</p>
                          <p className="text-zinc-400 text-xs">Connected to #dev-team</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 h-8 bg-transparent">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "webhooks" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white">Webhooks</h1>
                    <p className="text-sm text-zinc-400">Manage webhook endpoints for this project</p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Webhook
                  </Button>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Active Webhooks</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Webhooks configured for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {webhooks.map((webhook) => (
                        <div key={webhook.id} className="p-3 bg-zinc-800 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Webhook className="h-4 w-4 text-zinc-400" />
                              <span className="text-white text-sm font-medium">{webhook.url}</span>
                              {webhook.active ? (
                                <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 text-xs">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:text-red-300">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-zinc-400">
                            <span>Events: {webhook.events.join(", ")}</span>
                            <span>Last delivery: {webhook.lastDelivery}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Danger Zone</h1>
                  <p className="text-sm text-zinc-400">Irreversible and destructive actions</p>
                </div>

                <Card className="bg-red-950/20 border-red-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-400 text-base">Transfer Project</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Transfer this project to another user or organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input placeholder="Enter new owner username" className="bg-zinc-800 border-zinc-700 text-white" />
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-950/30 bg-transparent"
                    >
                      Transfer Project
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-red-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-400 text-base">Archive Project</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Archive this project to make it read-only
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-950/30 bg-transparent"
                    >
                      Archive Project
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-red-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-400 text-base">Delete Project</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Permanently delete this project and all of its data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-md">
                      <p className="text-red-300 text-sm font-medium mb-1">This action cannot be undone!</p>
                      <p className="text-red-400 text-xs">
                        This will permanently delete the project, all files, issues, and collaborator access.
                      </p>
                    </div>
                    <Input
                      placeholder="Type 'E-commerce Platform' to confirm"
                      className="bg-zinc-800 border-red-700 text-white"
                    />
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
