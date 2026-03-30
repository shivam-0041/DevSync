"use client"
import { Link, useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
    Code,
    MessageSquare,
    Users,
    FileCode,
    Send,
    Plus,
    Video,
    Mic,
    Share2,
    MoreHorizontal,
    GitBranch,
    GitCommit,
    Save,
    Folder,
    ChevronUp,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { ScrollArea } from "../components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { getBrandHomePath } from "../lib/brand-link"
import { ProjectInvite, createProjectItem, fetchProjectData, fetchProjectMembers } from "../routes/projects"
import { toast } from "sonner"

type ProjectFileNode = {
    id: number
    name: string
    item_type: "folder" | "file"
    file_url?: string | null
    children?: ProjectFileNode[]
}

type Collaborator = {
    name: string
    username: string
    role: "admin" | "maintainer" | "developer" | "guest"
    status: "online" | "away" | "offline"
    avatar: string
}

export default function CollaboratePage() {
    const { username, slug: projectSlug } = useParams();
    const [projectName, setProjectName] = useState("Project")
    const [projectOwner, setProjectOwner] = useState(username || "")
    const [projectFiles, setProjectFiles] = useState<ProjectFileNode[]>([])
    const [collaborators, setCollaborators] = useState<Collaborator[]>([])
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set())
    const [selectedFile, setSelectedFile] = useState<ProjectFileNode | null>(null)
    const [selectedParentFolderId, setSelectedParentFolderId] = useState<number | null>(null)
    const [selectedFileContent, setSelectedFileContent] = useState("Select a file to preview its content.")
    const [isFileLoading, setIsFileLoading] = useState(false)
    const [fileSearchQuery, setFileSearchQuery] = useState("")
    const [isProjectAdmin, setIsProjectAdmin] = useState(false)
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState<"admin" | "maintainer" | "developer" | "guest">("developer")
    const [isInviting, setIsInviting] = useState(false)
    const [loading, setLoading] = useState(true);
    const loggedInUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {}

    const resolveAvatar = (avatar?: string | null) => {
        if (!avatar || avatar === "null" || avatar === "undefined") {
            return "/def-avatar.svg"
        }
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
            return avatar
        }
        if (avatar.startsWith("/")) {
            return `http://localhost:8000${avatar}`
        }
        return "/def-avatar.svg"
    }

    const findFirstFile = (files: ProjectFileNode[], parentFolderId: number | null = null): { file: ProjectFileNode; parentFolderId: number | null } | null => {
        for (const node of files) {
            if (node.item_type === "file") {
                return { file: node, parentFolderId }
            }
            if (node.children?.length) {
                const nested = findFirstFile(node.children, node.id)
                if (nested) {
                    return nested
                }
            }
        }
        return null
    }

    const loadFileContent = async (file: ProjectFileNode, parentFolderId: number | null = null) => {
        setSelectedFile(file)
        setSelectedParentFolderId(parentFolderId)

        if (!file.file_url) {
            setSelectedFileContent("This file has no stored content yet.")
            return
        }

        const lowerName = file.name.toLowerCase()
        const isLikelyBinary = /\.(png|jpg|jpeg|gif|webp|ico|pdf|zip|gz|mp3|mp4|mov|avi|woff|woff2|ttf|otf)$/i.test(lowerName)
        if (isLikelyBinary) {
            setSelectedFileContent("Binary file selected. Preview is unavailable in this editor.")
            return
        }

        setIsFileLoading(true)

        try {
            const token = localStorage.getItem("access")
            const absoluteUrl = file.file_url.startsWith("http") ? file.file_url : `http://localhost:8000${file.file_url}`
            const response = await axios.get(absoluteUrl, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                responseType: "text",
            })

            setSelectedFileContent(typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2))
        } catch (error) {
            console.error("Failed to load file content:", error)
            setSelectedFileContent("Could not load this file content from the server.")
        } finally {
            setIsFileLoading(false)
        }
    }

    const toggleFolder = (id: number) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const filterFileTree = (nodes: ProjectFileNode[], query: string): ProjectFileNode[] => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return nodes
        }

        const filtered: ProjectFileNode[] = []
        for (const node of nodes) {
            const ownMatch = node.name.toLowerCase().includes(normalized)
            const filteredChildren = node.children ? filterFileTree(node.children, normalized) : []

            if (ownMatch || filteredChildren.length > 0) {
                filtered.push({
                    ...node,
                    children: filteredChildren,
                })
            }
        }

        return filtered
    }

    const visibleFiles = useMemo(() => {
        return filterFileTree(projectFiles, fileSearchQuery)
    }, [projectFiles, fileSearchQuery])

    const handleCreateItem = async (itemType: "file" | "folder") => {
        if (!projectSlug) {
            return
        }

        const placeholder = itemType === "file" ? "NewFile.tsx" : "new-folder"
        const name = window.prompt(`Enter ${itemType} name`, placeholder)?.trim()
        if (!name) {
            return
        }

        let initialContent = ""
        if (itemType === "file") {
            initialContent = window.prompt("Initial content (optional)", "") || ""
        }

        const parentId = selectedFile
            ? (selectedFile.item_type === "folder" ? selectedFile.id : selectedParentFolderId)
            : null

        const createResult = await createProjectItem(projectSlug, {
            name,
            itemType,
            parentId,
            initialContent,
            branch: "main",
        })

        if (!createResult.success) {
            toast.error(createResult.error || `Failed to create ${itemType}`)
            return
        }

        const createdItemId = createResult.data?.item?.id

        const updatedProject = await fetchProjectData(projectSlug)
        const updatedFiles = Array.isArray(updatedProject?.files) ? updatedProject.files : []
        setProjectFiles(updatedFiles)

        toast.success(`${itemType === "file" ? "File" : "Folder"} created successfully`)

        const findById = (nodes: ProjectFileNode[], targetId: number, currentParent: number | null = null): { node: ProjectFileNode; parent: number | null } | null => {
            for (const node of nodes) {
                if (node.id === targetId) {
                    return { node, parent: currentParent }
                }
                if (node.item_type === "folder" && node.children?.length) {
                    const nested = findById(node.children, targetId, node.id)
                    if (nested) {
                        return nested
                    }
                }
            }
            return null
        }

        if (!createdItemId) {
            return
        }

        const created = findById(updatedFiles, createdItemId)
        if (!created) {
            return
        }

        if (itemType === "folder") {
            setExpandedFolders((prev) => new Set(prev).add(created.node.id))
            return
        }

        await loadFileContent(created.node, created.parent)
    }

    const handleInviteCollaborator = async () => {
        const email = inviteEmail.trim()
        if (!projectSlug || !email) {
            toast.error("Email is required")
            return
        }

        setIsInviting(true)
        try {
            await ProjectInvite(projectSlug, {
                email,
                role: inviteRole,
            })

            toast.success(`Invitation sent to ${email}`)
            setInviteEmail("")
            setInviteRole("developer")
            setIsInviteDialogOpen(false)
        } catch (error: any) {
            const message = error?.response?.data?.error || error?.response?.data?.email?.[0] || "Failed to send invitation"
            toast.error(message)
        } finally {
            setIsInviting(false)
        }
    }

    useEffect(() => {
        const fetchCollaborationData = async () => {
            if (!projectSlug) {
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const [projectData, membersResult] = await Promise.all([
                    fetchProjectData(projectSlug),
                    fetchProjectMembers(projectSlug),
                ])

                setProjectName(projectData?.name || "Project")
                setProjectOwner(projectData?.created_by?.username || username || "")

                const files = Array.isArray(projectData?.files) ? projectData.files : []
                setProjectFiles(files)

                const rootFolders = files.filter((node: ProjectFileNode) => node.item_type === "folder").map((node: ProjectFileNode) => node.id)
                setExpandedFolders(new Set(rootFolders))

                const firstFile = findFirstFile(files)
                if (firstFile) {
                    await loadFileContent(firstFile.file, firstFile.parentFolderId)
                }

                if (membersResult.success) {
                    const currentUsername = String(loggedInUser?.username || "").trim().toLowerCase()
                    const currentUserMembership = membersResult.members.find(
                        (member) => String(member.user.username || "").trim().toLowerCase() === currentUsername
                    )
                    setIsProjectAdmin(currentUserMembership?.role === "admin")

                    const mapped = membersResult.members.map((member) => {
                        const displayName = `${member.user.first_name || ""} ${member.user.last_name || ""}`.trim() || member.user.username
                        return {
                            name: displayName,
                            username: member.user.username,
                            role: member.role,
                            status: "offline" as const,
                            avatar: resolveAvatar(member.user.profile?.avatar || null),
                        }
                    })
                    setCollaborators(mapped)
                } else {
                    setIsProjectAdmin(false)
                    setCollaborators([])
                }
            } catch (error) {
                console.error("Failed to fetch collaboration data:", error)
                setIsProjectAdmin(false)
                setProjectFiles([])
                setCollaborators([])
            } finally {
                setLoading(false)
            }
        }

        fetchCollaborationData()
    }, [projectSlug, username])

    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to={getBrandHomePath()} className="flex items-center gap-2">
                                <Code className="h-6 w-6 text-emerald-500" />
                                <span className="font-bold">DevSync</span>
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <Link to={`/p/${projectOwner || username}`} className="text-sm hover:underline">
                                {projectOwner || username}
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <Link to={`/${username}/project/${projectSlug}`} className="text-sm font-medium hover:underline">
                                {projectName}
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {collaborators.slice(0, 3).map((collaborator, index) => (
                                    <Avatar key={index} className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {collaborators.length > 3 && (
                                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs border-2 border-white dark:border-zinc-900">
                                        +{collaborators.length - 3}
                                    </div>
                                )}
                            </div>
                            <Button size="sm" variant="outline">
                                <Share2 className="h-4 w-4 mr-1" /> Share
                            </Button>
                            <Button size="sm" variant="outline">
                                <GitBranch className="h-4 w-4 mr-1" /> main
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* File Explorer */}
                <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <ChevronUp className="h-4 w-4 text-zinc-400" />
                                <h3 className="font-medium">Files</h3>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleCreateItem("folder")}>
                                        Create Folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCreateItem("file")}>
                                        Create File
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Input
                            placeholder="Search files across directories..."
                            className="h-8 text-sm"
                            value={fileSearchQuery}
                            onChange={(e) => setFileSearchQuery(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            {loading ? (
                                <div className="p-4 text-center text-zinc-500">Loading...</div>
                            ) : (
                                <FileExplorer
                                    files={visibleFiles}
                                    level={0}
                                    selectedFileId={selectedFile?.id || null}
                                    expandedFolders={expandedFolders}
                                    forceExpand={Boolean(fileSearchQuery.trim())}
                                    onToggleFolder={toggleFolder}
                                    onSelectFile={loadFileContent}
                                />
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                                {selectedFile?.name || "No file selected"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                <GitCommit className="h-3 w-3 mr-1" /> main
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-4 font-mono text-sm">
                        <pre className="whitespace-pre-wrap">
                            <code>{isFileLoading ? "Loading file..." : selectedFileContent}</code>
                        </pre>
                    </div>
                </div>

                {/* Collaboration Panel */}
                <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
                    <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                        <TabsList className="w-full justify-start px-2 pt-2 bg-transparent">
                            <TabsTrigger
                                value="chat"
                                className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </TabsTrigger>
                            <TabsTrigger
                                value="people"
                                className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800"
                            >
                                <Users className="h-4 w-4 mr-2" /> People
                            </TabsTrigger>
                        </TabsList>
                        <Separator />

                        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    <p className="text-sm text-zinc-500">Realtime chat data is not connected yet for this page.</p>
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Input placeholder="Type a message..." className="h-8" />
                                    <Button size="icon" className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="people" className="flex-1 p-0 m-0">
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {collaborators.map((collaborator, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar>
                                                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                                                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div
                                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${collaborator.status === "online"
                                                                ? "bg-green-500"
                                                                : collaborator.status === "away"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-zinc-300 dark:bg-zinc-600"
                                                            }`}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{collaborator.name}</div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">@{collaborator.username} · {collaborator.role}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Video className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                {isProjectAdmin ? (
                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => setIsInviteDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" /> Invite Collaborator
                                    </Button>
                                ) : (
                                    <p className="text-xs text-zinc-500 text-center">Only project admins can invite collaborators.</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Mic className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{collaborators.length} collaborators</div>
                    </div>
                </div>
            </div>

            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Collaborator</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as "admin" | "maintainer" | "developer" | "guest")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="maintainer">Maintainer</SelectItem>
                                    <SelectItem value="developer">Developer</SelectItem>
                                    <SelectItem value="guest">Guest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} disabled={isInviting}>
                            Cancel
                        </Button>
                        <Button onClick={handleInviteCollaborator} disabled={isInviting} className="bg-emerald-500 hover:bg-emerald-600">
                            {isInviting ? "Sending..." : "Send Invite"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function FileExplorer({
    files,
    level,
    selectedFileId,
    expandedFolders,
    forceExpand,
    onToggleFolder,
    onSelectFile,
}: {
    files: ProjectFileNode[]
    level: number
    selectedFileId: number | null
    expandedFolders: Set<number>
    forceExpand: boolean
    onToggleFolder: (id: number) => void
    onSelectFile: (file: ProjectFileNode, parentFolderId: number | null) => void
}) {
    return (
        <div className="space-y-1">
            {files.map((file) => (
                <div key={file.id}>
                    <button
                        type="button"
                        onClick={() => (file.item_type === "folder" ? onToggleFolder(file.id) : onSelectFile(file, null))}
                        className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ${selectedFileId === file.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                            }`}
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                    >
                        {file.item_type === "folder" ? (
                            <>
                                <Folder className="h-4 w-4 text-zinc-500" />
                                <span className="text-sm">{file.name}</span>
                            </>
                        ) : (
                            <>
                                <FileCode className="h-4 w-4 text-zinc-500" />
                                <span className="text-sm">{file.name}</span>
                            </>
                        )}
                    </button>
                    {file.item_type === "folder" && (forceExpand || expandedFolders.has(file.id)) && file.children && (
                        <FileExplorer
                            files={file.children}
                            level={level + 1}
                            selectedFileId={selectedFileId}
                            expandedFolders={expandedFolders}
                            forceExpand={forceExpand}
                            onToggleFolder={onToggleFolder}
                            onSelectFile={(childFile) => onSelectFile(childFile, file.id)}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
