import {Link} from "react-router-dom"
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
    Clock,
    MessageSquare,
    GitCommit,
    GitPullRequest,
    AlertCircle,
    Trello,
    Calendar,
    Plus,
    Settings,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { TaskAllocation } from "../components/task-allocation"
import { CreateTaskModal } from "../components/createtask"
import { useParams } from "react-router-dom";
import { fetchProjectData } from "../routes/projects"
import { useEffect, useState } from "react"

export default function ProjectPage() {
    // In a real app, we would fetch the project data based on the ID
    //const projectId = params.id
    const [loading, setLoading] = useState(true);
    const { id: projectId } = useParams();
    const [issues, setIssues] = useState<any[]>([])
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    const [open, setOpen] = useState(false);

    const [project, setProject] = useState<any>({
        project_id: "",      
        name: "",
        description: "",
        visibility: "private",
        languages: "",     
        branch_count: 0,       
        stars: 0,
        watchers: 0,
        forks: 0,
        issues_count: 0,
        pull_requests_count: 0,
        progress: 0,    
        contributors: [],    
        updated_at: "",        
        created_at: "",         
        slug: "",           
        logo: "",           
        readme: "",
        status: "active", 
        whiteboard_id: "",
        chat_id: "",
  });
    

    useEffect( () => {
        if (projectId) {
            setLoading(true);
            fetchProjectData(projectId)
            .then((data) => {
                console.log(data);
                setProject(data);
                setIssues(data.issues || []);
            })
            .catch((err) => {
                console.error("Error fetching project data:", err);
            }).finally(()=> setLoading(false));
        }
    }, [projectId]);

    useEffect(() => {
    const fetchIssues = async () => {
        try {
            const res = await fetch(`/api/projects/${project.slug}/issues/`)
            const data = await res.json()
            setIssues(data)
        } catch (err) {
            console.error("Error fetching issues:", err)
        }
    }
        if (project.slug) fetchIssues()
    }, [project.slug])

    if (loading) return <p>Loading project...</p>;
    if (!project) return <p>Project not found</p>;


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
    const tasks = [
        {
            id: "1",
            title: "Implement dropdown component",
            status: "In Progress",
            assignee: {
                name: "John Doe",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: "JD",
            },
            dueDate: "Tomorrow",
        },
        {
            id: "2",
            title: "Fix responsive layout issues",
            status: "To Do",
            assignee: {
                name: "Sarah Liu",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: "SL",
            },
            dueDate: "3 days",
        },
        {
            id: "3",
            title: "Update documentation",
            status: "Review",
            assignee: {
                name: "Mike Kim",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: "MK",
            },
            dueDate: "2 days",
        },
        {
            id: "4",
            title: "Add unit tests for API",
            status: "Done",
            assignee: {
                name: "Alex Kim",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: "AK",
            },
            dueDate: "Yesterday",
        },
    ]

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
                    <div className="flex-1">
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
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        <GitBranch className="h-3.5 w-3.5 mr-1" /> main
                                    </Button>
                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                        <GitBranch className="h-3.5 w-3.5 mr-1" /> {project.branch_count}
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                        <GitCommit className="h-3.5 w-3.5 mr-1" /> {project.commit_count}
                                    </div>
                                    <div>
                                        <Link to={`/${loggedInUser.username}/project/${project.slug}/settings`}>
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-300">
                                                <Settings className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
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
                                            <Button variant="outline" size="sm">
                                                <Share2 className="h-4 w-4 mr-1" /> Clone
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" /> Download
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4">
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
                                        {issues.map((issue) => (
                                            <IssueItem
                                            key={issue.id}
                                            title={issue.title}
                                            number={issue.id}
                                            status={issue.status}
                                            author={issue.created_by_username}
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
                                        <PullRequestItem
                                            title="Implement user authentication"
                                            number={15}
                                            status="open"
                                            author="johndoe"
                                            createdAt="1 day ago"
                                            comments={3}
                                        />
                                        <PullRequestItem
                                            title="Add product search functionality"
                                            number={14}
                                            status="open"
                                            author="racheljohnson"
                                            createdAt="3 days ago"
                                            comments={2}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="discussions" className="p-4">
                                    <div className="text-center py-10">
                                        <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                                            Start a new discussion to ask questions or share ideas.
                                        </p>
                                        <Button>New Discussion</Button>
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
                                                {tasks
                                                    .filter((task) => task.status === "In Progress")
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
                                                {tasks
                                                    .filter((task) => task.status === "To Do")
                                                    .map((task) => (
                                                        <TaskItem key={task.id} task={task} />
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center text-purple-500">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                                Review
                                            </h4>
                                            <div className="space-y-2">
                                                {tasks
                                                    .filter((task) => task.status === "Review")
                                                    .map((task) => (
                                                        <TaskItem key={task.id} task={task} />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
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
                        <TaskAllocation tasks={tasks} sprintName="Current sprint tasks" />

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
                                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Contributors</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.contributors.map((contributor, index) => (
                                            <Avatar key={index} className="h-8 w-8">
                                                <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.initials} />
                                                <AvatarFallback>{contributor.initials}</AvatarFallback>
                                            </Avatar>
                                        ))}
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Languages</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

function FileItem({ name, type, size, lastUpdated }) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-zinc-500" />
                <span className="text-sm">{name}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{size}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lastUpdated}
                </span>
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

    return (
        <div className={`p-3 rounded-md border-l-4 ${statusColors[task.status]} bg-white dark:bg-zinc-800 shadow-sm`}>
            <h3 className="font-medium text-sm">{task.title}</h3>
            <div className="flex justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[8px]">{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    {task.assignee.name}
                </div>
                <div>Due: {task.dueDate}</div>
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
