"use client"

import { useState, useEffect } from "react"
import { Plus, GitPullRequest, Bug, Code, Rocket, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useAuth } from "../components/contexts/auth-context";
export function QuickActions() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const { username } = useParams();
    

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login");
        }

        if (username && user?.username !== username) {
            navigate(`/dashboard/${user.username}`);
        }


    }, [isAuthenticated, isLoading, user, username, navigate]);

    if (isLoading || !user || !isAuthenticated) {
        return <div className="text-white">Loading...</div>;
    }


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {isOpen && (
        <div className="flex flex-col gap-2 items-end mb-2">
                  <ActionButton icon={<Bug className="h-4 w-4" />} label="New Issue" to={`/${username}/project/new-issue`} />
                  <ActionButton icon={<GitPullRequest className="h-4 w-4" />} label="Create PR" to={`/${username}/project/new-pull-request`} />
                  <ActionButton icon={<Code className="h-4 w-4" />} label="New Repo" to={`/${username}/new-repo`} />
                  <ActionButton icon={<Rocket className="h-4 w-4" />} label="Deploy" to={`/${username}/deploy`} />
        </div>
      )}
      <Button
        size="lg"
        className={`rounded-full shadow-lg ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </Button>
    </div>
  )
}

function ActionButton({ icon, label, to } : { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Button asChild className="rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg">
      <Link to={to} className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  )
}

export function QuickActionsHeader() {
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-1" /> Create New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <Link to={`/${loggedInUser.username}/project/new-issue`} className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer flex items-center">
                <Bug className="h-4 w-4 mr-2" /> New Issue
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <Link to={`/${loggedInUser.username}/project/new-pull-request`} className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer flex items-center">
                <GitPullRequest className="h-4 w-4 mr-2" /> Create Pull Request
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <Link to={`/${loggedInUser.username}/new-repo`} className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer flex items-center">
                <Code className="h-4 w-4 mr-2" /> New Repository
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <Link to={`/${loggedInUser.username}/deploy`} className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer flex items-center">
                <Rocket className="h-4 w-4 mr-2" /> Deploy Project
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to={`/${loggedInUser.username}/project/new-issue`}>
        <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Bug className="h-4 w-4 mr-1" /> New Issue
        </Button>
      </Link>

      <Link to={`/${loggedInUser.username}/project/new-pull-request`}>
          <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <GitPullRequest className="h-4 w-4 mr-1" /> Create PR
          </Button>
      </Link>
    </div>
  )
}
