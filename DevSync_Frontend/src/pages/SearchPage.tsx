"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowUpRight, Code, Filter, GitBranch, SearchIcon, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DevToolsSidebar } from "../components/dev-tools-sidebar"
import { getBrandHomePath } from "../lib/brand-link"
import {
  fetchAllPublicProjects,
  fetchGithubPopularRepos,
  searchGithubRepositories,
  type GithubPopularRepo,
} from "../routes/projects"

type SearchSource = "both" | "devsync" | "github"

type DevSyncRepo = {
  id: number
  name: string
  description?: string
  created_by?: string
  visibility?: string
  slug?: string
  updated_at?: string
  language?: string
}

function normalizeDevSyncRepos(data: any[]): DevSyncRepo[] {
  return data.map((item: any) => ({
    id: Number(item?.id),
    name: String(item?.name || "Untitled repo"),
    description: item?.description || "",
    created_by: typeof item?.created_by === "string" ? item.created_by : item?.created_by?.username || "unknown",
    visibility: item?.visibility || "public",
    slug: item?.slug,
    updated_at: item?.updated_at,
    language: item?.language || (Array.isArray(item?.languages) ? item.languages[0] : ""),
  }))
}

function formatRelativeDate(value?: string) {
  if (!value) {
    return "Recently"
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return "Recently"
  }

  const diffMinutes = Math.floor((Date.now() - parsed.getTime()) / 60000)
  if (diffMinutes < 1) {
    return "Just now"
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

function DevSyncRepoCard({ repo }: { repo: DevSyncRepo }) {
  const target = repo.slug ? `/project/${repo.slug}` : "/explore"

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={target}
                className="text-lg font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
              >
                {repo.created_by}/{repo.name}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">DevSync</Badge>
              <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                {repo.visibility || "public"}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-zinc-400">
              {repo.description || "No description provided."}
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mt-3">
          <span>{repo.language || "General"}</span>
          <span>Updated {formatRelativeDate(repo.updated_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function GithubRepoCard({ repo }: { repo: GithubPopularRepo }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
              >
                {repo.full_name}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Badge className="bg-sky-600/20 text-sky-300 border-sky-500/30">GitHub</Badge>
            </div>
            <CardDescription className="mt-1 text-zinc-400">{repo.description || "No description provided."}</CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mt-3">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" /> {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="h-4 w-4" /> {repo.forks_count.toLocaleString()}
          </span>
          <span>{repo.language || "Mixed"}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [source, setSource] = useState<SearchSource>("both")

  const [devsyncRepos, setDevsyncRepos] = useState<DevSyncRepo[]>([])
  const [githubRepos, setGithubRepos] = useState<GithubPopularRepo[]>([])

  const [isLoadingDevSync, setIsLoadingDevSync] = useState(true)
  const [isLoadingGithub, setIsLoadingGithub] = useState(true)
  const [devsyncError, setDevsyncError] = useState<string | null>(null)
  const [githubError, setGithubError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoadingDevSync(true)
    fetchAllPublicProjects()
      .then((data) => {
        setDevsyncRepos(normalizeDevSyncRepos(Array.isArray(data) ? data : []))
        setDevsyncError(null)
      })
      .catch(() => {
        setDevsyncRepos([])
        setDevsyncError("Could not load DevSync public repositories.")
      })
      .finally(() => setIsLoadingDevSync(false))
  }, [])

  useEffect(() => {
    const trimmed = searchQuery.trim()

    const timer = window.setTimeout(() => {
      setIsLoadingGithub(true)

      const request = trimmed ? searchGithubRepositories(trimmed) : fetchGithubPopularRepos()
      request
        .then((data) => {
          setGithubRepos(Array.isArray(data) ? data : [])
          setGithubError(null)
        })
        .catch(() => {
          setGithubRepos([])
          setGithubError("Could not load GitHub repositories.")
        })
        .finally(() => setIsLoadingGithub(false))
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredDevSync = useMemo(() => {
    if (!normalizedQuery) {
      return devsyncRepos
    }

    return devsyncRepos.filter((repo) => {
      const haystack = [repo.name, repo.description, repo.created_by, repo.language]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [devsyncRepos, normalizedQuery])

  const showDevSync = source === "both" || source === "devsync"
  const showGithub = source === "both" || source === "github"

  const onSearchSubmit = () => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setSearchParams({})
      return
    }

    setSearchParams({ q: trimmed })
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to={getBrandHomePath()} className="flex items-center gap-2">
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
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">Search Public Repositories</h1>

          <div className="relative mb-5">
            <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
            <Input
              placeholder="Search in DevSync and GitHub repositories..."
              className="pl-10 py-6 text-lg bg-zinc-800 border-zinc-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchSubmit()
                }
              }}
            />
            <Button className="absolute right-1 top-1 bg-emerald-500 hover:bg-emerald-600" onClick={onSearchSubmit}>
              Search
            </Button>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" /> Source Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 w-full md:w-64">
                <Label className="text-xs font-medium text-zinc-300">Search Source</Label>
                <Select value={source} onValueChange={(value: SearchSource) => setSource(value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="both">DevSync + GitHub</SelectItem>
                    <SelectItem value="devsync">DevSync Only</SelectItem>
                    <SelectItem value="github">GitHub Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {showDevSync && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">DevSync Public Repositories</h2>
                  <span className="text-sm text-zinc-400">{filteredDevSync.length} found</span>
                </div>

                {isLoadingDevSync ? (
                  <p className="text-zinc-400">Loading DevSync repositories...</p>
                ) : devsyncError ? (
                  <p className="text-red-400">{devsyncError}</p>
                ) : filteredDevSync.length === 0 ? (
                  <p className="text-zinc-400">No DevSync repositories match your search.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredDevSync.map((repo) => (
                      <DevSyncRepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {showGithub && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">GitHub Repository Results</h2>
                  <span className="text-sm text-zinc-400">{githubRepos.length} found</span>
                </div>

                {isLoadingGithub ? (
                  <p className="text-zinc-400">Loading GitHub results...</p>
                ) : githubError ? (
                  <p className="text-red-400">{githubError}</p>
                ) : githubRepos.length === 0 ? (
                  <p className="text-zinc-400">No GitHub repositories match your search.</p>
                ) : (
                  <div className="space-y-4">
                    {githubRepos.map((repo) => (
                      <GithubRepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      <DevToolsSidebar />
    </div>
  )
}
