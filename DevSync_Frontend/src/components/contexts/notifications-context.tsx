"use client"

import React, { createContext, useContext, useMemo, useState, useCallback } from "react"
import { MessageSquare, GitPullRequest, Code, Users } from "lucide-react"

interface Notification {
  id: number
  type: "mention" | "pull-request" | "commit" | "team"
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
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "mention",
    read: false,
    title: "You were mentioned in a comment",
    message: "Alex mentioned you in a comment on the 'User Authentication' task.",
    time: "10 minutes ago",
    project: "DevSync Web App",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: 2,
    type: "pull-request",
    read: false,
    title: "New pull request requires your review",
    message: "Sarah created a pull request 'Add user settings page' and requested your review.",
    time: "1 hour ago",
    project: "DevSync Web App",
    icon: <GitPullRequest className="h-5 w-5" />,
  },
  {
    id: 3,
    type: "commit",
    read: true,
    title: "New commits pushed to main",
    message: "Michael pushed 5 commits to the main branch.",
    time: "3 hours ago",
    project: "DevSync API",
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: 4,
    type: "team",
    read: true,
    title: "New team member joined",
    message: "Emma Wilson joined the DevSync team.",
    time: "Yesterday",
    project: "DevSync Organization",
    icon: <Users className="h-5 w-5" />,
  },
]

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const raw = localStorage.getItem("notifications")
      return raw ? JSON.parse(raw) : initialNotifications
    } catch {
      return initialNotifications
    }
  })

  const persist = useCallback((next: Notification[]) => {
    setNotifications(next)
    try {
      localStorage.setItem("notifications", JSON.stringify(next))
    } catch {}
  }, [])

  const markAsRead = useCallback((id: number) => {
    persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [notifications, persist])

  const markAllAsRead = useCallback(() => {
    persist(notifications.map((n) => ({ ...n, read: true })))
  }, [notifications, persist])

  const deleteNotification = useCallback((id: number) => {
    persist(notifications.filter((n) => n.id !== id))
  }, [notifications, persist])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  return (
    <NotificationsContext.Provider
      value={{ notifications, setNotifications: persist, markAsRead, markAllAsRead, deleteNotification, unreadCount }}
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
