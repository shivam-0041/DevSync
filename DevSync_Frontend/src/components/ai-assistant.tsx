"use client"

import { useState } from "react"
import { Sparkles, X, ChevronRight, AlertCircle, GitPullRequest, Bug } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

interface AISuggestion {
  id: string
  type: "bug" | "stale-pr" | "priority" | "suggestion"
  title: string
  description: string
  project: string
  action: string
  actionLink: string
}

export function AIAssistant() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([
    {
      id: "1",
      type: "bug",
      title: "Unresolved Bugs",
      description: "You've got 3 unresolved bugs in E-commerce Platform — want to fix them now?",
      project: "E-commerce Platform",
      action: "View Bugs",
      actionLink: "/project/1/issues?filter=bugs",
    },
    {
      id: "2",
      type: "stale-pr",
      title: "Stale Pull Requests",
      description: "2 pull requests haven't been updated in over a week",
      project: "Mobile App",
      action: "Review PRs",
      actionLink: "/project/3/pull-requests?filter=stale",
    },
    {
      id: "3",
      type: "priority",
      title: "Priority Issue",
      description: "The checkout form validation issue is blocking 2 other tasks",
      project: "E-commerce Platform",
      action: "Fix Issue",
      actionLink: "/project/1/issues/42",
    },
    {
      id: "4",
      type: "suggestion",
      title: "Project Suggestion",
      description: "Based on your skills, you might be interested in contributing to 'React State Management Library'",
      project: "Recommendation",
      action: "Explore Project",
      actionLink: "/explore?q=react+state+management",
    },
  ])

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((suggestion) => suggestion.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-5 w-5 text-red-400" />
      case "stale-pr":
        return <GitPullRequest className="h-5 w-5 text-amber-400" />
      case "priority":
        return <AlertCircle className="h-5 w-5 text-purple-400" />
      case "suggestion":
        return <Sparkles className="h-5 w-5 text-emerald-400" />
      default:
        return <Sparkles className="h-5 w-5 text-emerald-400" />
    }
  }

  if (suggestions.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-emerald-400" /> AI Assistant
        </h2>
        <Button variant="ghost" size="sm" className="text-xs">
          View All Suggestions
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {getIcon(suggestion.type)}
                  <div>
                    <h3 className="font-medium text-white">{suggestion.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{suggestion.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                  onClick={() => dismissSuggestion(suggestion.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 py-2 px-4 bg-zinc-800/50 flex justify-between">
              <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                {suggestion.project}
              </Badge>
              <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 p-0 h-auto">
                {suggestion.action} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
