import { useState } from "react"
import { Link } from "react-router-dom"
import { ExternalLink, Star, GitBranch, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { toggleStarProject } from "../routes/projects"

// Helper function to safely format dates
const formatSafeDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "unknown"
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "unknown"
        return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
        return "unknown"
    }
}

interface ProjectCardProps {
  project: {
    project_id: string;
    name: string;
    description: string;
    visibility: "private" | "team" | "public";
    languages: string;
    branch_count: number;
    stars: number;
    watchers: number;
    forks: number;
    issues: number;
    pull_requests_count: number;
    progress: number;
    contributors: string[];
    updated_at: string;
    created_at: string;
    slug: string;
    logo?: string;
    readme?: string | null;
    status: "active" | "pending" | "completed";
    is_starred?: boolean;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}") || {}

  // Derive the first language from the `languages` field (comma-separated string or array)
  const primaryLanguage = (() => {
    const raw = (project as any).languages
    if (!raw) return null
    if (Array.isArray(raw)) return raw[0] || null
    const parts = String(raw).split(",").map((s) => s.trim()).filter(Boolean)
    return parts[0] || null
  })()

  const [isStarred, setIsStarred] = useState<boolean>(project.is_starred ?? false)
  const [starCount, setStarCount] = useState<number>(project.stars ?? 0)
  const [starLoading, setStarLoading] = useState(false)

  const handleStarToggle = async () => {
    if (starLoading) return
    setStarLoading(true)
    try {
      const result = await toggleStarProject(project.slug)
      if (result) {
        setIsStarred(result.is_starred)
        setStarCount(result.stars)
      }
    } finally {
      setStarLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900 text-white border-zinc-800 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/${loggedInUser.username}/project/${project.slug}`}
                className="text-lg font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                {project.name} <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                {project.visibility}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={starLoading}
              onClick={handleStarToggle}
              className={isStarred ? "text-amber-400 hover:text-amber-300 hover:bg-zinc-800" : "text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"}
              title={isStarred ? "Unstar project" : "Star project"}
            >
              <Star className={`h-4 w-4 ${isStarred ? "fill-amber-400" : ""}`} />
            </Button>
          </div>
          <p className="text-sm text-zinc-400 mb-3">{project.description}</p>

          {project.progress !== undefined && (
            <div className="space-y-1 mb-3">
              <Progress value={project.progress} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>{project.progress}% complete</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <span className='h-3 w-3 rounded-full bg-zinc-500'></span>
              {primaryLanguage || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {starCount}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {(project as any).branches ?? project.branch_count ?? 0}
            </span>

            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {(project as any).comments ?? 0}
            </span>

          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-zinc-800 py-2 px-4 bg-zinc-800/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-2">
            {(project.contributors || []).map((contributor, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-zinc-900">
                <AvatarFallback className="text-xs bg-zinc-700">{contributor}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-zinc-500">Updated {formatSafeDate(project.updated_at)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
