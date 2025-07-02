"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { GitBranch, GitCommit, ArrowRight, Plus, Minus, FileText, Users, CheckCircle2 } from "lucide-react"
import {Link} from "react-router-dom"
import AuthGuard from "../components/auth-guard"

interface FormData {
    title: string
    description: string
    baseBranch: string
    compareBranch: string
    assignees: string[]
    reviewers: string[]
    labels: string[]
    milestone: string
    draft: boolean
}

interface TeamMember {
    id: number
    name: string
    username: string
    avatar: string
}

interface Commit {
    id: string
    message: string
    author: string
    time: string
    additions: number
    deletions: number
}

interface ChangedFile {
    name: string
    additions: number
    deletions: number
    status: "added" | "modified" | "deleted"
}

const NewPullRequestPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        baseBranch: "main",
        compareBranch: "feature/user-authentication",
        assignees: [],
        reviewers: [],
        labels: [],
        milestone: "",
        draft: false,
    })
    const [isCreating, setIsCreating] = useState<boolean>(false)

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        // Simulate API call
        setTimeout(() => {
            setIsCreating(false)
            // Redirect to the new pull request
            window.location.href = `/pull-request/123`
        }, 2000)
    }, [])

    const branches = useMemo(
        () => [
            "main",
            "develop",
            "feature/user-authentication",
            "feature/dashboard-ui",
            "bugfix/login-issue",
            "hotfix/security-patch",
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

    const availableLabels = useMemo(
        () => [
            { name: "bug", color: "bg-red-500" },
            { name: "enhancement", color: "bg-blue-500" },
            { name: "documentation", color: "bg-green-500" },
            { name: "help wanted", color: "bg-purple-500" },
            { name: "good first issue", color: "bg-yellow-500" },
        ],
        [],
    )

    const commits = useMemo<Commit[]>(
        () => [
            {
                id: "a1b2c3d",
                message: "Add user authentication endpoints",
                author: "Alex Johnson",
                time: "2 hours ago",
                additions: 156,
                deletions: 23,
            },
            {
                id: "e4f5g6h",
                message: "Implement JWT token validation",
                author: "Alex Johnson",
                time: "1 hour ago",
                additions: 89,
                deletions: 12,
            },
            {
                id: "i7j8k9l",
                message: "Add password reset functionality",
                author: "Alex Johnson",
                time: "30 minutes ago",
                additions: 67,
                deletions: 5,
            },
        ],
        [],
    )

    const changedFiles = useMemo<ChangedFile[]>(
        () => [
            {
                name: "src/auth/auth.controller.ts",
                additions: 45,
                deletions: 8,
                status: "modified",
            },
            {
                name: "src/auth/auth.service.ts",
                additions: 78,
                deletions: 12,
                status: "modified",
            },
            {
                name: "src/auth/dto/login.dto.ts",
                additions: 23,
                deletions: 0,
                status: "added",
            },
            {
                name: "src/auth/guards/jwt.guard.ts",
                additions: 34,
                deletions: 0,
                status: "added",
            },
            {
                name: "src/config/database.config.ts",
                additions: 12,
                deletions: 8,
                status: "modified",
            },
        ],
        [],
    )

    const CommitCard: React.FC<{ commit: Commit }> = React.memo(({ commit }) => (
        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3">
            <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <GitCommit className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-medium">{commit.message}</p>
                    <p className="text-sm text-gray-400">
                        {commit.author} committed {commit.time}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <span className="text-emerald-500">+{commit.additions}</span>
                <span className="text-red-500">-{commit.deletions}</span>
                <code className="rounded bg-gray-800 px-2 py-1 text-xs">{commit.id}</code>
            </div>
        </div>
    ))

    const FileCard: React.FC<{ file: ChangedFile }> = React.memo(({ file }) => (
        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3">
            <div className="flex items-center space-x-3">
                <div
                    className={`h-2 w-2 rounded-full ${file.status === "added" ? "bg-emerald-500" : file.status === "modified" ? "bg-yellow-500" : "bg-red-500"
                        }`}
                />
                <span className="font-mono text-sm">{file.name}</span>
                <Badge variant="outline" className="text-xs">
                    {file.status}
                </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <span className="flex items-center text-emerald-500">
                    <Plus className="mr-1 h-3 w-3" />
                    {file.additions}
                </span>
                <span className="flex items-center text-red-500">
                    <Minus className="mr-1 h-3 w-3" />
                    {file.deletions}
                </span>
            </div>
        </div>
    ))

    const TeamMemberCard: React.FC<{ member: TeamMember }> = React.memo(({ member }) => (
        <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>
                    {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-400">@{member.username}</p>
            </div>
        </div>
    ))

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create a <span className="text-emerald-500">Pull Request</span>
                    </h1>
                    <p className="mt-2 text-gray-400">Compare changes and create a pull request to merge your work.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Branch Comparison */}
                            <Card className="border-gray-800 bg-gray-900/50">
                                <CardHeader>
                                    <CardTitle>Compare Changes</CardTitle>
                                    <CardDescription>Choose branches to compare and review changes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <Label htmlFor="base-branch">Base branch</Label>
                                            <Select
                                                value={formData.baseBranch}
                                                onValueChange={(value) => handleInputChange("baseBranch", value)}
                                            >
                                                <SelectTrigger className="border-gray-700 bg-gray-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {branches.map((branch) => (
                                                        <SelectItem key={branch} value={branch}>
                                                            <div className="flex items-center">
                                                                <GitBranch className="mr-2 h-4 w-4" />
                                                                {branch}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <ArrowRight className="h-5 w-5 text-gray-400 mt-6" />

                                        <div className="flex-1">
                                            <Label htmlFor="compare-branch">Compare branch</Label>
                                            <Select
                                                value={formData.compareBranch}
                                                onValueChange={(value) => handleInputChange("compareBranch", value)}
                                            >
                                                <SelectTrigger className="border-gray-700 bg-gray-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {branches.map((branch) => (
                                                        <SelectItem key={branch} value={branch}>
                                                            <div className="flex items-center">
                                                                <GitBranch className="mr-2 h-4 w-4" />
                                                                {branch}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center space-x-4 text-sm">
                                        <div className="flex items-center text-emerald-500">
                                            <CheckCircle2 className="mr-1 h-4 w-4" />
                                            Able to merge
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <GitCommit className="mr-1 h-4 w-4" />3 commits
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <FileText className="mr-1 h-4 w-4" />5 files changed
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pull Request Details */}
                            <Card className="border-gray-800 bg-gray-900/50">
                                <CardHeader>
                                    <CardTitle>Pull Request Details</CardTitle>
                                    <CardDescription>Provide information about your changes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="Add user authentication system"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            className="border-gray-700 bg-gray-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe your changes..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            className="border-gray-700 bg-gray-800"
                                            rows={6}
                                        />
                                        <p className="text-xs text-gray-400">
                                            Provide a detailed description of the changes you've made. Include any relevant context or
                                            screenshots.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Changes Preview */}
                            <Card className="border-gray-800 bg-gray-900/50">
                                <CardHeader>
                                    <CardTitle>Changes</CardTitle>
                                    <CardDescription>Review the changes in this pull request</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="commits" className="w-full">
                                        <TabsList className="bg-gray-900">
                                            <TabsTrigger value="commits">Commits ({commits.length})</TabsTrigger>
                                            <TabsTrigger value="files">Files changed ({changedFiles.length})</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="commits" className="mt-4">
                                            <div className="space-y-3">
                                                {commits.map((commit) => (
                                                    <CommitCard key={commit.id} commit={commit} />
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="files" className="mt-4">
                                            <div className="space-y-2">
                                                {changedFiles.map((file, index) => (
                                                    <FileCard key={index} file={file} />
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            <div className="flex space-x-4">
                                <Button type="submit" className="bg-emerald-500 text-black hover:bg-emerald-600" disabled={isCreating}>
                                    {isCreating ? "Creating pull request..." : "Create pull request"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-700"
                                    onClick={() => handleInputChange("draft", true)}
                                >
                                    Create draft pull request
                                </Button>
                                <Link href="/repository/devsync-web-app">
                                    <Button variant="outline" className="border-gray-700">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-emerald-500" />
                                    Reviewers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {teamMembers.slice(0, 2).map((member) => (
                                        <TeamMemberCard key={member.id} member={member} />
                                    ))}
                                    <Button variant="outline" size="sm" className="w-full border-gray-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add reviewers
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle>Assignees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" size="sm" className="w-full border-gray-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Assign yourself
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle>Labels</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {availableLabels.slice(0, 3).map((label) => (
                                        <div key={label.name} className="flex items-center space-x-2">
                                            <div className={`h-3 w-3 rounded-full ${label.color}`} />
                                            <span className="text-sm">{label.name}</span>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" className="w-full border-gray-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add labels
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle>Milestone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" size="sm" className="w-full border-gray-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Set milestone
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

export default NewPullRequestPage
