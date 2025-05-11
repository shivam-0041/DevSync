import {Link} from "react-router-dom"
import { ExternalLink, Star, GitBranch, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    visibility: string
    language: string
    languageColor: string
    branches: number
    stars: number
    progress?: number
    dueDate?: string
    contributors: string[]
    lastUpdated: string
    comments?: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="bg-zinc-900 text-white border-zinc-800 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/project/${project.id}`}
                className="text-lg font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                {project.name} <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                {project.visibility}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
              <Star className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-zinc-400 mb-3">{project.description}</p>

          {project.progress !== undefined && (
            <div className="space-y-1 mb-3">
              <Progress value={project.progress} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>{project.progress}% complete</span>
                {project.dueDate && <span>Due in {project.dueDate}</span>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <span className={`h-3 w-3 rounded-full bg-${project.languageColor}`}></span>
              {project.language}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {project.branches}
            </span>
            {project.comments && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {project.comments}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-zinc-800 py-2 px-4 bg-zinc-800/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-2">
            {project.contributors.map((contributor, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-zinc-900">
                <AvatarFallback className="text-xs bg-zinc-700">{contributor}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-zinc-500">Updated {project.lastUpdated}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
