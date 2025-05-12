//"use client"

//import { useState } from "react"
//import { Link } from "react-router-dom"
//import {
//    Code,
//    Search,
//    Filter,
//    Star,
//    GitBranch,
//    Flame,
//    TrendingUp,
//    Clock,
//    Bookmark,
//    ChevronDown,
//    ArrowUpRight,
//    Zap,
//    Sparkles,
//} from "lucide-react"
//import { Button } from "../components/ui/button"
//import { Input } from "../components/ui/input"
//import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
//import { Badge } from "../components/ui/badge"
//import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
//import { Checkbox } from "../components/ui/checkbox"
//import { Label } from "../components/ui/label"
//import { Separator } from "../components/ui/separator"
//import { ScrollArea } from "../components/ui/scroll-area"
//import { DevToolsSidebar } from "../components/dev-tools-sidebar"

//export default function ExplorePage() {
//    const [searchQuery, setSearchQuery] = useState("")

//    return (
//        <div className="min-h-screen bg-zinc-950">
//            <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
//                <div className="container mx-auto px-4 py-3">
//                    <div className="flex items-center justify-between">
//                        <div className="flex items-center gap-10">
//                            <Link to="/" className="flex items-center gap-2">
//                                <Code className="h-6 w-6 text-emerald-400" />
//                                <span className="font-bold text-white">DevSync</span>
//                            </Link>
//                        </div>
//                        <div className="flex items-center gap-4">
//                            <Link to="/dashboard">
//                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
//                                    Dashboard
//                                </Button>
//                            </Link>
//                            <Link to="/profile">
//                                <Avatar>
//                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
//                                    <AvatarFallback className="bg-zinc-700 text-zinc-300">JD</AvatarFallback>
//                                </Avatar>
//                            </Link>
//                        </div>
//                    </div>
//                </div>
//            </header>

//            <main className="container mx-auto px-4 py-8">
//                <div className="flex flex-col gap-8">
//                    <div className="text-center max-w-3xl mx-auto">
//                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Discover Amazing Projects</h1>
//                        <p className="text-zinc-400 text-lg mb-8">
//                            Explore open source projects, collaborate with developers, and find your next inspiration
//                        </p>
//                        <div className="relative max-w-2xl mx-auto">
//                            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
//                            <Input
//                                placeholder="Search projects, libraries, tools..."
//                                className="pl-10 py-6 text-lg bg-zinc-800 border-zinc-700 text-white"
//                                value={searchQuery}
//                                onChange={(e) => setSearchQuery(e.target.value)}
//                            />
//                            <Button className="absolute right-1 top-1 bg-emerald-500 hover:bg-emerald-600">Search</Button>
//                        </div>
//                    </div>

//                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                        {/* Filters Sidebar */}
//                        <div className="space-y-6">
//                            <Card className="bg-zinc-900 border-zinc-800">
//                                <CardHeader className="pb-2">
//                                    <CardTitle className="text-white flex items-center gap-2">
//                                        <Filter className="h-4 w-4" /> Filters
//                                    </CardTitle>
//                                </CardHeader>
//                                <CardContent className="space-y-4">
//                                    <div className="space-y-2">
//                                        <Label className="text-zinc-300">Language</Label>
//                                        <Select defaultValue="all">
//                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
//                                                <SelectValue placeholder="All Languages" />
//                                            </SelectTrigger>
//                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
//                                                <SelectItem value="all">All Languages</SelectItem>
//                                                <SelectItem value="javascript">JavaScript</SelectItem>
//                                                <SelectItem value="typescript">TypeScript</SelectItem>
//                                                <SelectItem value="python">Python</SelectItem>
//                                                <SelectItem value="java">Java</SelectItem>
//                                                <SelectItem value="go">Go</SelectItem>
//                                                <SelectItem value="rust">Rust</SelectItem>
//                                            </SelectContent>
//                                        </Select>
//                                    </div>

//                                    <div className="space-y-2">
//                                        <Label className="text-zinc-300">Sort By</Label>
//                                        <Select defaultValue="trending">
//                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
//                                                <SelectValue placeholder="Sort By" />
//                                            </SelectTrigger>
//                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
//                                                <SelectItem value="trending">Trending</SelectItem>
//                                                <SelectItem value="stars">Most Stars</SelectItem>
//                                                <SelectItem value="recent">Recently Updated</SelectItem>
//                                                <SelectItem value="forks">Most Forks</SelectItem>
//                                            </SelectContent>
//                                        </Select>
//                                    </div>

//                                    <Separator className="bg-zinc-800" />

//                                    <div className="space-y-2">
//                                        <Label className="text-zinc-300">Project Type</Label>
//                                        <div className="space-y-2">
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="libraries" defaultChecked className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="libraries"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Libraries & Frameworks
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="tools" defaultChecked className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="tools"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Tools & Utilities
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="apps" defaultChecked className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="apps"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Applications
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="templates" defaultChecked className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="templates"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Templates & Boilerplates
//                                                </label>
//                                            </div>
//                                        </div>
//                                    </div>

//                                    <Separator className="bg-zinc-800" />

//                                    <div className="space-y-2">
//                                        <Label className="text-zinc-300">Features</Label>
//                                        <div className="space-y-2">
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="beginner-friendly" className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="beginner-friendly"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Beginner Friendly
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="help-wanted" className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="help-wanted"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Help Wanted
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="active-maintainer" className="data-[state=checked]:bg-emerald-500" />
//                                                <label
//                                                    htmlFor="active-maintainer"
//                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Active Maintainer
//                                                </label>
//                                            </div>
//                                        </div>
//                                    </div>

//                                    <Separator className="bg-zinc-800" />

//                                    <div className="space-y-2">
//                                        <Label className="text-zinc-300">Categories</Label>
//                                        <ScrollArea className="h-40">
//                                            <div className="space-y-2 pr-4">
//                                                {[
//                                                    "Web Development",
//                                                    "Mobile Development",
//                                                    "Data Science",
//                                                    "Machine Learning",
//                                                    "DevOps",
//                                                    "UI/UX",
//                                                    "Game Development",
//                                                    "Blockchain",
//                                                    "IoT",
//                                                    "Security",
//                                                    "API",
//                                                    "Testing",
//                                                    "Documentation",
//                                                ].map((category) => (
//                                                    <div key={category} className="flex items-center space-x-2">
//                                                        <Checkbox id={category} className="data-[state=checked]:bg-emerald-500" />
//                                                        <label
//                                                            htmlFor={category}
//                                                            className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                        >
//                                                            {category}
//                                                        </label>
//                                                    </div>
//                                                ))}
//                                            </div>
//                                        </ScrollArea>
//                                    </div>

//                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Apply Filters</Button>
//                                </CardContent>
//                            </Card>

//                            <Card className="bg-zinc-900 border-zinc-800">
//                                <CardHeader className="pb-2">
//                                    <CardTitle className="text-white flex items-center gap-2">
//                                        <Bookmark className="h-4 w-4" /> Collections
//                                    </CardTitle>
//                                </CardHeader>
//                                <CardContent className="space-y-3">
//                                    <div className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 cursor-pointer">
//                                        <p className="text-zinc-300 font-medium">Frontend Essentials</p>
//                                        <p className="text-xs text-zinc-500">12 projects • Updated 2 days ago</p>
//                                    </div>
//                                    <div className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 cursor-pointer">
//                                        <p className="text-zinc-300 font-medium">AI & Machine Learning</p>
//                                        <p className="text-xs text-zinc-500">8 projects • Updated 1 week ago</p>
//                                    </div>
//                                    <div className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 cursor-pointer">
//                                        <p className="text-zinc-300 font-medium">DevOps Tools</p>
//                                        <p className="text-xs text-zinc-500">15 projects • Updated 3 days ago</p>
//                                    </div>
//                                    <Button variant="ghost" className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
//                                        View All Collections
//                                    </Button>
//                                </CardContent>
//                            </Card>
//                        </div>

//                        {/* Main Content */}
//                        <div className="md:col-span-3 space-y-8">
//                            <Tabs defaultValue="trending" className="w-full">
//                                <div className="flex justify-between items-center mb-4">
//                                    <TabsList className="bg-zinc-800">
//                                        <TabsTrigger value="trending" className="data-[state=active]:bg-zinc-700">
//                                            <Flame className="h-4 w-4 mr-2" /> Trending
//                                        </TabsTrigger>
//                                        <TabsTrigger value="popular" className="data-[state=active]:bg-zinc-700">
//                                            <Star className="h-4 w-4 mr-2" /> Popular
//                                        </TabsTrigger>
//                                        <TabsTrigger value="recent" className="data-[state=active]:bg-zinc-700">
//                                            <Clock className="h-4 w-4 mr-2" /> Recent
//                                        </TabsTrigger>
//                                    </TabsList>
//                                    <Select defaultValue="week">
//                                        <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
//                                            <SelectValue placeholder="Time period" />
//                                        </SelectTrigger>
//                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
//                                            <SelectItem value="day">Today</SelectItem>
//                                            <SelectItem value="week">This Week</SelectItem>
//                                            <SelectItem value="month">This Month</SelectItem>
//                                            <SelectItem value="year">This Year</SelectItem>
//                                        </SelectContent>
//                                    </Select>
//                                </div>

//                                <TabsContent value="trending" className="space-y-6 mt-0">
//                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                        {trendingProjects.map((project, index) => (
//                                            <ProjectCard key={index} project={project} />
//                                        ))}
//                                    </div>
//                                </TabsContent>

//                                <TabsContent value="popular" className="space-y-6 mt-0">
//                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                        {popularProjects.map((project, index) => (
//                                            <ProjectCard key={index} project={project} />
//                                        ))}
//                                    </div>
//                                </TabsContent>

//                                <TabsContent value="recent" className="space-y-6 mt-0">
//                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                        {recentProjects.map((project, index) => (
//                                            <ProjectCard key={index} project={project} />
//                                        ))}
//                                    </div>
//                                </TabsContent>
//                            </Tabs>

//                            <Separator className="bg-zinc-800" />

//                            <div>
//                                <div className="flex justify-between items-center mb-6">
//                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                                        <Sparkles className="h-5 w-5 text-amber-400" /> Featured Categories
//                                    </h2>
//                                    <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
//                                        View All Categories
//                                    </Button>
//                                </div>

//                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                    {categories.map((category, index) => (
//                                        <Card key={index} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors">
//                                            <CardContent className="p-6">
//                                                <div className="flex items-center gap-3 mb-3">
//                                                    <div className="p-2 rounded-md bg-zinc-800">{category.icon}</div>
//                                                    <h3 className="text-lg font-medium text-white">{category.name}</h3>
//                                                </div>
//                                                <p className="text-sm text-zinc-400 mb-4">{category.description}</p>
//                                                <div className="flex justify-between items-center">
//                                                    <span className="text-xs text-zinc-500">{category.projectCount} projects</span>
//                                                    <Button
//                                                        variant="ghost"
//                                                        size="sm"
//                                                        className="text-emerald-400 hover:text-emerald-300 p-0 h-auto"
//                                                    >
//                                                        Explore <ChevronDown className="h-3 w-3 ml-1" />
//                                                    </Button>
//                                                </div>
//                                            </CardContent>
//                                        </Card>
//                                    ))}
//                                </div>
//                            </div>

//                            <Separator className="bg-zinc-800" />

//                            <div>
//                                <div className="flex justify-between items-center mb-6">
//                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                                        <TrendingUp className="h-5 w-5 text-emerald-400" /> Rising Stars
//                                    </h2>
//                                    <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
//                                        View More
//                                    </Button>
//                                </div>

//                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                    {risingStars.map((project, index) => (
//                                        <Card key={index} className="bg-zinc-900 border-zinc-800">
//                                            <CardContent className="p-4">
//                                                <div className="flex justify-between items-start mb-3">
//                                                    <h3 className="text-lg font-medium text-white">{project.name}</h3>
//                                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
//                                                        +{project.growth}%
//                                                    </Badge>
//                                                </div>
//                                                <p className="text-sm text-zinc-400 mb-3">{project.description}</p>
//                                                <div className="flex items-center gap-3 text-xs text-zinc-500">
//                                                    <span className="flex items-center gap-1">
//                                                        <span className={`h-2 w-2 rounded-full bg-${project.languageColor}`}></span>
//                                                        {project.language}
//                                                    </span>
//                                                    <span className="flex items-center gap-1">
//                                                        <Star className="h-3 w-3" />
//                                                        {project.stars}
//                                                    </span>
//                                                    <span className="flex items-center gap-1">
//                                                        <GitBranch className="h-3 w-3" />
//                                                        {project.forks}
//                                                    </span>
//                                                </div>
//                                            </CardContent>
//                                            <CardFooter className="border-t border-zinc-800 p-4 flex justify-between">
//                                                <div className="flex -space-x-2">
//                                                    {project.contributors.map((contributor, i) => (
//                                                        <Avatar key={i} className="h-6 w-6 border-2 border-zinc-900">
//                                                            <AvatarFallback className="text-xs bg-zinc-700">{contributor}</AvatarFallback>
//                                                        </Avatar>
//                                                    ))}
//                                                </div>
//                                                <Button
//                                                    variant="ghost"
//                                                    size="sm"
//                                                    className="text-emerald-400 hover:text-emerald-300 p-0 h-auto"
//                                                >
//                                                    View Project <ArrowUpRight className="h-3 w-3 ml-1" />
//                                                </Button>
//                                            </CardFooter>
//                                        </Card>
//                                    ))}
//                                </div>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//            </main>

//            {/* Enhanced Dev Tools Sidebar */}
//            <DevToolsSidebar />
//        </div>
//    )
//}

//function ProjectCard({ project }) {
//    return (
//        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
//            <CardContent className="p-0">
//                <div className="p-6">
//                    <div className="flex justify-between items-start mb-3">
//                        <div>
//                            <div className="flex items-center gap-2 mb-1">
//                                <h3 className="text-xl font-bold text-white">{project.name}</h3>
//                                <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
//                                    {project.visibility}
//                                </Badge>
//                            </div>
//                            <Link to={`/user/${project.owner}`} className="text-sm text-zinc-400 hover:text-emerald-400">
//                                @{project.owner}
//                            </Link>
//                        </div>
//                        <Button variant="outline" size="icon" className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
//                            <Star className="h-4 w-4" />
//                        </Button>
//                    </div>
//                    <p className="text-zinc-400 mb-4">{project.description}</p>
//                    <div className="flex flex-wrap gap-2 mb-4">
//                        {project.topics.map((topic, index) => (
//                            <Badge
//                                key={index}
//                                variant="outline"
//                                className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
//                            >
//                                {topic}
//                            </Badge>
//                        ))}
//                    </div>
//                    <div className="flex items-center gap-4 text-sm text-zinc-500">
//                        <span className="flex items-center gap-1">
//                            <span className={`h-3 w-3 rounded-full bg-${project.languageColor}`}></span>
//                            {project.language}
//                        </span>
//                        <span className="flex items-center gap-1">
//                            <Star className="h-4 w-4" />
//                            {project.stars.toLocaleString()}
//                        </span>
//                        <span className="flex items-center gap-1">
//                            <GitBranch className="h-4 w-4" />
//                            {project.forks.toLocaleString()}
//                        </span>
//                        <span>Updated {project.lastUpdated}</span>
//                    </div>
//                </div>
//            </CardContent>
//            <CardFooter className="border-t border-zinc-800 py-3 px-6 bg-zinc-800/50 flex justify-between">
//                <div className="flex -space-x-2">
//                    {project.contributors.map((contributor, index) => (
//                        <Avatar key={index} className="h-7 w-7 border-2 border-zinc-900">
//                            <AvatarFallback className="text-xs bg-zinc-700">{contributor}</AvatarFallback>
//                        </Avatar>
//                    ))}
//                    {project.contributors.length > 3 && (
//                        <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs border-2 border-zinc-900 text-zinc-400">
//                            +{project.contributorCount - 3}
//                        </div>
//                    )}
//                </div>
//                <Link to={`/project/${project.id}`}>
//                    <Button className="bg-emerald-500 hover:bg-emerald-600">View Project</Button>
//                </Link>
//            </CardFooter>
//        </Card>
//    )
//}

//// Sample data
//const trendingProjects = [
//    {
//        id: "1",
//        name: "React UI Library",
//        owner: "acme",
//        description:
//            "A comprehensive React component library with a focus on accessibility, customization, and developer experience.",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 12500,
//        forks: 1800,
//        lastUpdated: "3 days ago",
//        topics: ["react", "ui", "components", "design-system"],
//        contributors: ["JD", "AK", "MT"],
//        contributorCount: 24,
//    },
//    {
//        id: "2",
//        name: "AI Image Generator",
//        owner: "openai-community",
//        description: "Generate stunning images using state-of-the-art machine learning models with a simple API.",
//        visibility: "public",
//        language: "Python",
//        languageColor: "blue-500",
//        stars: 45600,
//        forks: 8700,
//        lastUpdated: "1 day ago",
//        topics: ["ai", "machine-learning", "image-generation", "api"],
//        contributors: ["RJ", "LM", "SK"],
//        contributorCount: 42,
//    },
//    {
//        id: "3",
//        name: "GraphQL API Toolkit",
//        owner: "graphql-team",
//        description: "A complete toolkit for building scalable GraphQL APIs with authentication, caching, and more.",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 8900,
//        forks: 1200,
//        lastUpdated: "5 days ago",
//        topics: ["graphql", "api", "typescript", "server"],
//        contributors: ["AK", "JD", "MT"],
//        contributorCount: 18,
//    },
//    {
//        id: "4",
//        name: "DevOps Automation",
//        owner: "devops-tools",
//        description: "Automate your CI/CD pipeline, infrastructure provisioning, and deployment processes.",
//        visibility: "public",
//        language: "Go",
//        languageColor: "cyan-500",
//        stars: 6700,
//        forks: 890,
//        lastUpdated: "1 week ago",
//        topics: ["devops", "ci-cd", "automation", "infrastructure"],
//        contributors: ["LM", "RJ", "SK"],
//        contributorCount: 15,
//    },
//]

//const popularProjects = [
//    {
//        id: "5",
//        name: "Next.js Starter Kit",
//        owner: "vercel-community",
//        description: "A production-ready Next.js starter kit with authentication, database, and deployment configurations.",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 32400,
//        forks: 4500,
//        lastUpdated: "2 weeks ago",
//        topics: ["next-js", "react", "starter-kit", "full-stack"],
//        contributors: ["JD", "AK", "MT"],
//        contributorCount: 28,
//    },
//    {
//        id: "6",
//        name: "Data Visualization Library",
//        owner: "data-viz",
//        description: "Create beautiful, interactive data visualizations for the web with minimal code.",
//        visibility: "public",
//        language: "JavaScript",
//        languageColor: "yellow-500",
//        stars: 18700,
//        forks: 2300,
//        lastUpdated: "3 days ago",
//        topics: ["data-visualization", "charts", "javascript", "d3"],
//        contributors: ["RJ", "LM", "SK"],
//        contributorCount: 22,
//    },
//    {
//        id: "7",
//        name: "Mobile App Framework",
//        owner: "mobile-dev",
//        description: "Build cross-platform mobile apps with native performance using a single codebase.",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 27800,
//        forks: 3600,
//        lastUpdated: "1 week ago",
//        topics: ["mobile", "cross-platform", "react-native", "typescript"],
//        contributors: ["AK", "JD", "MT"],
//        contributorCount: 35,
//    },
//    {
//        id: "8",
//        name: "Serverless Framework",
//        owner: "cloud-native",
//        description: "Deploy serverless applications to multiple cloud providers with a unified experience.",
//        visibility: "public",
//        language: "JavaScript",
//        languageColor: "yellow-500",
//        stars: 21500,
//        forks: 2800,
//        lastUpdated: "4 days ago",
//        topics: ["serverless", "cloud", "aws", "azure", "gcp"],
//        contributors: ["LM", "RJ", "SK"],
//        contributorCount: 19,
//    },
//]

//const recentProjects = [
//    {
//        id: "9",
//        name: "Blockchain Development Kit",
//        owner: "blockchain-dev",
//        description: "A comprehensive toolkit for building decentralized applications on multiple blockchain platforms.",
//        visibility: "public",
//        language: "Rust",
//        languageColor: "orange-500",
//        stars: 5600,
//        forks: 780,
//        lastUpdated: "1 day ago",
//        topics: ["blockchain", "web3", "smart-contracts", "defi"],
//        contributors: ["JD", "AK", "MT"],
//        contributorCount: 12,
//    },
//    {
//        id: "10",
//        name: "AI Code Assistant",
//        owner: "ai-tools",
//        description: "An AI-powered code assistant that helps developers write better code faster.",
//        visibility: "public",
//        language: "Python",
//        languageColor: "blue-500",
//        stars: 8900,
//        forks: 1100,
//        lastUpdated: "2 days ago",
//        topics: ["ai", "code-generation", "developer-tools", "productivity"],
//        contributors: ["RJ", "LM", "SK"],
//        contributorCount: 16,
//    },
//    {
//        id: "11",
//        name: "Design System Generator",
//        owner: "design-tools",
//        description:
//            "Generate a complete design system from your Figma designs with code components for multiple frameworks.",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 4300,
//        forks: 650,
//        lastUpdated: "3 days ago",
//        topics: ["design-system", "figma", "ui", "components"],
//        contributors: ["AK", "JD", "MT"],
//        contributorCount: 9,
//    },
//    {
//        id: "12",
//        name: "WebAssembly Runtime",
//        owner: "wasm-community",
//        description: "A high-performance WebAssembly runtime with support for multiple languages and platforms.",
//        visibility: "public",
//        language: "C++",
//        languageColor: "purple-500",
//        stars: 7200,
//        forks: 920,
//        lastUpdated: "5 days ago",
//        topics: ["webassembly", "wasm", "runtime", "performance"],
//        contributors: ["LM", "RJ", "SK"],
//        contributorCount: 14,
//    },
//]

//const categories = [
//    {
//        name: "Web Development",
//        description: "Frontend and backend frameworks, libraries, and tools for building web applications",
//        projectCount: 12500,
//        icon: <Code className="h-5 w-5 text-emerald-400" />,
//    },
//    {
//        name: "AI & Machine Learning",
//        description: "Tools and frameworks for building AI-powered applications and models",
//        projectCount: 8700,
//        icon: <Sparkles className="h-5 w-5 text-purple-400" />,
//    },
//    {
//        name: "DevOps & Cloud",
//        description: "Infrastructure, deployment, and automation tools for modern development workflows",
//        projectCount: 9300,
//        icon: <Zap className="h-5 w-5 text-blue-400" />,
//    },
//    {
//        name: "Mobile Development",
//        description: "Frameworks and tools for building native and cross-platform mobile applications",
//        projectCount: 7600,
//        icon: <Smartphone className="h-5 w-5 text-red-400" />,
//    },
//    {
//        name: "Data Science",
//        description: "Libraries and tools for data analysis, visualization, and processing",
//        projectCount: 6200,
//        icon: <BarChart className="h-5 w-5 text-yellow-400" />,
//    },
//    {
//        name: "Game Development",
//        description: "Engines, frameworks, and tools for building games across multiple platforms",
//        projectCount: 4800,
//        icon: <Gamepad className="h-5 w-5 text-orange-400" />,
//    },
//]

//const risingStars = [
//    {
//        name: "Rust Web Framework",
//        description: "High-performance web framework written in Rust",
//        language: "Rust",
//        languageColor: "orange-500",
//        stars: "5.2k",
//        forks: "420",
//        growth: 325,
//        contributors: ["JD", "AK", "MT"],
//    },
//    {
//        name: "AI Code Generator",
//        description: "Generate code from natural language descriptions",
//        language: "Python",
//        languageColor: "blue-500",
//        stars: "8.7k",
//        forks: "950",
//        growth: 280,
//        contributors: ["RJ", "LM", "SK"],
//    },
//    {
//        name: "React State Manager",
//        description: "Simple and powerful state management for React",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: "4.3k",
//        forks: "310",
//        growth: 210,
//        contributors: ["AK", "JD", "MT"],
//    },
//]

//function Smartphone(props) {
//    return (
//        <svg
//            {...props}
//            xmlns="http://www.w3.org/2000/svg"
//            width="24"
//            height="24"
//            viewBox="0 0 24 24"
//            fill="none"
//            stroke="currentColor"
//            strokeWidth="2"
//            strokeLinecap="round"
//            strokeLinejoin="round"
//        >
//            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
//            <path d="M12 18h.01" />
//        </svg>
//    )
//}

//function BarChart(props) {
//    return (
//        <svg
//            {...props}
//            xmlns="http://www.w3.org/2000/svg"
//            width="24"
//            height="24"
//            viewBox="0 0 24 24"
//            fill="none"
//            stroke="currentColor"
//            strokeWidth="2"
//            strokeLinecap="round"
//            strokeLinejoin="round"
//        >
//            <line x1="12" x2="12" y1="20" y2="10" />
//            <line x1="18" x2="18" y1="20" y2="4" />
//            <line x1="6" x2="6" y1="20" y2="16" />
//        </svg>
//    )
//}

//function Gamepad(props) {
//    return (
//        <svg
//            {...props}
//            xmlns="http://www.w3.org/2000/svg"
//            width="24"
//            height="24"
//            viewBox="0 0 24 24"
//            fill="none"
//            stroke="currentColor"
//            strokeWidth="2"
//            strokeLinecap="round"
//            strokeLinejoin="round"
//        >
//            <line x1="6" x2="10" y1="12" y2="12" />
//            <line x1="8" x2="8" y1="10" y2="14" />
//            <line x1="15" x2="15.01" y1="13" y2="13" />
//            <line x1="18" x2="18.01" y1="11" y2="11" />
//            <rect width="20" height="12" x="2" y="6" rx="2" />
//        </svg>
//    )
//}

"use client"

import { useState } from "react"
import { Search, Filter, Zap, Star, GitBranch, Users } from "lucide-react"
import { cn } from "../lib/utils"

const trendingProjects = [
    {
        id: 1,
        name: "React UI Library",
        description: "A comprehensive UI component library for React applications",
        stars: 1245,
        forks: 234,
        language: "TypeScript",
        owner: "techteam",
        contributors: 18,
        tags: ["ui", "components", "react"],
    },
    {
        id: 2,
        name: "Data Visualization Framework",
        description: "Powerful data visualization tools for web applications",
        stars: 876,
        forks: 156,
        language: "JavaScript",
        owner: "datavis",
        contributors: 12,
        tags: ["data", "visualization", "charts"],
    },
    {
        id: 3,
        name: "AI Code Assistant",
        description: "AI-powered code completion and suggestions",
        stars: 2345,
        forks: 321,
        language: "Python",
        owner: "aidev",
        contributors: 24,
        tags: ["ai", "machine-learning", "code-assistant"],
    },
    {
        id: 4,
        name: "Serverless Framework",
        description: "Build serverless applications with ease",
        stars: 1678,
        forks: 289,
        language: "TypeScript",
        owner: "cloudteam",
        contributors: 32,
        tags: ["serverless", "cloud", "infrastructure"],
    },
    {
        id: 5,
        name: "Mobile App Template",
        description: "Production-ready template for React Native applications",
        stars: 943,
        forks: 176,
        language: "JavaScript",
        owner: "mobiledev",
        contributors: 15,
        tags: ["mobile", "react-native", "template"],
    },
    {
        id: 6,
        name: "GraphQL Engine",
        description: "High-performance GraphQL server with built-in authorization",
        stars: 3210,
        forks: 412,
        language: "Go",
        owner: "graphql",
        contributors: 47,
        tags: ["graphql", "api", "database"],
    },
]

const categories = [
    { name: "Web Development", count: 1245 },
    { name: "Machine Learning", count: 876 },
    { name: "Mobile Development", count: 654 },
    { name: "DevOps", count: 432 },
    { name: "Data Science", count: 321 },
    { name: "Game Development", count: 234 },
    { name: "Blockchain", count: 123 },
    { name: "IoT", count: 98 },
]

const languages = [
    { name: "JavaScript", count: 2345 },
    { name: "Python", count: 1876 },
    { name: "TypeScript", count: 1543 },
    { name: "Go", count: 876 },
    { name: "Rust", count: 654 },
    { name: "Java", count: 543 },
    { name: "C#", count: 432 },
    { name: "PHP", count: 321 },
]

const ProjectCard = ({ project }: { project: any }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-all border border-gray-700 hover:border-emerald-500/50">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{project.owner}</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-medium">
                    {project.language}
                </div>
            </div>
            <p className="mt-3 text-gray-300 text-sm">{project.description}</p>
            <div className="flex gap-2 mt-4">
                {project.tags.map((tag: string) => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>{project.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                    <GitBranch size={14} />
                    <span>{project.forks}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{project.contributors}</span>
                </div>
            </div>
        </div>
    )
}

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("trending")

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Explore</h1>
                        <p className="text-gray-400 mt-1">Discover interesting projects and developers</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    </div>
                </div>

                <div className="flex border-b border-gray-800 mb-6">
                    <button
                        onClick={() => setActiveTab("trending")}
                        className={cn(
                            "py-3 px-4 font-medium text-sm border-b-2 transition-all",
                            activeTab === "trending"
                                ? "border-emerald-500 text-emerald-500"
                                : "border-transparent text-gray-400 hover:text-gray-300",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Zap size={16} />
                            <span>Trending</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={cn(
                            "py-3 px-4 font-medium text-sm border-b-2 transition-all",
                            activeTab === "categories"
                                ? "border-emerald-500 text-emerald-500"
                                : "border-transparent text-gray-400 hover:text-gray-300",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={16} />
                            <span>Categories</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("languages")}
                        className={cn(
                            "py-3 px-4 font-medium text-sm border-b-2 transition-all",
                            activeTab === "languages"
                                ? "border-emerald-500 text-emerald-500"
                                : "border-transparent text-gray-400 hover:text-gray-300",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span>#</span>
                            <span>Languages</span>
                        </div>
                    </button>
                </div>

                {activeTab === "trending" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trendingProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}

                {activeTab === "categories" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-all border border-gray-700 hover:border-emerald-500/50 cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                <p className="text-gray-400 text-sm mt-1">{category.count} projects</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "languages" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {languages.map((language) => (
                            <div
                                key={language.name}
                                className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-all border border-gray-700 hover:border-emerald-500/50 cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold text-white">{language.name}</h3>
                                <p className="text-gray-400 text-sm mt-1">{language.count} projects</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
