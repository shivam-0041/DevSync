import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ProjectCard } from "../components/project-card"
import { fetchProjects } from "../routes/projects"
import { useAuth } from "../components/contexts/auth-context"

export default function DashboardStarredPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate, user])

  useEffect(() => {
    setIsFetching(true)
    fetchProjects()
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setIsFetching(false))
  }, [])

  const starredProjects = useMemo(
    () => projects.filter((project) => Boolean(project?.is_starred)),
    [projects]
  )

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
          <Link to={`/dashboard/${username}`}>
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {isFetching ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-zinc-400">Loading starred projects…</CardContent>
          </Card>
        ) : starredProjects.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-zinc-400">
              No starred projects yet. Star a project to see it here.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starredProjects.map((project) => (
              <ProjectCard key={project?.slug || project?.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
