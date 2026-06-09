"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { GitBranch, ArrowRight, Plus, Users, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { fetchProjectMembers, fetchProjectData, createNewPL } from "../routes/projects"
import { toast } from "sonner"

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

const NewPullRequestPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        baseBranch: "main",
        compareBranch: "main",
        assignees: [],
        reviewers: [],
        labels: [],
        milestone: "",
        draft: false,
    })
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [branches, setBranches] = useState<string[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

    // Fetch real data on mount
    useEffect(() => {
        if (!slug) return
        
        const loadData = async () => {
            try {
                setIsLoadingData(true)
                
                // Fetch project data to get branches
                const projectResult = await fetchProjectData(slug)
                console.log("Project result:", projectResult)
                
                if (projectResult.success && projectResult.data) {
                    // Try different possible structures for branches
                    let projectBranches = []
                    
                    if (Array.isArray(projectResult.data.branches)) {
                        projectBranches = projectResult.data.branches.map((b: any) => 
                            typeof b === 'string' ? b : b.name || b
                        )
                    }
                    
                    if (projectBranches.length === 0) {
                        projectBranches = ["main"]
                    }
                    
                    console.log("Branches:", projectBranches)
                    setBranches(projectBranches)
                    setFormData(prev => ({
                        ...prev,
                        baseBranch: projectBranches[0] || "main",
                        compareBranch: projectBranches[projectBranches.length - 1] || "main"
                    }))
                } else {
                    console.warn("Project fetch failed or no data:", projectResult)
                    setBranches(["main"])
                }
                
                // Fetch project members for assignees and reviewers
                const membersResult = await fetchProjectMembers(slug)
                console.log("Members result:", membersResult)
                
                if (membersResult.success && Array.isArray(membersResult.members)) {
                    const members = membersResult.members.map((m: any) => ({
                        id: m.id || m.user_id,
                        name: m.full_name || m.name || m.username || "Unknown",
                        username: m.username,
                        avatar: m.avatar || "/placeholder.svg?height=32&width=32"
                    }))
                    console.log("Mapped members:", members)
                    setTeamMembers(members)
                } else {
                    console.warn("Members fetch failed or no data:", membersResult)
                    setTeamMembers([])
                }
            } catch (error) {
                console.error("Failed to load pull request data:", error)
                toast.error("Failed to load project data")
                setBranches(["main"])
                setTeamMembers([])
            } finally {
                setIsLoadingData(false)
            }
        }
        
        loadData()
    }, [slug])

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleAddReviewers = useCallback(() => {
        toast.info("Reviewer selection coming soon")
    }, [])

    const handleAssignYourself = useCallback(() => {
        toast.info("Assignment feature coming soon")
    }, [])

    const handleAddLabels = useCallback(() => {
        toast.info("Label selection coming soon")
    }, [])

    const handleSetMilestone = useCallback(() => {
        toast.info("Milestone selection coming soon")
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!slug) {
            toast.error("Project slug not found")
            return
        }
        
        if (!branches || branches.length === 0) {
            toast.error("No branches available")
            return
        }
        
        if (!formData.description.trim()) {
            toast.error("Please enter a pull request description")
            return
        }

        setIsCreating(true)

        try {
            const result = await createNewPL(slug, {
                from_branch: formData.compareBranch,
                to_branch: formData.baseBranch,
                message: formData.description,
                labels: formData.labels,
                reviewers: formData.reviewers,
                is_draft: formData.draft,
            })

            if (result.success) {
                toast.success("Pull request created successfully!")
                // Redirect to project or pull requests page
                window.location.href = `/${window.location.pathname.split('/')[1]}/project/${slug}/pull-requests`
            } else {
                toast.error(result.error || "Failed to create pull request")
            }
        } catch (error) {
            toast.error("Failed to create pull request")
            console.error(error)
        } finally {
            setIsCreating(false)
        }
    }, [slug, formData, branches])

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
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create a <span className="text-emerald-500">Pull Request</span>
                    </h1>
                    <p className="mt-2 text-gray-400">Compare changes and create a pull request to merge your work.</p>
                </div>

                {isLoadingData ? (
                    <Card className="border-gray-800 bg-gray-900/50">
                        <CardContent className="pt-6 text-center">
                            <p className="text-gray-400">Loading project data...</p>
                        </CardContent>
                    </Card>
                ) : (
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
                                        <div className="flex-1 space-y-2">
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

                                        <div className="flex-1 space-y-2">
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
                                            <Plus className="mr-1 h-4 w-4" />3 commits
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <Plus className="mr-1 h-4 w-4" />5 files changed
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
                            {/* <Card className="border-gray-800 bg-gray-900/50">
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
                            </Card> */}

                            <div className="flex space-x-4">
                                <Button 
                                    type="submit" 
                                    className="bg-emerald-500 text-black hover:bg-emerald-600" 
                                    disabled={isCreating || isLoadingData || !formData.description.trim()}
                                >
                                    {isCreating ? "Creating pull request..." : "Create pull request"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-700"
                                    onClick={() => handleInputChange("draft", !formData.draft)}
                                    disabled={isCreating || isLoadingData}
                                >
                                    Create draft pull request
                                </Button>
                                <Link to={`/${window.location.pathname.split('/')[1]}/project/${slug}`}>
                                    <Button variant="outline" className="border-gray-700" disabled={isCreating || isLoadingData}>
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
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full border-gray-700"
                                        onClick={handleAddReviewers}
                                        disabled={isCreating || isLoadingData}
                                    >
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
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-gray-700"
                                    onClick={handleAssignYourself}
                                    disabled={isCreating || isLoadingData}
                                >
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
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full border-gray-700"
                                        onClick={handleAddLabels}
                                        disabled={isCreating || isLoadingData}
                                    >
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
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-gray-700"
                                    onClick={handleSetMilestone}
                                    disabled={isCreating || isLoadingData}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Set milestone
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                )}
            </div>
    )
}

export default NewPullRequestPage
