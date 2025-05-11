//import {Link} from "react-router-dom"
//import { SearchIcon, Filter, Code, Star, GitBranch, Users } from "lucide-react"
//import { Button } from "../components/ui/button"
//import { Input } from "../components/ui/input"
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
//import { Badge } from "../components/ui/badge"
//import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
//import { Checkbox } from "../components/ui/checkbox"
//import { Label } from "../components/ui/label"

//export default function SearchPage() {
//    return (
//        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
//            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
//                <div className="container mx-auto px-4 py-3">
//                    <div className="flex items-center gap-2">
//                        <Link to="/" className="flex items-center gap-2">
//                            <Code className="h-6 w-6 text-emerald-500" />
//                            <span className="font-bold">DevSync</span>
//                        </Link>
//                    </div>
//                </div>
//            </header>

//            <main className="container mx-auto px-4 py-8">
//                <div className="max-w-4xl mx-auto">
//                    <h1 className="text-2xl font-bold mb-6">Search Open Source Projects</h1>

//                    <div className="relative mb-8">
//                        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
//                        <Input
//                            placeholder="Search repositories, packages, users..."
//                            className="pl-10 py-6 text-lg"
//                            defaultValue="react component library"
//                        />
//                    </div>

//                    <div className="flex flex-col md:flex-row gap-6">
//                        {/* Filters */}
//                        <div className="w-full md:w-64 space-y-6">
//                            <Card>
//                                <CardHeader className="pb-2">
//                                    <CardTitle className="text-sm flex items-center gap-2">
//                                        <Filter className="h-4 w-4" /> Filters
//                                    </CardTitle>
//                                </CardHeader>
//                                <CardContent className="space-y-4">
//                                    <div className="space-y-2">
//                                        <Label className="text-xs font-medium">Language</Label>
//                                        <Select defaultValue="all">
//                                            <SelectTrigger>
//                                                <SelectValue placeholder="All Languages" />
//                                            </SelectTrigger>
//                                            <SelectContent>
//                                                <SelectItem value="all">All Languages</SelectItem>
//                                                <SelectItem value="javascript">JavaScript</SelectItem>
//                                                <SelectItem value="typescript">TypeScript</SelectItem>
//                                                <SelectItem value="python">Python</SelectItem>
//                                                <SelectItem value="java">Java</SelectItem>
//                                                <SelectItem value="go">Go</SelectItem>
//                                            </SelectContent>
//                                        </Select>
//                                    </div>

//                                    <div className="space-y-2">
//                                        <Label className="text-xs font-medium">Sort By</Label>
//                                        <Select defaultValue="best-match">
//                                            <SelectTrigger>
//                                                <SelectValue placeholder="Best Match" />
//                                            </SelectTrigger>
//                                            <SelectContent>
//                                                <SelectItem value="best-match">Best Match</SelectItem>
//                                                <SelectItem value="most-stars">Most Stars</SelectItem>
//                                                <SelectItem value="recently-updated">Recently Updated</SelectItem>
//                                                <SelectItem value="most-forks">Most Forks</SelectItem>
//                                            </SelectContent>
//                                        </Select>
//                                    </div>

//                                    <div className="space-y-2">
//                                        <Label className="text-xs font-medium">Type</Label>
//                                        <div className="space-y-2">
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="repositories" defaultChecked />
//                                                <label
//                                                    htmlFor="repositories"
//                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Repositories
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="packages" />
//                                                <label
//                                                    htmlFor="packages"
//                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Packages
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="users" />
//                                                <label
//                                                    htmlFor="users"
//                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Users
//                                                </label>
//                                            </div>
//                                        </div>
//                                    </div>

//                                    <div className="space-y-2">
//                                        <Label className="text-xs font-medium">Features</Label>
//                                        <div className="space-y-2">
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="good-first-issues" />
//                                                <label
//                                                    htmlFor="good-first-issues"
//                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Good First Issues
//                                                </label>
//                                            </div>
//                                            <div className="flex items-center space-x-2">
//                                                <Checkbox id="help-wanted" />
//                                                <label
//                                                    htmlFor="help-wanted"
//                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                                >
//                                                    Help Wanted
//                                                </label>
//                                            </div>
//                                        </div>
//                                    </div>
//                                </CardContent>
//                            </Card>
//                        </div>

//                        {/* Results */}
//                        <div className="flex-1">
//                            <Tabs defaultValue="repositories">
//                                <TabsList className="mb-6">
//                                    <TabsTrigger value="repositories">Repositories (254)</TabsTrigger>
//                                    <TabsTrigger value="packages">Packages (87)</TabsTrigger>
//                                    <TabsTrigger value="users">Users (42)</TabsTrigger>
//                                </TabsList>

//                                <TabsContent value="repositories" className="space-y-4">
//                                    {searchResults.map((result, index) => (
//                                        <SearchResultCard key={index} result={result} />
//                                    ))}

//                                    <div className="flex justify-center mt-8">
//                                        <Button variant="outline">Load More Results</Button>
//                                    </div>
//                                </TabsContent>

//                                <TabsContent value="packages">
//                                    <div className="space-y-4">
//                                        {packages.map((pkg, index) => (
//                                            <PackageCard key={index} package={pkg} />
//                                        ))}
//                                    </div>
//                                </TabsContent>

//                                <TabsContent value="users">
//                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                        {users.map((user, index) => (
//                                            <UserCard key={index} user={user} />
//                                        ))}
//                                    </div>
//                                </TabsContent>
//                            </Tabs>
//                        </div>
//                    </div>
//                </div>
//            </main>
//        </div>
//    )
//}

//function SearchResultCard({ result }) {
//    return (
//        <Card>
//            <CardHeader className="pb-2">
//                <div className="flex justify-between items-start">
//                    <div>
//                        <CardTitle className="text-lg flex items-center gap-2">
//                            <Link to={`/project/${result.id}`} className="hover:text-emerald-500 hover:underline">
//                                {result.owner}/{result.name}
//                            </Link>
//                            <Badge variant={result.visibility === "public" ? "secondary" : "outline"}>{result.visibility}</Badge>
//                        </CardTitle>
//                        <CardDescription className="mt-1">{result.description}</CardDescription>
//                    </div>
//                    <Button variant="outline" size="sm">
//                        <Star className="h-4 w-4 mr-1" /> Star
//                    </Button>
//                </div>
//            </CardHeader>
//            <CardContent className="pb-2">
//                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
//                    <span className="flex items-center gap-1">
//                        <span className={`h-3 w-3 rounded-full bg-${result.languageColor}`}></span>
//                        {result.language}
//                    </span>
//                    <span className="flex items-center gap-1">
//                        <Star className="h-4 w-4" />
//                        {result.stars.toLocaleString()}
//                    </span>
//                    <span className="flex items-center gap-1">
//                        <GitBranch className="h-4 w-4" />
//                        {result.forks.toLocaleString()}
//                    </span>
//                    <span>Updated {result.lastUpdated}</span>
//                    {result.topics.map((topic, index) => (
//                        <Badge
//                            key={index}
//                            variant="outline"
//                            className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
//                        >
//                            {topic}
//                        </Badge>
//                    ))}
//                </div>
//            </CardContent>
//        </Card>
//    )
//}

//function PackageCard({ package: pkg }) {
//    return (
//        <Card>
//            <CardHeader className="pb-2">
//                <CardTitle className="text-lg">
//                    <Link to={`/package/${pkg.name}`} className="hover:text-emerald-500 hover:underline">
//                        {pkg.name}
//                    </Link>
//                </CardTitle>
//                <CardDescription className="mt-1">{pkg.description}</CardDescription>
//            </CardHeader>
//            <CardContent className="pb-2">
//                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
//                    <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800">
//                        v{pkg.version}
//                    </Badge>
//                    <span>Published {pkg.publishedAt}</span>
//                    <span>{pkg.downloads.toLocaleString()} weekly downloads</span>
//                </div>
//            </CardContent>
//        </Card>
//    )
//}

//function UserCard({ user }) {
//    return (
//        <Card>
//            <CardContent className="p-4">
//                <div className="flex items-center gap-4">
//                    <Avatar className="h-12 w-12">
//                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
//                        <AvatarFallback>{user.initials}</AvatarFallback>
//                    </Avatar>
//                    <div>
//                        <h3 className="font-medium">{user.name}</h3>
//                        <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
//                    </div>
//                </div>
//                <div className="mt-4">
//                    <p className="text-sm">{user.bio}</p>
//                    <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
//                        <span className="flex items-center gap-1">
//                            <Users className="h-4 w-4" />
//                            {user.followers} followers
//                        </span>
//                        <span>{user.repositories} repositories</span>
//                    </div>
//                </div>
//            </CardContent>
//        </Card>
//    )
//}

//// Sample data
//const searchResults = [
//    {
//        id: "1",
//        name: "react-ui",
//        owner: "acme",
//        description: "A comprehensive React component library with a focus on accessibility and developer experience",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 12500,
//        forks: 1800,
//        lastUpdated: "3 days ago",
//        topics: ["react", "ui", "components", "design-system"],
//    },
//    {
//        id: "2",
//        name: "react-components",
//        owner: "facebook",
//        description: "A collection of reusable React components for building user interfaces",
//        visibility: "public",
//        language: "JavaScript",
//        languageColor: "yellow-500",
//        stars: 45600,
//        forks: 8700,
//        lastUpdated: "1 day ago",
//        topics: ["react", "components", "ui-library"],
//    },
//    {
//        id: "3",
//        name: "component-library",
//        owner: "designsystem",
//        description: "An enterprise-grade UI component library built with React",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 8900,
//        forks: 1200,
//        lastUpdated: "5 days ago",
//        topics: ["design-system", "react", "components", "typescript"],
//    },
//    {
//        id: "4",
//        name: "react-ui-kit",
//        owner: "uikit",
//        description: "Lightweight and customizable React components for modern web applications",
//        visibility: "public",
//        language: "JavaScript",
//        languageColor: "yellow-500",
//        stars: 6700,
//        forks: 890,
//        lastUpdated: "1 week ago",
//        topics: ["react", "ui-kit", "components"],
//    },
//    {
//        id: "5",
//        name: "react-component-library",
//        owner: "devteam",
//        description: "A set of high-quality React components following the Atomic Design methodology",
//        visibility: "public",
//        language: "TypeScript",
//        languageColor: "emerald-500",
//        stars: 3400,
//        forks: 450,
//        lastUpdated: "2 weeks ago",
//        topics: ["react", "atomic-design", "components"],
//    },
//]

//const packages = [
//    {
//        name: "@acme/react-ui",
//        description: "A comprehensive React component library with a focus on accessibility",
//        version: "2.5.0",
//        publishedAt: "3 days ago",
//        downloads: 250000,
//    },
//    {
//        name: "@facebook/react-components",
//        description: "Official React component library from Facebook",
//        version: "4.2.1",
//        publishedAt: "1 week ago",
//        downloads: 1500000,
//    },
//    {
//        name: "@designsystem/components",
//        description: "Enterprise-grade UI components for React applications",
//        version: "3.0.2",
//        publishedAt: "2 days ago",
//        downloads: 780000,
//    },
//]

//const users = [
//    {
//        name: "Sarah Johnson",
//        username: "sarahjdev",
//        initials: "SJ",
//        avatar: "/placeholder.svg?height=100&width=100",
//        bio: "Frontend developer specializing in React component libraries and design systems",
//        followers: 1200,
//        repositories: 45,
//    },
//    {
//        name: "Michael Chen",
//        username: "mchen",
//        initials: "MC",
//        avatar: "/placeholder.svg?height=100&width=100",
//        bio: "UI/UX designer and developer. Creator of several popular React component libraries",
//        followers: 3500,
//        repositories: 32,
//    },
//    {
//        name: "Emma Williams",
//        username: "emmaw",
//        initials: "EW",
//        avatar: "/placeholder.svg?height=100&width=100",
//        bio: "Open source contributor and maintainer of React UI libraries",
//        followers: 2100,
//        repositories: 28,
//    },
//    {
//        name: "David Rodriguez",
//        username: "drodriguez",
//        initials: "DR",
//        avatar: "/placeholder.svg?height=100&width=100",
//        bio: "Full-stack developer with a focus on React and component-based architecture",
//        followers: 1800,
//        repositories: 37,
//    },
//]


"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { SearchIcon, Filter, Code, Star, GitBranch, Users, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { DevToolsSidebar } from "../components/dev-tools-sidebar"

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("react component library")

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <Code className="h-6 w-6 text-emerald-400" />
                                <span className="font-bold text-white">DevSync</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                    Dashboard
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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-white">Search Open Source Projects</h1>

                    <div className="relative mb-8">
                        <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                        <Input
                            placeholder="Search repositories, packages, users..."
                            className="pl-10 py-6 text-lg bg-zinc-800 border-zinc-700 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="absolute right-1 top-1 bg-emerald-500 hover:bg-emerald-600">Search</Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Filters */}
                        <div className="w-full md:w-64 space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-white text-sm flex items-center gap-2">
                                        <Filter className="h-4 w-4" /> Filters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-zinc-300">Language</Label>
                                        <Select defaultValue="all">
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue placeholder="All Languages" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectItem value="all">All Languages</SelectItem>
                                                <SelectItem value="javascript">JavaScript</SelectItem>
                                                <SelectItem value="typescript">TypeScript</SelectItem>
                                                <SelectItem value="python">Python</SelectItem>
                                                <SelectItem value="java">Java</SelectItem>
                                                <SelectItem value="go">Go</SelectItem>
                                                <SelectItem value="rust">Rust</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-zinc-300">Sort By</Label>
                                        <Select defaultValue="best-match">
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue placeholder="Best Match" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectItem value="best-match">Best Match</SelectItem>
                                                <SelectItem value="most-stars">Most Stars</SelectItem>
                                                <SelectItem value="recently-updated">Recently Updated</SelectItem>
                                                <SelectItem value="most-forks">Most Forks</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-zinc-300">Type</Label>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="repositories" defaultChecked className="data-[state=checked]:bg-emerald-500" />
                                                <label
                                                    htmlFor="repositories"
                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Repositories
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="packages" className="data-[state=checked]:bg-emerald-500" />
                                                <label
                                                    htmlFor="packages"
                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Packages
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="users" className="data-[state=checked]:bg-emerald-500" />
                                                <label
                                                    htmlFor="users"
                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Users
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-zinc-300">Features</Label>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="good-first-issues" className="data-[state=checked]:bg-emerald-500" />
                                                <label
                                                    htmlFor="good-first-issues"
                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Good First Issues
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="help-wanted" className="data-[state=checked]:bg-emerald-500" />
                                                <label
                                                    htmlFor="help-wanted"
                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Help Wanted
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="has-funding" className="data-[state=checked]:bg-emerald-500" />
                                                <label
                                                    htmlFor="has-funding"
                                                    className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Has Funding
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Apply Filters</Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-white text-sm">Recent Searches</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 p-2 h-auto w-full justify-start text-sm"
                                        >
                                            <Clock className="h-3.5 w-3.5 mr-2" /> typescript ui library
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 p-2 h-auto w-full justify-start text-sm"
                                        >
                                            <Clock className="h-3.5 w-3.5 mr-2" /> react state management
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 p-2 h-auto w-full justify-start text-sm"
                                        >
                                            <Clock className="h-3.5 w-3.5 mr-2" /> nextjs starter template
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Results */}
                        <div className="flex-1">
                            <Tabs defaultValue="repositories">
                                <TabsList className="mb-6 bg-zinc-800">
                                    <TabsTrigger value="repositories" className="data-[state=active]:bg-zinc-700">
                                        Repositories (254)
                                    </TabsTrigger>
                                    <TabsTrigger value="packages" className="data-[state=active]:bg-zinc-700">
                                        Packages (87)
                                    </TabsTrigger>
                                    <TabsTrigger value="users" className="data-[state=active]:bg-zinc-700">
                                        Users (42)
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="repositories" className="space-y-4">
                                    {searchResults.map((result, index) => (
                                        <SearchResultCard key={index} result={result} />
                                    ))}

                                    <div className="flex justify-center mt-8">
                                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                            Load More Results
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="packages">
                                    <div className="space-y-4">
                                        {packages.map((pkg, index) => (
                                            <PackageCard key={index} package={pkg} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="users">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {users.map((user, index) => (
                                            <UserCard key={index} user={user} />
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>

            {/* Enhanced Dev Tools Sidebar */}
            <DevToolsSidebar />
        </div>
    )
}

function SearchResultCard({ result }) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/project/${result.id}`}
                                className="text-lg font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                            >
                                {result.owner}/{result.name}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                            <Badge variant={result.visibility === "public" ? "secondary" : "outline"} className="text-xs">
                                {result.visibility}
                            </Badge>
                        </div>
                        <CardDescription className="mt-1 text-zinc-400">{result.description}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        <Star className="h-4 w-4 mr-1" /> Star
                    </Button>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mt-3">
                    <span className="flex items-center gap-1">
                        <span className={`h-3 w-3 rounded-full bg-${result.languageColor}`}></span>
                        {result.language}
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {result.stars.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4" />
                        {result.forks.toLocaleString()}
                    </span>
                    <span>Updated {result.lastUpdated}</span>
                    {result.topics.map((topic, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                        >
                            {topic}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function PackageCard({ package: pkg }) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
                <div>
                    <Link
                        to={`/package/${pkg.name}`}
                        className="text-lg font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                    >
                        {pkg.name}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <CardDescription className="mt-1 text-zinc-400">{pkg.description}</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mt-3">
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                        v{pkg.version}
                    </Badge>
                    <span>Published {pkg.publishedAt}</span>
                    <span>{pkg.downloads.toLocaleString()} weekly downloads</span>
                </div>
            </CardContent>
        </Card>
    )
}

function UserCard({ user }) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-zinc-700 text-zinc-300">{user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-medium text-white">{user.name}</h3>
                        <p className="text-sm text-zinc-500">@{user.username}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-zinc-400">{user.bio}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {user.followers} followers
                        </span>
                        <span>{user.repositories} repositories</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Sample data
const searchResults = [
    {
        id: "1",
        name: "react-ui",
        owner: "acme",
        description: "A comprehensive React component library with a focus on accessibility and developer experience",
        visibility: "public",
        language: "TypeScript",
        languageColor: "emerald-500",
        stars: 12500,
        forks: 1800,
        lastUpdated: "3 days ago",
        topics: ["react", "ui", "components", "design-system"],
    },
    {
        id: "2",
        name: "react-components",
        owner: "facebook",
        description: "A collection of reusable React components for building user interfaces",
        visibility: "public",
        language: "JavaScript",
        languageColor: "yellow-500",
        stars: 45600,
        forks: 8700,
        lastUpdated: "1 day ago",
        topics: ["react", "components", "ui-library"],
    },
    {
        id: "3",
        name: "component-library",
        owner: "designsystem",
        description: "An enterprise-grade UI component library built with React",
        visibility: "public",
        language: "TypeScript",
        languageColor: "emerald-500",
        stars: 8900,
        forks: 1200,
        lastUpdated: "5 days ago",
        topics: ["design-system", "react", "components", "typescript"],
    },
    {
        id: "4",
        name: "react-ui-kit",
        owner: "uikit",
        description: "Lightweight and customizable React components for modern web applications",
        visibility: "public",
        language: "JavaScript",
        languageColor: "yellow-500",
        stars: 6700,
        forks: 890,
        lastUpdated: "1 week ago",
        topics: ["react", "ui-kit", "components"],
    },
    {
        id: "5",
        name: "react-component-library",
        owner: "devteam",
        description: "A set of high-quality React components following the Atomic Design methodology",
        visibility: "public",
        language: "TypeScript",
        languageColor: "emerald-500",
        stars: 3400,
        forks: 450,
        lastUpdated: "2 weeks ago",
        topics: ["react", "atomic-design", "components"],
    },
]

const packages = [
    {
        name: "@acme/react-ui",
        description: "A comprehensive React component library with a focus on accessibility",
        version: "2.5.0",
        publishedAt: "3 days ago",
        downloads: 250000,
    },
    {
        name: "@facebook/react-components",
        description: "Official React component library from Facebook",
        version: "4.2.1",
        publishedAt: "1 week ago",
        downloads: 1500000,
    },
    {
        name: "@designsystem/components",
        description: "Enterprise-grade UI components for React applications",
        version: "3.0.2",
        publishedAt: "2 days ago",
        downloads: 780000,
    },
]

const users = [
    {
        name: "Sarah Johnson",
        username: "sarahjdev",
        initials: "SJ",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Frontend developer specializing in React component libraries and design systems",
        followers: 1200,
        repositories: 45,
    },
    {
        name: "Michael Chen",
        username: "mchen",
        initials: "MC",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "UI/UX designer and developer. Creator of several popular React component libraries",
        followers: 3500,
        repositories: 32,
    },
    {
        name: "Emma Williams",
        username: "emmaw",
        initials: "EW",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Open source contributor and maintainer of React UI libraries",
        followers: 2100,
        repositories: 28,
    },
    {
        name: "David Rodriguez",
        username: "drodriguez",
        initials: "DR",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Full-stack developer with a focus on React and component-based architecture",
        followers: 1800,
        repositories: 37,
    },
]
