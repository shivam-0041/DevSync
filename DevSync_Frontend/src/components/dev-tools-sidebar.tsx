"use client"

import { useState } from "react"
import { Code, BookOpen, Component, Bookmark, Search, Copy, ExternalLink } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ScrollArea } from "../components/ui/scroll-area"
import { Badge } from "../components/ui/badge"

export function DevToolsSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-zinc-800 hover:bg-zinc-700 rounded-l-none border-l-0"
        onClick={() => setIsOpen(true)}
      >
        <Code className="h-4 w-4 mr-1" /> Dev Tools
      </Button>
    )
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-zinc-900 border-r border-zinc-800 z-40 shadow-xl flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="font-bold text-white flex items-center">
          <Code className="h-5 w-5 mr-2 text-emerald-400" /> Dev Tools
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>

      <Tabs defaultValue="snippets" className="flex-1 flex flex-col">
        <TabsList className="bg-zinc-800 p-1 mx-4 mt-4 grid grid-cols-3">
          <TabsTrigger value="snippets" className="data-[state=active]:bg-zinc-700">
            <Code className="h-4 w-4 mr-1" /> Snippets
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-zinc-700">
            <BookOpen className="h-4 w-4 mr-1" /> API Docs
          </TabsTrigger>
          <TabsTrigger value="components" className="data-[state=active]:bg-zinc-700">
            <Component className="h-4 w-4 mr-1" /> Components
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        <TabsContent value="snippets" className="flex-1 m-0 p-0">
          <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400">Recently Used</h3>
              <div className="space-y-3">
                <CodeSnippet
                  title="React useState Hook"
                  language="TypeScript"
                  code={`const [state, setState] = useState<string>('')`}
                />
                <CodeSnippet
                  title="Fetch API with async/await"
                  language="JavaScript"
                  code={`async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}`}
                />
                <CodeSnippet
                  title="Tailwind Flex Center"
                  language="HTML"
                  code={`<div className="flex items-center justify-center">
  <!-- Content here -->
</div>`}
                />
              </div>

              <h3 className="text-sm font-medium text-zinc-400 mt-6">Popular Snippets</h3>
              <div className="space-y-3">
                <CodeSnippet
                  title="Next.js API Route"
                  language="TypeScript"
                  code={`export async function GET(request: Request) {
  const data = { message: 'Hello World' }
  return Response.json(data)
}`}
                />
                <CodeSnippet
                  title="React useEffect Cleanup"
                  language="TypeScript"
                  code={`useEffect(() => {
  const subscription = subscribeToEvent()
  
  return () => {
    subscription.unsubscribe()
  }
}, [])
`}
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="api" className="flex-1 m-0 p-0">
          <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400">Project APIs</h3>
              <div className="space-y-3">
                <ApiDocItem method="GET" endpoint="/api/projects" description="Get all projects" />
                <ApiDocItem method="POST" endpoint="/api/projects" description="Create a new project" />
                <ApiDocItem method="GET" endpoint="/api/projects/:id" description="Get project by ID" />
                <ApiDocItem method="PUT" endpoint="/api/projects/:id" description="Update project by ID" />
                <ApiDocItem method="DELETE" endpoint="/api/projects/:id" description="Delete project by ID" />
              </div>

              <h3 className="text-sm font-medium text-zinc-400 mt-6">Authentication</h3>
              <div className="space-y-3">
                <ApiDocItem method="POST" endpoint="/api/auth/login" description="User login" />
                <ApiDocItem method="POST" endpoint="/api/auth/register" description="User registration" />
                <ApiDocItem method="POST" endpoint="/api/auth/logout" description="User logout" />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="components" className="flex-1 m-0 p-0">
          <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400">UI Components</h3>
              <div className="space-y-3">
                <ComponentItem
                  name="Button"
                  description="Interactive button element with variants"
                  tags={["UI", "Interactive"]}
                />
                <ComponentItem
                  name="Card"
                  description="Container for related content and actions"
                  tags={["UI", "Layout"]}
                />
                <ComponentItem
                  name="Dialog"
                  description="Modal dialog for focused interactions"
                  tags={["UI", "Overlay"]}
                />
                <ComponentItem
                  name="Dropdown"
                  description="Menu that appears on user interaction"
                  tags={["UI", "Navigation"]}
                />
              </div>

              <h3 className="text-sm font-medium text-zinc-400 mt-6">Data Components</h3>
              <div className="space-y-3">
                <ComponentItem
                  name="DataTable"
                  description="Display and interact with tabular data"
                  tags={["Data", "Table"]}
                />
                <ComponentItem
                  name="Chart"
                  description="Visualize data with various chart types"
                  tags={["Data", "Visualization"]}
                />
                <ComponentItem name="Form" description="Collect and validate user input" tags={["Data", "Input"]} />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CodeSnippet({ title, language, code }) {
  return (
    <div className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700">
      <div className="flex justify-between items-center p-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{title}</span>
          <Badge variant="outline" className="text-xs bg-zinc-700 text-zinc-300 border-zinc-600">
            {language}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-300">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <pre className="p-3 text-xs text-zinc-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ApiDocItem({ method, endpoint, description }) {
  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "bg-emerald-900 text-emerald-300 border-emerald-700"
      case "POST":
        return "bg-blue-900 text-blue-300 border-blue-700"
      case "PUT":
        return "bg-amber-900 text-amber-300 border-amber-700"
      case "DELETE":
        return "bg-red-900 text-red-300 border-red-700"
      default:
        return "bg-zinc-700 text-zinc-300 border-zinc-600"
    }
  }

  return (
    <div className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className={`text-xs ${getMethodColor(method)}`}>
          {method}
        </Badge>
        <code className="text-sm text-white">{endpoint}</code>
      </div>
      <p className="text-xs text-zinc-400">{description}</p>
      <div className="flex justify-end mt-2">
        <Button variant="ghost" size="sm" className="h-6 text-xs text-emerald-400 hover:text-emerald-300 p-0">
          View Docs <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}

function ComponentItem({ name, description, tags }) {
  return (
    <div className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 p-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium text-white flex items-center">
          <Component className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
          {name}
        </h4>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-300">
          <Bookmark className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="text-xs text-zinc-400 mb-2">{description}</p>
      <div className="flex gap-1">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs bg-zinc-700 text-zinc-300 border-zinc-600">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
