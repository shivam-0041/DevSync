"use client"

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react"
import { MessageSquare, GitPullRequest, Code, Users, CheckSquare, Bell } from "lucide-react"
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type BackendNotification,
} from "../../routes/projects"

interface Notification {
  id: number
  type: "mention" | "pull-request" | "commit" | "team" | "task" | "general"
  read: boolean
  title: string
  message: string
  time: string
  project: string
  icon: React.ReactNode
}

interface NotificationsContextValue {
  notifications: Notification[]
  setNotifications: (n: Notification[]) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
  unreadCount: number
  isLoading: boolean
  refetch: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

function getIcon(type: BackendNotification["type"]): React.ReactNode {
  switch (type) {
    case "mention":
      return <MessageSquare className="h-5 w-5" />
    case "pull_request":
      return <GitPullRequest className="h-5 w-5" />
    case "commit":
      return <Code className="h-5 w-5" />
    case "team":
      return <Users className="h-5 w-5" />
    case "task":
      return <CheckSquare className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

function normalizeType(type: BackendNotification["type"]): Notification["type"] {
  if (type === "pull_request") return "pull-request"
  return type as Notification["type"]
}

function formatNotificationTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return "Recently"
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
    return date.toLocaleDateString()
  } catch {
    return "Recently"
  }
}

function mapBackendNotification(n: BackendNotification): Notification {
  return {
    id: n.id,
    type: normalizeType(n.type),
    read: n.read,
    title: n.title || "Notification",
    message: n.message,
    time: formatNotificationTime(n.time),
    project: n.project || "",
    icon: getIcon(n.type),
  }
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotificationsState] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem("access")
    if (!token) return

    setIsLoading(true)
    try {
      const data = await fetchNotifications()
      setNotificationsState(data.map(mapBackendNotification))
    } catch (err) {
      console.error("Failed to load notifications:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const setNotifications = useCallback((n: Notification[]) => {
    setNotificationsState(n)
  }, [])

  const markAsRead = useCallback(async (id: number) => {
    setNotificationsState((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    await markNotificationRead(id)
  }, [])

  const markAllAsRead = useCallback(async () => {
    setNotificationsState((prev) => prev.map((n) => ({ ...n, read: true })))
    await markAllNotificationsRead()
  }, [])

  const deleteNotification = useCallback((id: number) => {
    setNotificationsState((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadCount,
        isLoading,
        refetch: loadNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider")
  return ctx
}

export default NotificationsContext
