import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ProjectCard } from "../components/project-card"
import { fetchProjects } from "../routes/projects"
import { useAuth } from "../components/contexts/auth-context"

function isStarredProject(project: any) {
  return Boolean(project?.is_starred || project?.starred || project?.isStarred)
}

export default function DashboardStarredPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate, user])

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
  }, [])

  const starredProjects = useMemo(() => projects.filter((project) => isStarredProject(project)), [projects])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-emerald-400" /> Starred Projects
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Projects you have starred for quick access</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {starredProjects.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-zinc-400">No starred projects yet.</CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starredProjects.map((project, index) => (
              <ProjectCard key={`${project?.id || "project"}-${index}`} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
