"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { FormControl, FormDescription, FormItem, FormLabel } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Badge } from "../components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Shield, GitBranch, Webhook, Trash2, Save, Globe, Lock, Plus, X, Tag } from "lucide-react"
import { useParams } from "react-router-dom"

const ProjectSettings = () => {
    const { id } = useParams()
    const [isPublic, setIsPublic] = useState(true)
    const [projectName, setProjectName] = useState("CodeCollab Platform")
    const [projectDescription, setProjectDescription] = useState(
        "A collaborative platform for developers to work together on code projects.",
    )
    const [branches, setBranches] = useState(["main", "develop", "feature/auth"])
    const [defaultBranch, setDefaultBranch] = useState("main")
    const [webhooks, setWebhooks] = useState([
        {
            id: 1,
            name: "Slack Notifications",
            url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
            events: ["push", "pull_request"],
        },
        { id: 2, name: "CI Pipeline", url: "https://ci.example.com/webhook", events: ["push"] },
    ])
    const [protectedBranches, setProtectedBranches] = useState([
        { branch: "main", requireApproval: true, requireTests: true, allowForcePush: false },
        { branch: "develop", requireApproval: true, requireTests: false, allowForcePush: false },
    ])
    const [newWebhookName, setNewWebhookName] = useState("")
    const [newWebhookUrl, setNewWebhookUrl] = useState("")
    const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([])
    const [tags, setTags] = useState(["v1.0.0", "v1.1.0", "v2.0.0-beta"])
    const [newTag, setNewTag] = useState("")

    const handleAddWebhook = () => {
        if (newWebhookName && newWebhookUrl && newWebhookEvents.length > 0) {
            setWebhooks([
                ...webhooks,
                {
                    id: webhooks.length + 1,
                    name: newWebhookName,
                    url: newWebhookUrl,
                    events: newWebhookEvents,
                },
            ])
            setNewWebhookName("")
            setNewWebhookUrl("")
            setNewWebhookEvents([])
        }
    }

    const handleRemoveWebhook = (id: number) => {
        setWebhooks(webhooks.filter((webhook) => webhook.id !== id))
    }

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag])
            setNewTag("")
        }
    }

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag))
    }

    const toggleWebhookEvent = (event: string) => {
        if (newWebhookEvents.includes(event)) {
            setNewWebhookEvents(newWebhookEvents.filter((e) => e !== event))
        } else {
            setNewWebhookEvents([...newWebhookEvents, event])
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
                    <p className="text-muted-foreground">Configure settings for project: {projectName}</p>
                </div>
                <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="repository">Repository</TabsTrigger>
                    <TabsTrigger value="branches">Branches & Tags</TabsTrigger>
                    <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                    <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                            <CardDescription>Basic information about your project</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            placeholder="Project name"
                                        />
                                    </FormControl>
                                    <FormDescription>This is your project's display name.</FormDescription>
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            value={projectDescription}
                                            onChange={(e) => setProjectDescription(e.target.value)}
                                            placeholder="Project description"
                                            className="min-h-[100px]"
                                        />
                                    </FormControl>
                                    <FormDescription>Describe what your project does.</FormDescription>
                                </FormItem>

                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Project Visibility</FormLabel>
                                        <FormDescription>
                                            {isPublic ? (
                                                <div className="flex items-center">
                                                    <Globe className="mr-2 h-4 w-4 text-emerald-500" />
                                                    Public - Anyone can see this project
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Lock className="mr-2 h-4 w-4 text-amber-500" />
                                                    Private - Only collaborators can see this project
                                                </div>
                                            )}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                                    </FormControl>
                                </FormItem>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Project Topics</CardTitle>
                            <CardDescription>Add topics to help others discover your project</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/30">
                                    react
                                    <button className="ml-1 hover:text-emerald-300">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                                <Badge variant="outline" className="bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/30">
                                    typescript
                                    <button className="ml-1 hover:text-emerald-300">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                                <Badge variant="outline" className="bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/30">
                                    collaboration
                                    <button className="ml-1 hover:text-emerald-300">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                                <Badge variant="outline" className="bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/30">
                                    code-review
                                    <button className="ml-1 hover:text-emerald-300">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                <Input placeholder="Add a topic" className="max-w-sm" />
                                <Button variant="outline" size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="repository" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Repository Settings</CardTitle>
                            <CardDescription>Configure how your repository behaves</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Merge Button</FormLabel>
                                    <FormDescription>Allow merge commits</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch defaultChecked />
                                </FormControl>
                            </FormItem>

                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Squash Merging</FormLabel>
                                    <FormDescription>Allow squash merging</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch defaultChecked />
                                </FormControl>
                            </FormItem>

                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Rebase Merging</FormLabel>
                                    <FormDescription>Allow rebase merging</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch defaultChecked />
                                </FormControl>
                            </FormItem>

                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Automatically Delete Head Branches</FormLabel>
                                    <FormDescription>Automatically delete head branches after pull requests are merged</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch defaultChecked />
                                </FormControl>
                            </FormItem>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Files & Paths</CardTitle>
                            <CardDescription>Configure special files and paths</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormItem>
                                <FormLabel>README Template</FormLabel>
                                <FormControl>
                                    <Select defaultValue="default">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a README template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default Template</SelectItem>
                                            <SelectItem value="minimal">Minimal</SelectItem>
                                            <SelectItem value="detailed">Detailed</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>License</FormLabel>
                                <FormControl>
                                    <Select defaultValue="mit">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a license" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mit">MIT License</SelectItem>
                                            <SelectItem value="apache">Apache License 2.0</SelectItem>
                                            <SelectItem value="gpl">GNU GPL v3</SelectItem>
                                            <SelectItem value="bsd">BSD 3-Clause</SelectItem>
                                            <SelectItem value="none">No License</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Issue Templates</FormLabel>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="bug-template" defaultChecked />
                                        <label
                                            htmlFor="bug-template"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Bug Report Template
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="feature-template" defaultChecked />
                                        <label
                                            htmlFor="feature-template"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Feature Request Template
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="custom-template" />
                                        <label
                                            htmlFor="custom-template"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Custom Template
                                        </label>
                                    </div>
                                </div>
                            </FormItem>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="branches" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branch Settings</CardTitle>
                            <CardDescription>Configure branch settings and protection rules</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormItem>
                                <FormLabel>Default Branch</FormLabel>
                                <FormControl>
                                    <Select value={defaultBranch} onValueChange={setDefaultBranch}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select default branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch} value={branch}>
                                                    {branch}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>The default branch is used for new pull requests and code browsing</FormDescription>
                            </FormItem>

                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Branches</h3>
                                <div className="rounded-md border">
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            {branches.map((branch) => (
                                                <div
                                                    key={branch}
                                                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                                                >
                                                    <div className="flex items-center">
                                                        <GitBranch className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <span>{branch}</span>
                                                        {branch === defaultBranch && (
                                                            <Badge variant="outline" className="ml-2 bg-emerald-950/20 text-emerald-400">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Shield className="h-4 w-4 mr-1" />
                                                            Protect
                                                        </Button>
                                                        {branch !== defaultBranch && (
                                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Protected Branches</h3>
                                    <Button variant="outline" size="sm">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Add Protection Rule
                                    </Button>
                                </div>
                                <div className="rounded-md border">
                                    <div className="p-4">
                                        <div className="space-y-4">
                                            {protectedBranches.map((protection, index) => (
                                                <div key={index} className="p-4 rounded-md border">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center">
                                                            <Shield className="mr-2 h-5 w-5 text-emerald-500" />
                                                            <span className="font-medium">{protection.branch}</span>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Switch id={`require-approval-${index}`} checked={protection.requireApproval} />
                                                            <label htmlFor={`require-approval-${index}`} className="text-sm font-medium leading-none">
                                                                Require pull request reviews before merging
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Switch id={`require-tests-${index}`} checked={protection.requireTests} />
                                                            <label htmlFor={`require-tests-${index}`} className="text-sm font-medium leading-none">
                                                                Require status checks to pass before merging
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Switch id={`allow-force-${index}`} checked={protection.allowForcePush} />
                                                            <label htmlFor={`allow-force-${index}`} className="text-sm font-medium leading-none">
                                                                Allow force pushes
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Tag className="mr-2 h-5 w-5" />
                                Tags
                            </CardTitle>
                            <CardDescription>Manage release tags for your project</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="New tag (e.g., v1.0.0)"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    className="max-w-sm"
                                />
                                <Button variant="outline" onClick={handleAddTag}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Tag
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {tags.map((tag) => (
                                    <div key={tag} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                        <div className="flex items-center">
                                            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{tag}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="webhooks" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Webhooks</CardTitle>
                            <CardDescription>
                                Configure webhooks to notify external services about events in your repository
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                {webhooks.map((webhook) => (
                                    <div key={webhook.id} className="p-4 rounded-md border">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <Webhook className="mr-2 h-5 w-5 text-emerald-500" />
                                                <span className="font-medium">{webhook.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveWebhook(webhook.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="text-sm text-muted-foreground mb-2">URL: {webhook.url}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {webhook.events.map((event) => (
                                                <Badge key={event} variant="outline" className="bg-emerald-950/20 text-emerald-400">
                                                    {event}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border rounded-md p-4">
                                <h3 className="text-lg font-medium mb-4">Add New Webhook</h3>
                                <div className="space-y-4">
                                    <FormItem>
                                        <FormLabel>Webhook Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Slack Notifications"
                                                value={newWebhookName}
                                                onChange={(e) => setNewWebhookName(e.target.value)}
                                            />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Payload URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/webhook"
                                                value={newWebhookUrl}
                                                onChange={(e) => setNewWebhookUrl(e.target.value)}
                                            />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Events</FormLabel>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["push", "pull_request", "issues", "release", "deployment"].map((event) => (
                                                <div key={event} className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`event-${event}`}
                                                        checked={newWebhookEvents.includes(event)}
                                                        onCheckedChange={() => toggleWebhookEvent(event)}
                                                    />
                                                    <label htmlFor={`event-${event}`} className="text-sm font-medium leading-none">
                                                        {event.replace("_", " ")}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </FormItem>

                                    <Button onClick={handleAddWebhook}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Webhook
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="danger" className="space-y-4 mt-4">
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>These actions are destructive and cannot be undone</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-md border border-destructive/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Transfer Ownership</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Transfer this project to another user or organization
                                        </p>
                                    </div>
                                    <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                                        Transfer
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md border border-destructive/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Archive this project</h3>
                                        <p className="text-sm text-muted-foreground">Mark this project as archived and read-only</p>
                                    </div>
                                    <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                                        Archive
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md border border-destructive/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Delete this project</h3>
                                        <p className="text-sm text-muted-foreground">Once you delete a project, there is no going back</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Project
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the project "{projectName}" and
                                                    remove all collaborator associations.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Delete Project
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ProjectSettings
