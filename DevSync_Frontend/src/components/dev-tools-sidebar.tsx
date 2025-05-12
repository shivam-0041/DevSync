//"use client"

//import { useState, useRef, useEffect } from "react"
//import { Code, BookOpen, Component, Bookmark, Search, Copy, ExternalLink, GripVertical } from "lucide-react"
//import { Button } from "./ui/button"
//import { Input } from "./ui/input"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
//import { ScrollArea } from "./ui/scroll-area"
//import { Badge } from "./ui/badge"

//export function DevToolsSidebar() {
//    const [isOpen, setIsOpen] = useState(false)
//    const [position, setPosition] = useState({ x: 20, y: 100 })
//    const [isDragging, setIsDragging] = useState(false)
//    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
//    const buttonRef = useRef(null)

//    // Handle dragging
//    useEffect(() => {
//        const handleMouseMove = (e) => {
//            if (isDragging && buttonRef.current) {
//                const newX = e.clientX - dragOffset.x
//                const newY = e.clientY - dragOffset.y

//                // Keep button within viewport bounds
//                const maxX = window.innerWidth - buttonRef.current.offsetWidth
//                const maxY = window.innerHeight - buttonRef.current.offsetHeight

//                setPosition({
//                    x: Math.max(0, Math.min(newX, maxX)),
//                    y: Math.max(0, Math.min(newY, maxY)),
//                })
//            }
//        }

//        const handleMouseUp = () => {
//            setIsDragging(false)
//        }

//        if (isDragging) {
//            document.addEventListener("mousemove", handleMouseMove)
//            document.addEventListener("mouseup", handleMouseUp)
//        }

//        return () => {
//            document.removeEventListener("mousemove", handleMouseMove)
//            document.removeEventListener("mouseup", handleMouseUp)
//        }
//    }, [isDragging, dragOffset])

//    const handleMouseDown = (e) => {
//        if (buttonRef.current) {
//            setIsDragging(true)
//            setDragOffset({
//                x: e.clientX - position.x,
//                y: e.clientY - position.y,
//            })
//            e.preventDefault()
//        }
//    }

//    if (!isOpen) {
//        return (
//            <div
//                ref={buttonRef}
//                className="fixed z-50 flex items-center gap-2 cursor-move"
//                style={{ left: `${position.x}px`, top: `${position.y}px` }}
//                onMouseDown={handleMouseDown}
//            >
//                <Button
//                    className="bg-emerald-500 hover:bg-emerald-600 shadow-lg rounded-full animate-pulse"
//                    onClick={() => setIsOpen(true)}
//                >
//                    <Code className="h-5 w-5 mr-1" /> Dev Tools
//                </Button>
//                <GripVertical className="h-5 w-5 text-zinc-400" />
//            </div>
//        )
//    }

//    return (
//        <div className="fixed right-0 top-0 bottom-0 w-80 bg-zinc-900 border-l border-zinc-800 z-40 shadow-xl flex flex-col">
//            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
//                <h2 className="font-bold text-white flex items-center">
//                    <Code className="h-5 w-5 mr-2 text-emerald-400" /> Dev Tools
//                </h2>
//                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
//                    Close
//                </Button>
//            </div>

//            <Tabs defaultValue="snippets" className="flex-1 flex flex-col">
//                <TabsList className="bg-zinc-800 p-1 mx-4 mt-4 grid grid-cols-3">
//                    <TabsTrigger value="snippets" className="data-[state=active]:bg-zinc-700">
//                        <Code className="h-4 w-4 mr-1" /> Snippets
//                    </TabsTrigger>
//                    <TabsTrigger value="api" className="data-[state=active]:bg-zinc-700">
//                        <BookOpen className="h-4 w-4 mr-1" /> API Docs
//                    </TabsTrigger>
//                    <TabsTrigger value="components" className="data-[state=active]:bg-zinc-700">
//                        <Component className="h-4 w-4 mr-1" /> Components
//                    </TabsTrigger>
//                </TabsList>

//                <div className="p-4">
//                    <div className="relative">
//                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
//                        <Input
//                            placeholder="Search..."
//                            className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
//                        />
//                    </div>
//                </div>

//                <TabsContent value="snippets" className="flex-1 m-0 p-0">
//                    <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
//                        <div className="space-y-4">
//                            <h3 className="text-sm font-medium text-zinc-400">Recently Used</h3>
//                            <div className="space-y-3">
//                                <CodeSnippet
//                                    title="React useState Hook"
//                                    language="TypeScript"
//                                    code={`const [state, setState] = useState<string>('')`}
//                                />
//                                <CodeSnippet
//                                    title="Fetch API with async/await"
//                                    language="JavaScript"
//                                    code={`async function fetchData() {
//  try {
//    const response = await fetch('/api/data')
//    const data = await response.json()
//    return data
//  } catch (error) {
//    console.error('Error fetching data:', error)
//  }
//}`}
//                                />
//                                <CodeSnippet
//                                    title="Tailwind Flex Center"
//                                    language="HTML"
//                                    code={`<div className="flex items-center justify-center">
//  <!-- Content here -->
//</div>`}
//                                />
//                            </div>

//                            <h3 className="text-sm font-medium text-zinc-400 mt-6">Popular Snippets</h3>
//                            <div className="space-y-3">
//                                <CodeSnippet
//                                    title="Vite API Route"
//                                    language="TypeScript"
//                                    code={`// src/api/hello.ts
//import express from 'express';
//const router = express.Router();

//router.get('/', (req, res) => {
//  res.json({ message: 'Hello World' });
//});

//export default router;`}
//                                />
//                                <CodeSnippet
//                                    title="React useEffect Cleanup"
//                                    language="TypeScript"
//                                    code={`useEffect(() => {
//  const subscription = subscribeToEvent()

//  return () => {
//    subscription.unsubscribe()
//  }
//}, [])`}
//                                />
//                            </div>
//                        </div>
//                    </ScrollArea>
//                </TabsContent>

//                <TabsContent value="api" className="flex-1 m-0 p-0">
//                    <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
//                        <div className="space-y-4">
//                            <h3 className="text-sm font-medium text-zinc-400">Project APIs</h3>
//                            <div className="space-y-3">
//                                <ApiDocItem method="GET" endpoint="/api/projects" description="Get all projects" />
//                                <ApiDocItem method="POST" endpoint="/api/projects" description="Create a new project" />
//                                <ApiDocItem method="GET" endpoint="/api/projects/:id" description="Get project by ID" />
//                                <ApiDocItem method="PUT" endpoint="/api/projects/:id" description="Update project by ID" />
//                                <ApiDocItem method="DELETE" endpoint="/api/projects/:id" description="Delete project by ID" />
//                            </div>

//                            <h3 className="text-sm font-medium text-zinc-400 mt-6">Authentication</h3>
//                            <div className="space-y-3">
//                                <ApiDocItem method="POST" endpoint="/api/auth/login" description="User login" />
//                                <ApiDocItem method="POST" endpoint="/api/auth/register" description="User registration" />
//                                <ApiDocItem method="POST" endpoint="/api/auth/logout" description="User logout" />
//                            </div>
//                        </div>
//                    </ScrollArea>
//                </TabsContent>

//                <TabsContent value="components" className="flex-1 m-0 p-0">
//                    <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
//                        <div className="space-y-4">
//                            <h3 className="text-sm font-medium text-zinc-400">UI Components</h3>
//                            <div className="space-y-3">
//                                <ComponentItem
//                                    name="Button"
//                                    description="Interactive button element with variants"
//                                    tags={["UI", "Interactive"]}
//                                />
//                                <ComponentItem
//                                    name="Card"
//                                    description="Container for related content and actions"
//                                    tags={["UI", "Layout"]}
//                                />
//                                <ComponentItem
//                                    name="Dialog"
//                                    description="Modal dialog for focused interactions"
//                                    tags={["UI", "Overlay"]}
//                                />
//                                <ComponentItem
//                                    name="Dropdown"
//                                    description="Menu that appears on user interaction"
//                                    tags={["UI", "Navigation"]}
//                                />
//                            </div>

//                            <h3 className="text-sm font-medium text-zinc-400 mt-6">Data Components</h3>
//                            <div className="space-y-3">
//                                <ComponentItem
//                                    name="DataTable"
//                                    description="Display and interact with tabular data"
//                                    tags={["Data", "Table"]}
//                                />
//                                <ComponentItem
//                                    name="Chart"
//                                    description="Visualize data with various chart types"
//                                    tags={["Data", "Visualization"]}
//                                />
//                                <ComponentItem name="Form" description="Collect and validate user input" tags={["Data", "Input"]} />
//                            </div>
//                        </div>
//                    </ScrollArea>
//                </TabsContent>
//            </Tabs>
//        </div>
//    )
//}

//function CodeSnippet({ title, language, code }) {
//    return (
//        <div className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700">
//            <div className="flex justify-between items-center p-2 bg-zinc-800 border-b border-zinc-700">
//                <div className="flex items-center gap-2">
//                    <span className="text-sm font-medium text-white">{title}</span>
//                    <Badge variant="outline" className="text-xs bg-zinc-700 text-zinc-300 border-zinc-600">
//                        {language}
//                    </Badge>
//                </div>
//                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-300">
//                    <Copy className="h-3.5 w-3.5" />
//                </Button>
//            </div>
//            <pre className="p-3 text-xs text-zinc-300 overflow-x-auto">
//                <code>{code}</code>
//            </pre>
//        </div>
//    )
//}

//function ApiDocItem({ method, endpoint, description }) {
//    const getMethodColor = (method) => {
//        switch (method) {
//            case "GET":
//                return "bg-emerald-900 text-emerald-300 border-emerald-700"
//            case "POST":
//                return "bg-blue-900 text-blue-300 border-blue-700"
//            case "PUT":
//                return "bg-amber-900 text-amber-300 border-amber-700"
//            case "DELETE":
//                return "bg-red-900 text-red-300 border-red-700"
//            default:
//                return "bg-zinc-700 text-zinc-300 border-zinc-600"
//        }
//    }

//    return (
//        <div className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 p-3">
//            <div className="flex items-center gap-2 mb-2">
//                <Badge variant="outline" className={`text-xs ${getMethodColor(method)}`}>
//                    {method}
//                </Badge>
//                <code className="text-sm text-white">{endpoint}</code>
//            </div>
//            <p className="text-xs text-zinc-400">{description}</p>
//            <div className="flex justify-end mt-2">
//                <Button variant="ghost" size="sm" className="h-6 text-xs text-emerald-400 hover:text-emerald-300 p-0">
//                    View Docs <ExternalLink className="h-3 w-3 ml-1" />
//                </Button>
//            </div>
//        </div>
//    )
//}

//function ComponentItem({ name, description, tags }) {
//    return (
//        <div className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 p-3">
//            <div className="flex items-center justify-between mb-1">
//                <h4 className="text-sm font-medium text-white flex items-center">
//                    <Component className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
//                    {name}
//                </h4>
//                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-300">
//                    <Bookmark className="h-3.5 w-3.5" />
//                </Button>
//            </div>
//            <p className="text-xs text-zinc-400 mb-2">{description}</p>
//            <div className="flex gap-1">
//                {tags.map((tag, index) => (
//                    <Badge key={index} variant="outline" className="text-xs bg-zinc-700 text-zinc-300 border-zinc-600">
//                        {tag}
//                    </Badge>
//                ))}
//            </div>
//        </div>
//    )
//}

"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, GripVertical, Code, Terminal, Database, GitBranch, Bug } from "lucide-react"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

export function DevToolsSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ x: window.innerWidth - 60, y: 100 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const buttonRef = useRef(null)

    // Handle dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && buttonRef.current) {
                const newX = Math.min(Math.max(0, e.clientX - dragOffset.x), window.innerWidth - buttonRef.current.offsetWidth)
                const newY = Math.min(
                    Math.max(0, e.clientY - dragOffset.y),
                    window.innerHeight - buttonRef.current.offsetHeight,
                )
                setPosition({ x: newX, y: newY })
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, dragOffset])

    const handleMouseDown = (e) => {
        if (buttonRef.current) {
            setIsDragging(true)
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            })
        }
    }

    // Create portal for the sidebar
    const DevToolsButton = (
        <div
            ref={buttonRef}
            className={`fixed z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <div
                className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-ping"
                style={{ animationDuration: "3s" }}
            ></div>
            <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-zinc-900 border-2 border-emerald-500 text-emerald-400 hover:bg-zinc-800 shadow-lg relative z-10"
                onClick={() => setIsOpen(true)}
            >
                <Code className="h-5 w-5" />
            </Button>
            <div className="absolute -top-6 left-0 right-0 flex justify-center cursor-move" onMouseDown={handleMouseDown}>
                <GripVertical className="h-5 w-5 text-zinc-500 hover:text-zinc-400" />
            </div>
        </div>
    )

    const DevToolsPanel = isOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
                <div className="h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Code className="h-5 w-5 text-emerald-400" /> Developer Tools
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Tabs defaultValue="console" className="flex-1 overflow-hidden flex flex-col">
                        <TabsList className="bg-zinc-800 px-4 py-2 justify-start">
                            <TabsTrigger value="console" className="data-[state=active]:bg-zinc-700">
                                Console
                            </TabsTrigger>
                            <TabsTrigger value="network" className="data-[state=active]:bg-zinc-700">
                                Network
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-700">
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="console" className="flex-1 overflow-hidden flex flex-col p-0 data-[state=active]:flex">
                            <div className="flex-1 overflow-auto p-4 bg-zinc-950 font-mono text-sm text-zinc-300">
                                <div className="space-y-2">
                                    <div className="text-emerald-400">&gt; Welcome to CodeCollab Developer Console</div>
                                    <div className="text-zinc-500">// You can test JavaScript code here</div>
                                    <div className="text-zinc-300">&gt; const greeting = "Hello, Developer!";</div>
                                    <div className="text-zinc-300">&gt; console.log(greeting);</div>
                                    <div className="text-emerald-400">"Hello, Developer!"</div>
                                    <div className="text-zinc-300">&gt; const sum = (a, b) =&gt; a + b;</div>
                                    <div className="text-zinc-300">&gt; sum(5, 10);</div>
                                    <div className="text-emerald-400">15</div>
                                    <div className="text-red-400">
                                        Uncaught TypeError: Cannot read properties of undefined (reading 'map')
                                    </div>
                                    <div className="text-zinc-500">// at ProjectList.jsx:24:32</div>
                                </div>
                            </div>
                            <div className="p-2 border-t border-zinc-800 bg-zinc-900">
                                <div className="flex items-center gap-2">
                                    <Textarea
                                        placeholder="Enter JavaScript code..."
                                        className="min-h-[60px] bg-zinc-800 border-zinc-700 text-white"
                                    />
                                    <Button className="h-full bg-emerald-500 hover:bg-emerald-600">Run</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="network"
                            className="flex-1 overflow-hidden flex flex-col p-0 data-[state=active]:flex"
                        >
                            <div className="flex-1 overflow-auto">
                                <div className="p-4 space-y-4">
                                    <Card className="bg-zinc-800 border-zinc-700">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-white text-sm">GET /api/projects</CardTitle>
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">200 OK</Badge>
                                            </div>
                                            <CardDescription>https://api.codecollab.io/projects</CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-xs">
                                            <div className="flex justify-between text-zinc-400 mb-1">
                                                <span>Time: 235ms</span>
                                                <span>Size: 12.4KB</span>
                                            </div>
                                            <div className="bg-zinc-900 p-2 rounded-md font-mono text-zinc-300 max-h-32 overflow-auto">
                                                {`{ "data": [...], "pagination": { "total": 42, "page": 1, "limit": 10 } }`}
                                            </div>

                                        </CardContent>
                                    </Card>

                                    <Card className="bg-zinc-800 border-zinc-700">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-white text-sm">POST /api/auth/login</CardTitle>
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">200 OK</Badge>
                                            </div>
                                            <CardDescription>https://api.codecollab.io/auth/login</CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-xs">
                                            <div className="flex justify-between text-zinc-400 mb-1">
                                                <span>Time: 189ms</span>
                                                <span>Size: 1.2KB</span>
                                            </div>
                                            <div className="bg-zinc-900 p-2 rounded-md font-mono text-zinc-300 max-h-32 overflow-auto">
                                                {`{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "user": { "id": 123, "username": "johndoe" } }`}
                                            </div>

                                        </CardContent>
                                    </Card>

                                    <Card className="bg-zinc-800 border-zinc-700">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-white text-sm">GET /api/users/profile</CardTitle>
                                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">401 Unauthorized</Badge>
                                            </div>
                                            <CardDescription>https://api.codecollab.io/users/profile</CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-xs">
                                            <div className="flex justify-between text-zinc-400 mb-1">
                                                <span>Time: 87ms</span>
                                                <span>Size: 0.3KB</span>
                                            </div>
                                            <div className="bg-zinc-900 p-2 rounded-md font-mono text-zinc-300 max-h-32 overflow-auto">
                                                {"{"} "error": "Unauthorized", "message": "Invalid or expired token" {"}"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="settings"
                            className="flex-1 overflow-hidden flex flex-col p-4 data-[state=active]:flex"
                        >
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-4">Developer Settings</h3>
                                    <Card className="bg-zinc-800 border-zinc-700">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-white">Debug Mode</Label>
                                                    <p className="text-xs text-zinc-400">Enable detailed error messages and logging</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <Separator className="bg-zinc-700" />
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-white">Network Throttling</Label>
                                                    <p className="text-xs text-zinc-400">Simulate slower network connections</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <Separator className="bg-zinc-700" />
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-white">Preserve Log</Label>
                                                    <p className="text-xs text-zinc-400">Keep logs between page refreshes</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-white mb-4">API Settings</h3>
                                    <Card className="bg-zinc-800 border-zinc-700">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="api-url" className="text-white">
                                                    API URL
                                                </Label>
                                                <Input
                                                    id="api-url"
                                                    defaultValue="https://api.codecollab.io"
                                                    className="bg-zinc-900 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="api-key" className="text-white">
                                                    API Key
                                                </Label>
                                                <Input
                                                    id="api-key"
                                                    type="password"
                                                    defaultValue="sk_test_123456789"
                                                    className="bg-zinc-900 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Save API Settings</Button>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-white mb-4">Tools</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                        >
                                            <Terminal className="h-6 w-6 text-emerald-400" />
                                            <span>Terminal</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                        >
                                            <Database className="h-6 w-6 text-emerald-400" />
                                            <span>Database</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                        >
                                            <GitBranch className="h-6 w-6 text-emerald-400" />
                                            <span>Git</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                        >
                                            <Bug className="h-6 w-6 text-emerald-400" />
                                            <span>Debugger</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>,
            document.body
        )
        : null

    return (
        <>
            {DevToolsButton}
            {DevToolsPanel}
        </>
    )
}

// Helper components
function Badge({ children, className, variant = "default", ...props }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}
