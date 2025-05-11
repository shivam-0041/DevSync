"use client"

import { useState } from "react"
import { Plus, GitPullRequest, Bug, Code, Rocket, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {isOpen && (
        <div className="flex flex-col gap-2 items-end mb-2">
          <ActionButton icon={<Bug className="h-4 w-4" />} label="New Issue" href="/new/issue" />
          <ActionButton icon={<GitPullRequest className="h-4 w-4" />} label="Create PR" href="/new/pull-request" />
          <ActionButton icon={<Code className="h-4 w-4" />} label="New Repo" href="/new/repository" />
          <ActionButton icon={<Rocket className="h-4 w-4" />} label="Deploy" href="/deploy" />
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

function ActionButton({ icon, label, href }) {
  return (
    <Button asChild className="rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg">
      <a href={href} className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </a>
    </Button>
  )
}

export function QuickActionsHeader() {
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
            <Bug className="h-4 w-4 mr-2" /> New Issue
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <GitPullRequest className="h-4 w-4 mr-2" /> Create Pull Request
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <Code className="h-4 w-4 mr-2" /> New Repository
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <Rocket className="h-4 w-4 mr-2" /> Deploy Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
        <Bug className="h-4 w-4 mr-1" /> New Issue
      </Button>

      <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
        <GitPullRequest className="h-4 w-4 mr-1" /> Create PR
      </Button>
    </div>
  )
}
