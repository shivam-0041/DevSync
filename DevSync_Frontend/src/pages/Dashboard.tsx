import { Link } from "react-router-dom"
import {
  Search,
  GitBranch,
  Star,
  Clock,
  Bell,
  Settings,
  Code,
  Users,
  Folder,
  Sparkles,
  Zap,
  Bookmark,
  Flame,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { TaskAllocation } from "../components/task-allocation"
import { ProjectCard } from "../components/project-card"
import { AIAssistant } from "../components/ai-assistant"
import { QuickActions, QuickActionsHeader } from "../components/quick-actions"
import { TeamMemberList } from "../components/team-member-list"
import { DevToolsSidebar } from "../components/dev-tools-sidebar"
import ProjectPage from "./ProjectPage"
export default function Dashboard() {
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

  // Sample team members data
  const teamMembers = [
    {
      id: "1",
      name: "John Doe",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
      status: "online",
    },
    {
      id: "2",
      name: "Sarah Liu",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SL",
      status: "online",
    },
    {
      id: "3",
      name: "Mike Kim",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MK",
      status: "away",
      lastActive: "10 min ago",
    },
    {
      id: "4",
      name: "Alex Kim",
      role: "DevOps Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AK",
      status: "offline",
      lastActive: "2 hours ago",
    },
    {
      id: "5",
      name: "Rachel Johnson",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RJ",
      status: "dnd",
      lastActive: "5 min ago",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Code className="h-6 w-6 text-emerald-400" />
                <span className="font-bold text-white">DevSync</span>
              </Link>
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-zinc-300">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800">
                  <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <div className="max-h-[300px] overflow-auto">
                    <NotificationItem
                      title="New pull request"
                      description="Alex Kim requested a review on 'Add product search functionality'"
                      time="10 minutes ago"
                      read={false}
                    />
                    <NotificationItem
                      title="Task assigned"
                      description="Sarah Liu assigned you to 'Fix responsive layout issues'"
                      time="1 hour ago"
                      read={false}
                    />
                    <NotificationItem
                      title="Comment on issue #42"
                      description="Mike Kim commented: 'I've found a solution for this'"
                      time="3 hours ago"
                      read={false}
                    />
                    <NotificationItem
                      title="Project invitation"
                      description="You've been invited to collaborate on 'Data Visualization'"
                      time="Yesterday"
                      read={true}
                    />
                    <NotificationItem
                      title="Deployment successful"
                      description="E-commerce Platform was deployed successfully"
                      time="2 days ago"
                      read={true}
                    />
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="justify-center text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 cursor-pointer">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
               </DropdownMenu>
               <Link to="/account/settings">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-300">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-zinc-700 text-zinc-300">JD</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-80 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="space-y-1">
                  <Link to="/dashboard" className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md text-white">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">My Projects</span>
                  </Link>
                  <Link
                    to="/dashboard/explore"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-sm font-medium">Explore</span>
                  </Link>
                  <Link
                    to="/dashboard/starred"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Starred</span>
                  </Link>
                  <Link
                    to="/dashboard/teams"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Teams</span>
                  </Link>
                  <Link
                    to="/dashboard/activity"
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Activity</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <TaskAllocation tasks={tasks} />

            <TeamMemberList members={teamMembers} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">My Projects</h1>
              <QuickActionsHeader />
            </div>

            <Tabs defaultValue="all" className="text-white">
              <TabsList className="mb-6 bg-zinc-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
                  All Projects
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-zinc-700">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="archived" className="data-[state=active]:bg-zinc-700">
                  Archived
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="archived">
                <div className="text-center py-10">
                  <p className="text-zinc-500">No archived projects</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* AI Assistant Section */}
            <div className="mt-10">
              <AIAssistant />
            </div>

            {/* For You Section */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 flex items-center text-white">
                <Sparkles className="h-5 w-5 mr-2 text-amber-400" /> For You
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-white">
                      <Zap className="h-5 w-5 mr-2 text-amber-400" /> Recommended Projects
                    </CardTitle>
                    <CardDescription className="text-zinc-400">Based on your interests and activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendedProjects.map((project, index) => (
                      <RecommendedItem
                        key={index}
                        title={project.name}
                        description={project.description}
                        icon={<GitBranch className="h-4 w-4" />}
                        stats={`${project.stars} stars • ${project.language}`}
                      />
                    ))}
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                    >
                      View More Recommendations
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-white">
                      <Flame className="h-5 w-5 mr-2 text-orange-400" /> Trending Tools
                    </CardTitle>
                    <CardDescription className="text-zinc-400">Popular open source tools this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trendingTools.map((tool, index) => (
                      <RecommendedItem
                        key={index}
                        title={tool.name}
                        description={tool.description}
                        icon={<Bookmark className="h-4 w-4" />}
                        stats={`${tool.category} • ${tool.trending}% growth`}
                      />
                    ))}
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                    >
                      Explore Trending Tools
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs mx-auto text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
                  >
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Quick Actions */}
      <QuickActions />

      {/* Dev Tools Sidebar */}
      <DevToolsSidebar />
    </div>
  )
}

function ActivityItem({ activity }) {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-zinc-700 text-zinc-300">{activity.user.initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-white">
          <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
          <span className="font-medium">{activity.project}</span>
        </p>
        <p className="text-xs text-zinc-500">{activity.time}</p>
      </div>
    </div>
  )
}

function NotificationItem({ title, description, time, read }) {
  return (
    <div className={`px-4 py-3 hover:bg-zinc-800 ${!read ? "bg-zinc-800/50" : ""}`}>
      <div className="flex items-start gap-2">
        {!read && <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
        <div className={`flex-1 ${!read ? "font-medium" : ""}`}>
          <p className="text-sm text-white">{title}</p>
          <p className="text-xs text-zinc-400 mt-1">{description}</p>
          <p className="text-xs text-zinc-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}

function RecommendedItem({ title, description, icon, stats }) {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-zinc-800 rounded-md">
      <div className="mt-0.5 text-zinc-400">{icon}</div>
      <div>
        <h4 className="font-medium text-sm text-white">{title}</h4>
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
        <p className="text-xs text-zinc-500 mt-1">{stats}</p>
      </div>
    </div>
  )
}

// Sample data
const projects = [
  {
    id: "1",
    name: "Project Alpha",
    description: "Modern web application framework",
    visibility: "public",
    language: "TypeScript",
    languageColor: "emerald-500",
    branches: 8,
    stars: 24,
    progress: 75,
    dueDate: "5 days",
    contributors: ["JD", "AK", "TM"],
    lastUpdated: "2 days ago",
    comments: 12,
  },
  {
    id: "2",
    name: "AI Image Generator",
    description: "Generate images using machine learning models",
    visibility: "private",
    language: "Python",
    languageColor: "blue-500",
    branches: 2,
    stars: 5,
    progress: 45,
    dueDate: "2 weeks",
    contributors: ["JD", "LM"],
    lastUpdated: "5 days ago",
    comments: 3,
  },
  {
    id: "3",
    name: "Mobile App",
    description: "Cross-platform mobile application using React Native",
    visibility: "public",
    language: "TypeScript",
    languageColor: "emerald-500",
    branches: 3,
    stars: 8,
    progress: 30,
    dueDate: "1 month",
    contributors: ["JD", "AK", "RJ", "MT"],
    lastUpdated: "1 week ago",
    comments: 7,
  },
  {
    id: "4",
    name: "Design System",
    description: "Component library for consistent UI design",
    visibility: "public",
    language: "TypeScript",
    languageColor: "emerald-500",
    branches: 2,
    stars: 15,
    progress: 90,
    dueDate: "3 days",
    contributors: ["JD", "LM", "AK"],
    lastUpdated: "2 weeks ago",
    comments: 5,
  },
  {
    id: "5",
    name: "API Gateway",
    description: "Microservices API gateway with authentication",
    visibility: "private",
    language: "Go",
    languageColor: "cyan-500",
    branches: 1,
    stars: 3,
    progress: 60,
    dueDate: "10 days",
    contributors: ["JD", "MT"],
    lastUpdated: "3 weeks ago",
    comments: 2,
  },
  {
    id: "6",
    name: "Data Visualization",
    description: "Interactive data visualization dashboard",
    visibility: "public",
    language: "JavaScript",
    languageColor: "yellow-500",
    branches: 2,
    stars: 7,
    progress: 20,
    dueDate: "3 weeks",
    contributors: ["JD", "AK", "RJ"],
    lastUpdated: "1 month ago",
    comments: 4,
  },
]

const activities = [
  {
    user: { name: "Alex Kim", initials: "AK" },
    action: "pushed to main in",
    project: "Project Alpha",
    time: "2 hours ago",
  },
  {
    user: { name: "Maria Torres", initials: "MT" },
    action: "created a pull request in",
    project: "Mobile App",
    time: "5 hours ago",
  },
  {
    user: { name: "Liam Miller", initials: "LM" },
    action: "commented on issue #42 in",
    project: "AI Image Generator",
    time: "Yesterday",
  },
  {
    user: { name: "Rachel Johnson", initials: "RJ" },
    action: "merged a pull request in",
    project: "Data Visualization",
    time: "2 days ago",
  },
]

const recommendedProjects = [
  {
    name: "React Component Library",
    description: "A collection of reusable React components with TypeScript support",
    stars: "3.2k",
    language: "TypeScript",
  },
  {
    name: "GraphQL API Boilerplate",
    description: "Start your GraphQL API quickly with this boilerplate",
    stars: "1.8k",
    language: "JavaScript",
  },
  {
    name: "ML Model Deployment",
    description: "Tools for deploying machine learning models to production",
    stars: "4.5k",
    language: "Python",
  },
]

const trendingTools = [
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for rapid UI development",
    category: "Frontend",
    trending: 35,
  },
  {
    name: "Prisma ORM",
    description: "Next-generation ORM for Node.js and TypeScript",
    category: "Backend",
    trending: 42,
  },
  {
    name: "Rust Web Framework",
    description: "High-performance web framework written in Rust",
    category: "Backend",
    trending: 78,
  },
]
