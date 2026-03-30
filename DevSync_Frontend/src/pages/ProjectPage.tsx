import {Link, useParams, useNavigate} from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import {
    Code,
    GitBranch,
    Star,
    Eye,
    Share2,
    Download,
    FileCode,
    Folder,
    ChevronRight,
    ChevronDown,
    Clock,
    MessageSquare,
    GitCommit,
    GitPullRequest,
    AlertCircle,
    Trello,
    Calendar,
    Plus,
    Check,
    CheckCircle2,
    XCircle,
    Shield,
    BadgePlus,
    Tags,
    Settings,
    Users,
    GitCommitIcon as CommitIcon,
    Upload,
    Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { TaskAllocation } from "../components/task-allocation"
import { CreateTaskModal } from "../components/createtask"
import { fetchProjectData, fetchProjectMembers, uploadFiles, deleteFile, downloadFiles } from "../routes/projects"
import { useEffect, useState, useMemo, useRef } from "react"

// Type definitions
interface FileItemData {
    id: number;
    name: string;
    item_type: "file" | "folder";
    filetype?: string;
    file_url?: string;
    size?: number;
    uploaded_at?: string;
    uploaded_by?: string;
    branch?: string;
    children?: FileItemData[];
    depth?: number;
}

interface ActivityItemData {
    id: number;
    user: string;
    action: string;
    timestamp: string;
    created_at: string;
}

interface LanguageData {
    name: string;
    percentage: number;
    color: string;
}

export default function ProjectPage() {
    // In a real app, we would fetch the project data based on the ID
    //const projectId = params.id
    const [loading, setLoading] = useState(true);
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {}
    const [currentUserRole, setCurrentUserRole] = useState<"admin" | "maintainer" | "developer" | "guest" | null>(null)
    const [open, setOpen] = useState(false);

    const [branches, setBranches] = useState<{ name: string; created_by: string }[]>([]);
    const [branchMeta, setBranchMeta] = useState<Record<string, { parent?: string; protected?: boolean }>>({
        main: { protected: true },
    })
    const [currentBranch, setCurrentBranch] = useState<string>("main")

   // Dropdown search
    
    const [search, setSearch] = useState("")
    const filteredBranches = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return branches
        return branches.filter((b) => b.toLowerCase().includes(q))
    }, [branches, search])
    const searchExactExists = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return false
        return branches.some((b) => b.toLowerCase() === q)
    }, [branches, search])


    // Create branch dialog state
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newBranchName, setNewBranchName] = useState("")
    const [newBranchDescription, setNewBranchDescription] = useState("")
    const [newBranchParent, setNewBranchParent] = useState<string | undefined>(undefined)
    const [newBranchProtection, setNewBranchProtection] = useState<"none" | "protected">("none")
    const [newBranchStartingPoint, setNewBranchStartingPoint] = useState<string>("current")
    const [labels, setLabels] = useState<string[]>([])
    const [labelInput, setLabelInput] = useState("")
    const [createError, setCreateError] = useState<string | null>(null)


    function handleSubmitCreate() {
        const name = newBranchName.trim()
        if (!name) {
            setCreateError("Name is required.")
            return
        }
        if (branches.some((b) => b.toLowerCase() === name.toLowerCase())) {
            setCreateError("A branch with this name already exists.")
            return
        }

        setBranches((prev) => [...prev, name])
        setBranchMeta((prev) => ({
        ...prev,
        [name]: { parent: newBranchParent || undefined, protected: newBranchProtection === "protected" },
        }))
        // In a real app, use newBranchStartingPoint and labels to seed the branch.
        setCurrentBranch(name)
        setIsCreateOpen(false)
    }

    const [project, setProject] = useState<any>({
        project_id: "",      
        name: "",
        description: "",
        visibility: "private",
        branches: [],
        branch_count: 0,       
        stars: 0,
        watchers: 0,
        forks: 0,
        issues_count: 0,
        pull_requests_count: 0,
        progress: 0,    
        contributors: [],    
        tasks: [],
        updated_at: "",        
        created_at: "",         
        slug: "",           
        logo: "",           
        readme: "",
        status: "active", 
        whiteboard_id: "",
        chat_id: "",
        files: [],
        activities: [],
        languages: [],
  });

    // File upload refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Handle file selection from input
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const fileArray = Array.from(files);
            const result = await uploadFiles(project.slug, fileArray, undefined, currentBranch);
            
            if (result.success) {
                // Update project files with new data
                setProject((prev: any) => ({
                    ...prev,
                    files: result.files || prev.files,
                }));
                toast.success(`${result.uploadedCount} file(s) uploaded successfully`);
            } else {
                toast.error(result.error || "Failed to upload files");
            }
        } catch (error) {
            toast.error("Upload failed");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            if (folderInputRef.current) {
                folderInputRef.current.value = "";
            }
        }
    };

    // Open file picker
    const handleOpenFilePicker = () => {
        fileInputRef.current?.click();
    };

    // Open folder picker
    const handleOpenFolderPicker = () => {
        folderInputRef.current?.click();
    };

    // Delete confirmation state
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        fileId: number | null;
        fileName: string;
        fileNameInput: string;
    }>({
        isOpen: false,
        fileId: null,
        fileName: "",
        fileNameInput: "",
    });

    const [isDeleting, setIsDeleting] = useState(false);

    // Open delete confirmation dialog
    const handleOpenDeleteDialog = (fileId: number, fileName: string) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId,
            fileName,
            fileNameInput: "",
        });
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setDeleteConfirmation({
            isOpen: false,
            fileId: null,
            fileName: "",
            fileNameInput: "",
        });
    };

    // Handle file deletion
    const handleConfirmDelete = async () => {
        if (
            !deleteConfirmation.fileId ||
            deleteConfirmation.fileNameInput.trim() !== deleteConfirmation.fileName
        ) {
            toast.error("File name does not match. Please try again.");
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteFile(
                project.slug,
                deleteConfirmation.fileId,
                deleteConfirmation.fileName
            );

            if (result.success) {
                setProject((prev: any) => ({
                    ...prev,
                    files: result.files || prev.files,
                }));
                toast.success(result.message || "File deleted successfully");
                handleCloseDeleteDialog();
            } else {
                toast.error(result.error || "Failed to delete file");
            }
        } catch (error) {
            toast.error("Delete failed");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle download
    const handleDownload = async () => {
        try {
            const result = await downloadFiles(project.slug, currentBranch);
            if (result.success) {
                toast.success("Download started");
            } else {
                toast.error(result.error || "Failed to download files");
            }
        } catch (error) {
            toast.error("Download failed");
            console.error("Download error:", error);
        }
    };

    // Handle folder navigation
    const handleFolderClick = (folderId: number, folderName: string) => {
        navigate(`/${project.created_by?.username}/project/${project.slug}/collaborate?folder=${folderId}`, {
            state: { folderName, projectSlug: project.slug }
        });
    };

    // Helper function to flatten nested file tree
    const flattenProjectFiles = (files: FileItemData[]): FileItemData[] => {
        if (!Array.isArray(files)) return []
        const result: FileItemData[] = []
        
        const traverse = (items: FileItemData[], depth: number = 0) => {
            items.forEach((item) => {
                result.push({
                    ...item,
                    depth,
                })
                if (item.children && item.children.length > 0) {
                    traverse(item.children, depth + 1)
                }
            })
        }
        
        traverse(files)
        return result
    }

    // Helper function to format file size
    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    // Memoize processed file rows
    const fileRows = useMemo(() => {
        if (!project.files || project.files.length === 0) return []
        return flattenProjectFiles(project.files)
    }, [project.files])

    // Memoize recent activities
    const recentActivities = useMemo(() => {
        if (!project.activities || project.activities.length === 0) return []
        return project.activities.slice(0, 3)
    }, [project.activities])

    // Memoize language breakdown
    const languageRows = useMemo(() => {
        if (!project.languages || typeof project.languages !== 'object') return []
        const langs = Array.isArray(project.languages) ? project.languages : Object.entries(project.languages).map(([name, percentage]) => ({
            name,
            percentage,
        }))
        return langs.slice(0, 5)
    }, [project.languages])

    useEffect( () => {
        if (projectId) {
            setLoading(true);
            fetchProjectData(projectId)
            .then((data) => {
                setProject(data);
            })
            .catch((err) => {
                console.error("Error fetching project data:", err);
            }).finally(()=> setLoading(false));
        }
    }, [projectId]);
    
    //Branches data 
    useEffect(() => {
        if (project?.branches) {
            setBranches(project.branches.map((b: any) => b.name));
        }
    }, [project]);

    const issues = useMemo(() => (Array.isArray(project.issues) ? project.issues : []), [project.issues])
    const pullRequests = useMemo(() => (Array.isArray(project.pull_requests) ? project.pull_requests : []), [project.pull_requests])
    const discussions = useMemo(() => (Array.isArray(project.discussions) ? project.discussions : []), [project.discussions])
    const tasks = useMemo(() => (Array.isArray(project.tasks) ? project.tasks : []), [project.tasks])

    useEffect(() => {
        const loadRole = async () => {
            if (!project?.slug) return
            const membersResult = await fetchProjectMembers(project.slug)
            if (!membersResult.success) return

            const userEmail = String(loggedInUser?.email || "").toLowerCase()
            const userUsername = String(loggedInUser?.username || "").toLowerCase()
            const currentMember = membersResult.members.find((member) => {
                const memberEmail = String(member.user?.email || "").toLowerCase()
                const memberUsername = String(member.user?.username || "").toLowerCase()
                return (userEmail && memberEmail === userEmail) || (userUsername && memberUsername === userUsername)
            })
            setCurrentUserRole(currentMember?.role || null)
        }

        loadRole()
    }, [project?.slug])

    const isAdmin = currentUserRole === "admin"

    if (loading) return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    );

    if (!project) return <p>Project not found</p>;

    
    

    function openCreateDialog(prefill?: string) {
        setCreateError(null)
        const base = (prefill ?? search ?? "").trim()
        setNewBranchName(base)
        setNewBranchDescription("")
        setNewBranchParent(currentBranch || undefined)
        setNewBranchProtection("none")
        setNewBranchStartingPoint("current")
        setLabels([])
        setLabelInput("")
        setIsCreateOpen(true)
    }

  

    function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
        e.preventDefault()
        const candidate = search.trim()
        if (!candidate) return
        if (!branches.some((b) => b.toLowerCase() === candidate.toLowerCase())) {
            openCreateDialog(candidate)
        }
        }
    }

    function addLabel() {
        const v = labelInput.trim()
        if (!v) return
        if (labels.some((l) => l.toLowerCase() === v.toLowerCase())) {
        setLabelInput("")
        return
        }
        setLabels((prev) => [...prev, v])
        setLabelInput("")
    }
    function removeLabel(tag: string) {
        setLabels((prev) => prev.filter((l) => l !== tag))
    }


    // Sample project data
//     const project = {
//         id: projectId,
//         name: "E-commerce Platform",
//         description:
//             "A modern e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment processing.",
//         visibility: "public",
//         language: "JavaScript",
//         languageColor: "yellow-500",
//         stars: 124,
//         watchers: 45,
//         forks: 32,
//         issues: 8,
//         pullRequests: 3,
//         lastUpdated: "2 days ago",
//         owner: {
//             name: "John Doe",
//             username: "johndoe",
//             avatar: "/placeholder.svg?height=40&width=40",
//         },
//         contributors: [
//             { initials: "JD", avatar: "/placeholder.svg?height=40&width=40" },
//             { initials: "AK", avatar: "/placeholder.svg?height=40&width=40" },
//             { initials: "MT", avatar: "/placeholder.svg?height=40&width=40" },
//             { initials: "LM", avatar: "/placeholder.svg?height=40&width=40" },
//             { initials: "RJ", avatar: "/placeholder.svg?height=40&width=40" },
//         ],
//         readme: `
// # E-commerce Platform

// A modern e-commerce platform built with React and Node.js.

// ## Features

// - User authentication
// - Product catalog
// - Shopping cart
// - Payment processing
// - Order management
// - Admin dashboard

// ## Getting Started

// \`\`\`bash
// # Clone the repository
// git clone https://DevSync.com/johndoe/ecommerce-platform.git

// # Install dependencies
// npm install

// # Start the development server
// npm run dev
// \`\`\`

// ## Contributing

// Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

// ## License

// This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
//     `,
//     }

    // Sample tasks data
    // const tasks = [
    //     {
    //         id: "1",
    //         title: "Implement dropdown component",
    //         status: "In Progress",
    //         assignee: {
    //             name: "John Doe",
    //             avatar: "/placeholder.svg?height=40&width=40",
    //             initials: "JD",
    //         },
    //         dueDate: "Tomorrow",
    //     },
    //     {
    //         id: "2",
    //         title: "Fix responsive layout issues",
    //         status: "To Do",
    //         assignee: {
    //             name: "Sarah Liu",
    //             avatar: "/placeholder.svg?height=40&width=40",
    //             initials: "SL",
    //         },
    //         dueDate: "3 days",
    //     },
    //     {
    //         id: "3",
    //         title: "Update documentation",
    //         status: "Review",
    //         assignee: {
    //             name: "Mike Kim",
    //             avatar: "/placeholder.svg?height=40&width=40",
    //             initials: "MK",
    //         },
    //         dueDate: "2 days",
    //     },
    //     {
    //         id: "4",
    //         title: "Add unit tests for API",
    //         status: "Done",
    //         assignee: {
    //             name: "Alex Kim",
    //             avatar: "/placeholder.svg?height=40&width=40",
    //             initials: "AK",
    //         },
    //         dueDate: "Yesterday",
    //     },
    // ]

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Link to={`/dashboard/${project.created_by?.username}`} className="flex items-center gap-2">
                            <Code className="h-6 w-6 text-emerald-500" />
                            <span className="font-bold">DevSync</span>
                        </Link>
                        <span className="text-zinc-400">/</span>
                        <Link to={`/${project.created_by?.username}/project/${project.id}`} className="text-sm hover:underline">
                            {project.created_by?.username || "N/A"}
                        </Link>
                        <span className="text-zinc-400">/</span>
                        <Link to={`/${project.created_by?.username}/project/${project.slug}`} className="text-sm font-medium hover:underline">
                            {project.name}
                        </Link>
                        <Badge variant={project.visibility === "public" ? "secondary" : "outline"} className="ml-2">
                            {project.visibility}
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 max-w-5xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold">{project.name}</h1>
                                <p className="text-zinc-600 dark:text-zinc-400 mt-1">{project.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" /> Watch
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Star className="h-4 w-4 mr-1" /> Star
                                </Button>
                                <Button variant="outline" size="sm">
                                    <GitBranch className="h-4 w-4 mr-1" /> Fork
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-8">
                            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            aria-label="Select branch"
                                            title="Switch branch"
                                            className="gap-1 rounded-full shadow-sm text-xs border-emerald-300/70 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40"
                                        >
                                            <GitBranch className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span className="font-medium">Branch</span>
                                            <span className="mx-1 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-900/60 bg-white/70 dark:bg-white/10 text-emerald-800 dark:text-emerald-200">
                                            {currentBranch}
                                            </span>
                                            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-64">
                                        <div className="px-2 pb-2 pt-2">
                                            <Label htmlFor="branch-search" className="sr-only">
                                            Search branches
                                            </Label>
                                            <Input
                                            id="branch-search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                            placeholder="Search branches…"
                                            className="h-8"
                                            />
                                            {search.trim().length > 0 && (
                                            <div className="mt-1 text-[11px] flex items-center gap-1.5">
                                                {searchExactExists ? (
                                                <>
                                                    <XCircle className="h-3.5 w-3.5 text-amber-600" />
                                                    <span className="text-amber-700 dark:text-amber-400">
                                                    A branch with this exact name already exists.
                                                    </span>
                                                </>
                                                ) : (
                                                <>
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                    <span className="text-emerald-700 dark:text-emerald-400">
                                                    Name available to create.
                                                    </span>
                                                </>
                                                )}
                                            </div>
                                            )}
                                        </div>

                                        <div className="px-2 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">Switch branch</div>
                                        {filteredBranches.length > 0 ? (
                                            filteredBranches.map((b) => (
                                            <DropdownMenuItem
                                                key={b}
                                                onSelect={(e) => {
                                                e.preventDefault()
                                                setCurrentBranch(b)
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                {b === currentBranch ? (
                                                <Check className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                <span className="w-4" />
                                                )}
                                                <span className="truncate">{b}</span>
                                                {branchMeta[b]?.protected && (
                                                <span className="ml-auto flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                                                    <Shield className="h-3.5 w-3.5" /> protected
                                                </span>
                                                )}
                                            </DropdownMenuItem>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-zinc-500">No branches match “{search.trim()}”.</div>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault()
                                                if (!searchExactExists) {
                                                    openCreateDialog();
                                                }
                                            }}
                                            disabled={searchExactExists}
                                            className="text-emerald-600 dark:text-emerald-400 focus:text-emerald-700 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
                                            aria-disabled={searchExactExists}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Create new branch
                                        </DropdownMenuItem>
                                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                <DialogTitle>Create Branch</DialogTitle>
                                                <DialogDescription>
                                                    Fill in the details for your new branch.
                                                </DialogDescription>
                                                </DialogHeader>

                                                {/* Error message */}
                                                {createError && (
                                                <p className="text-red-500 text-sm mb-2">{createError}</p>
                                                )}

                                                <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSubmitCreate();
                                                }}
                                                className="space-y-4"
                                                >
                                                {/* Branch name */}
                                                <input
                                                    type="text"
                                                    value={newBranchName}
                                                    onChange={(e) => setNewBranchName(e.target.value)}
                                                    placeholder="Branch name"
                                                    className="w-full p-2 rounded-md border dark:bg-zinc-900"
                                                />

                                                {/* Description */}
                                                <textarea
                                                    value={newBranchDescription}
                                                    onChange={(e) => setNewBranchDescription(e.target.value)}
                                                    placeholder="Description"
                                                    className="w-full p-2 rounded-md border dark:bg-zinc-900"
                                                />

                                                {/* Labels */}
                                                <div>
                                                    <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={labelInput}
                                                        onChange={(e) => setLabelInput(e.target.value)}
                                                        placeholder="Add label"
                                                        className="flex-1 p-2 rounded-md border dark:bg-zinc-900"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addLabel}
                                                        className="px-3 py-1 rounded-md bg-emerald-600 text-white"
                                                    >
                                                        Add
                                                    </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                    {labels.map((l) => (
                                                        <span
                                                        key={l}
                                                        className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-md text-sm cursor-pointer"
                                                        onClick={() => removeLabel(l)}
                                                        >
                                                        {l} ×
                                                        </span>
                                                    ))}
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                    type="button"
                                                    onClick={() => setIsCreateOpen(false)}
                                                    className="px-3 py-1 rounded-md border"
                                                    >
                                                    Cancel
                                                    </button>
                                                    <button
                                                    type="submit"
                                                    className="px-3 py-1 rounded-md bg-emerald-600 text-white"
                                                    >
                                                    Create
                                                    </button>
                                                </div>
                                                </form>
                                            </DialogContent>
                                            </Dialog>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                        <GitBranch className="h-3.5 w-3.5 mr-1" /> {project.branch_count}
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                        <GitCommit className="h-3.5 w-3.5 mr-1" /> {project.commit_count}
                                    </div>
                                    {isAdmin && (
                                    <div>
                                        <Link to={`/${loggedInUser.username}/project/${project.slug}/settings`}>
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-300">
                                                <Settings className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                    )}
                                    {isAdmin && (
                                    <div className="flex items-center justify-between ">
                                        <Link to={`/${loggedInUser.username}/project/${project.slug}/manage-collaborators`}>
                                            <Button variant="ghost" className="text-zinc-400">
                                                <Users className="w-4 h-4" /><Plus className="-ml-3 w-2 h-2"/>
                                            </Button>
                                        </Link>
                                    </div>
                                    )}
                                </div>
                                
                            </div>
                            

                            <Tabs defaultValue="code">
                                <div className="border-b border-zinc-200 dark:border-zinc-800">
                                    <TabsList className="p-0 bg-transparent border-b-0">
                                        <TabsTrigger
                                            value="code"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <FileCode className="h-4 w-4 mr-2" /> Code
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="issues"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <AlertCircle className="h-4 w-4 mr-2" /> Issues ({project.issues_count})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="pull-requests"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <GitPullRequest className="h-4 w-4 mr-2" /> Pull Requests ({project.pull_requests_count})
                                            
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="discussions"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" /> Discussions
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="tasks"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <Trello className="h-4 w-4 mr-2" /> Tasks
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="whiteboard"
                                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                                        >
                                            <Calendar className="h-4 w-4 mr-2" /> Whiteboard
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="code" className="p-0 m-0">
                                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Button variant="ghost" size="sm" className="text-xs">
                                                <GitBranch className="h-3.5 w-3.5 mr-1" /> main
                                            </Button>
                                            <Clock className="h-4 w-4 text-zinc-400" />
                                            <span>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        disabled={isUploading}
                                                    >
                                                        <Upload className="h-4 w-4 mr-1" /> {isUploading ? "Uploading..." : "Upload"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={handleOpenFilePicker}>
                                                        <FileCode className="h-4 w-4 mr-2" />
                                                        Upload Files
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={handleOpenFolderPicker}>
                                                        <Folder className="h-4 w-4 mr-2" />
                                                        Upload Folder
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={handleDownload}
                                            >
                                                <Download className="h-4 w-4 mr-1" /> Download
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Hidden file inputs */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="*"
                                    />
                                    <input
                                        ref={folderInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        webkitdirectory="true"
                                    />

                                    <div className="p-4">
                                        {/* File list - Real data from backend */}
                                        {fileRows && fileRows.length > 0 ? (
                                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden mb-4">
                                                <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center gap-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    <div className="flex-1">Name</div>
                                                    <div className="w-12 text-right">Size</div>
                                                    <div className="w-24 text-right">Modified</div>
                                                </div>
                                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                                    {fileRows.map((file: FileItemData) => (
                                                        <FileItem
                                                            key={file.id}
                                                            name={file.name}
                                                            type={file.item_type}
                                                            size={formatFileSize(file.size)}
                                                            lastUpdated={file.uploaded_at ? formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true }) : "unknown"}
                                                            depth={(file as any).depth || 0}
                                                            fileId={file.id}
                                                            isAdmin={isAdmin}
                                                            onDelete={handleOpenDeleteDialog}
                                                            onFolderClick={handleFolderClick}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-md mb-4 p-4 text-center text-zinc-500">
                                                No files uploaded yet
                                            </div>
                                        )}

                                        {/* Mock data - commented out for reference */}
                                        {/* 
                                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-md mb-4">
                                            <div className="bg-zinc-50 dark:bg-zinc-900 p-3 border-b border-zinc-200 dark:border-zinc-800">
                                                <div className="flex items-center gap-2">
                                                    <Folder className="h-4 w-4 text-zinc-500" />
                                                    <span className="text-sm font-medium">src</span>
                                                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                                                    <span className="text-sm font-medium">components</span>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                                <FileItem name="ProductCard.jsx" type="file" size="4.2 KB" lastUpdated="2 days ago" />
                                                <FileItem name="ProductList.jsx" type="file" size="3.8 KB" lastUpdated="2 days ago" />
                                                <FileItem name="ShoppingCart.jsx" type="file" size="5.1 KB" lastUpdated="3 days ago" />
                                                <FileItem name="Checkout.jsx" type="file" size="6.3 KB" lastUpdated="5 days ago" />
                                                <FileItem name="UserProfile.jsx" type="file" size="3.5 KB" lastUpdated="1 week ago" />
                                            </div>
                                        </div>
                                        */}

                                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-md">
                                            <div className="bg-zinc-50 dark:bg-zinc-900 p-3 border-b border-zinc-200 dark:border-zinc-800">
                                                <h3 className="font-medium">README.md</h3>
                                            </div>
                                            <div className="p-4 prose dark:prose-invert max-w-none prose-sm">
                                                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(project.readme) }} />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="issues" className="p-4">
                                    <Link to={`/${loggedInUser.username}/project/${project.slug}/issues/new`}>
                                        <Button  className="m-4 flex justify-center">New Issue</Button>
                                    </Link>
                                    <div className="space-y-4">
                                        {issues.length === 0 && (
                                            <p className="text-sm text-zinc-500">No issues found.</p>
                                        )}
                                        {issues.map((issue) => (
                                            <IssueItem
                                            key={issue.id}
                                            title={issue.title}
                                            number={issue.id}
                                            status={issue.status}
                                            author={issue.created_by_username || issue.created_by || "unknown"}
                                            createdAt={formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="pull-requests" className="p-4">
                                    <Link to={`/${loggedInUser.username}/project/${project.slug}/pull-request`}>
                                        <Button  className="m-4 flex justify-center">New Pull Request</Button>
                                    </Link>
                                    <div className="space-y-4">
                                        {pullRequests.length === 0 && (
                                            <p className="text-sm text-zinc-500">No pull requests found.</p>
                                        )}
                                        {pullRequests.map((pr) => (
                                            <PullRequestItem
                                                key={pr.id}
                                                title={pr.message || `Merge ${pr.from_branch} into ${pr.to_branch}`}
                                                number={pr.id}
                                                status={pr.status}
                                                author={pr.created_by || "unknown"}
                                                createdAt={pr.created_at ? formatDistanceToNow(new Date(pr.created_at), { addSuffix: true }) : "unknown"}
                                                comments={0}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="discussions" className="p-4">
                                    <div className="space-y-4">
                                        {discussions.length === 0 && (
                                            <div className="text-center py-10">
                                                <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                                                <p className="text-zinc-500 dark:text-zinc-400">Discussions will appear here when they are created.</p>
                                            </div>
                                        )}
                                        {discussions.map((thread) => (
                                            <div key={thread.id} className="border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="h-4 w-4 text-emerald-500" />
                                                            <h3 className="font-medium">{thread.title}</h3>
                                                            <Badge variant="outline">#{thread.id}</Badge>
                                                        </div>
                                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                                            Started by @{thread.created_by || "unknown"} {thread.created_at ? formatDistanceToNow(new Date(thread.created_at), { addSuffix: true }) : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="tasks" className="p-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-medium">Sprint Tasks</h3>

                                            <Button onClick={() => setOpen(!open)} type="button">
                                                <Plus className="h-4 w-4 mr-2" /> Add Task
                                            </Button>
                                            {open && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                                <CreateTaskModal
                                                    isOpen={open}
                                                    onClose={() => setOpen(false)}
                                                    onCreateTask={(taskData) => {
                                                        console.log("New Task Created:", taskData);
                                                        // You can call API here to save task
                                                    }}
                                                    projectData={project}
                                                    />
                                                </div>
                                            )}
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center text-emerald-500">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                                In Progress
                                            </h4>
                                            <div className="space-y-2">
                                                {project.tasks
                                                    .filter((task) => task.status === "in_progress")
                                                    .map((task) => (
                                                        <TaskItem key={task.id} task={task} />
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center text-amber-500">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                                To Do
                                            </h4>
                                            <div className="space-y-2">
                                                {project.tasks
                                                    .filter((tasks) => tasks.status === "to_do")
                                                    .map((tasks) => (
                                                        <TaskItem key={tasks.id} task={tasks} />
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center text-purple-500">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                                Review
                                            </h4>
                                            <div className="space-y-2">
                                                {project.tasks
                                                    .filter((tasks) => tasks.status === "review")
                                                    .map((tasks) => (
                                                        <TaskItem key={tasks.id} task={tasks} />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    {tasks.length === 0 && (
                                        <p className="text-sm text-zinc-500">No tasks found.</p>
                                    )}
                                </TabsContent>

                                <TabsContent value="whiteboard" className="p-4">
                                    <div className="text-center py-10">
                                        <h3 className="text-lg font-medium mb-2">Collaborative Whiteboard</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                                            Plan, brainstorm, and visualize ideas with your team in real-time.
                                        </p>
                                        <Link to={`/${loggedInUser.username}/project/${project.slug}/whiteboard/${project.whiteboard_id}`}>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600">Open Whiteboard</Button>
                                        </Link>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 space-y-6">
                        <TaskAllocation tasks={project.tasks} sprintName="Current sprint tasks" />

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="flex items-center gap-1">
                                            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                                            {project.language}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Star className="h-4 w-4" />
                                            {project.stars}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            {project.watchers}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitBranch className="h-4 w-4" />
                                            {project.forks}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Team Members</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(project.members) && project.members.length > 0 ? (
                                            project.members.map((member: any) => {
                                                const name = member.username || member.email || "?";
                                                const initials = name
                                                    .split(/[^A-Za-z0-9]+/)
                                                    .filter(Boolean)
                                                    .map((s) => s[0].toUpperCase())
                                                    .slice(0, 2)
                                                    .join("");
                                                return (
                                                    <div key={member.id} className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="text-sm">
                                                            <div className="font-medium">{member.username || member.email}</div>
                                                            <div className="text-xs text-zinc-500">{member.role}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="text-sm text-zinc-500">No team members yet</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Last Updated</h4>
                                    <p className="text-sm">{project.lastUpdated}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Real activity data from backend */}
                                {recentActivities && recentActivities.length > 0 ? (
                                    recentActivities.map((activity: any) => (
                                        <ActivityItem
                                            key={activity.id}
                                            user={{ name: activity.user || "Unknown", initials: (activity.user || "?")[0].toUpperCase() }}
                                            action={activity.action || ""}
                                            time={activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : "unknown"}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-500">No recent activity</p>
                                )}

                                {/* Mock activity data - commented out for reference */}
                                {/*
                                <ActivityItem user={{ name: "Alex Kim", initials: "AK" }} action="pushed to main" time="2 hours ago" />
                                <ActivityItem
                                    user={{ name: "Maria Torres", initials: "MT" }}
                                    action="opened issue #42"
                                    time="2 days ago"
                                />
                                <ActivityItem
                                    user={{ name: "John Doe", initials: "JD" }}
                                    action="created pull request #15"
                                    time="3 days ago"
                                />
                                */}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Languages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {/* Real language data from backend */}
                                    {languageRows && languageRows.length > 0 ? (
                                        languageRows.map((lang: any, idx: number) => {
                                            const percentage = typeof lang.percentage === 'number' ? lang.percentage : 0
                                            const colors = ["bg-yellow-500", "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500"]
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm">{lang.name || `Language ${idx + 1}`}</span>
                                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">{percentage.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                                        <div className={`${colors[idx % colors.length]} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="text-sm text-zinc-500">No language data available</p>
                                    )}
                                </div>

                                {/* Mock language data - commented out for reference */}
                                {/*
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">JavaScript</span>
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">65%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">CSS</span>
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">20%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">HTML</span>
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">15%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                                    </div>
                                </div>
                                */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmation.isOpen} onOpenChange={handleCloseDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete File/Folder</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. To confirm, please type the name of the file below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium mb-2">File name to delete:</p>
                            <p className="text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
                                {deleteConfirmation.fileName}
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="confirmDelete">Type the file name to confirm:</Label>
                            <Input
                                id="confirmDelete"
                                value={deleteConfirmation.fileNameInput}
                                onChange={(e) =>
                                    setDeleteConfirmation({
                                        ...deleteConfirmation,
                                        fileNameInput: e.target.value,
                                    })
                                }
                                placeholder={deleteConfirmation.fileName}
                                className="mt-1"
                                disabled={isDeleting}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCloseDeleteDialog}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={
                                isDeleting ||
                                deleteConfirmation.fileNameInput.trim() !== deleteConfirmation.fileName
                            }
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function FileItem({ 
    name, 
    type, 
    size, 
    lastUpdated, 
    depth = 0,
    fileId,
    isAdmin,
    onDelete,
    onFolderClick
}: { 
    name: string; 
    type: string; 
    size: string; 
    lastUpdated: string; 
    depth?: number;
    fileId?: number;
    isAdmin?: boolean;
    onDelete?: (fileId: number, fileName: string) => void;
    onFolderClick?: (fileId: number, folderName: string) => void;
}) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div 
            className={`flex items-center justify-between px-3 py-2.5 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/70 transition-colors border-b border-zinc-100 dark:border-zinc-800 ${type === "folder" ? "cursor-pointer font-medium" : ""}`}
            style={{ paddingLeft: `${16 + depth * 16}px` }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => type === "folder" && fileId && onFolderClick?.(fileId, name)}
        >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {type === "folder" ? (
                    <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                    <FileCode className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                )}
                <span className={`text-sm truncate ${type === "folder" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {name}
                </span>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                {size && size !== "0 B" && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 w-12 text-right">{size}</span>
                )}
                <span className="text-xs text-zinc-500 dark:text-zinc-400 w-24 text-right">{lastUpdated}</span>
                {isAdmin && isHovering && fileId && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(fileId, name);
                        }}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors flex-shrink-0"
                        title="Delete file"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

function IssueItem({ title, number, status, author, createdAt}) {
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-emerald-500" />
                        <h3 className="font-medium">{title}</h3>
                        <Badge variant="outline">#{number}</Badge>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Opened by @{author} {createdAt}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={status === "open" ? "secondary" : "outline"}>{status}</Badge>
                    
                </div>
            </div>
        </div>
    )
}

function PullRequestItem({ title, number, status, author, createdAt, comments }) {
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <GitPullRequest className="h-4 w-4 text-purple-500" />
                        <h3 className="font-medium">{title}</h3>
                        <Badge variant="outline">#{number}</Badge>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Opened by @{author} {createdAt}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={status === "open" ? "secondary" : "outline"}>{status}</Badge>
                    <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                        <MessageSquare className="h-4 w-4" />
                        {comments}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ActivityItem({ user, action, time }) {
    return (
        <div className="flex gap-3">
            <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm">
                    <span className="font-medium">{user.name}</span> {action}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{time}</p>
            </div>
        </div>
    )
}

function TaskItem({ task }) {
    const statusColors = {
        "In Progress": "border-l-emerald-500",
        "To Do": "border-l-amber-500",
        Review: "border-l-purple-500",
        Done: "border-l-blue-500",
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
        <div className={`p-3 rounded-md border-l-4 ${statusColors[task.status]} bg-white dark:bg-zinc-800 shadow-sm`}>
            <h3 className="font-medium text-sm">{task.title}</h3>
            <div className="flex justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[8px]">{task.assign_to}</AvatarFallback>
                    </Avatar>
                    {task.assign_to}
                </div>
                <div>Due: {task.deadline}</div>
            </div>
        </div>
    )
}

// Simple markdown to HTML converter (in a real app, you'd use a proper markdown library)
function markdownToHtml(markdown?: string | null) {
    if (!markdown) return ""; // safely handle null/undefined

    let html = markdown
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gm, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
        .replace(/\n/gm, "<br>");

    // Handle code blocks
    html = html.replace(/```([\s\S]*?)```/gm, (match, p1) => `<pre><code>${p1.trim()}</code></pre>`);

    return html;
}

