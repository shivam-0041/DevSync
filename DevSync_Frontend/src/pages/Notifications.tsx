"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Bell, Code, MessageSquare, GitPullRequest, Users, Clock, CheckCircle2 } from "lucide-react"
import AuthGuard from "../components/auth-guard"

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

interface NotificationSettings {
    email: {
        mentions: boolean
        comments: boolean
        assignments: boolean
        pullRequests: boolean
        teamUpdates: boolean
    }
    push: {
        mentions: boolean
        comments: boolean
        assignments: boolean
        pullRequests: boolean
        teamUpdates: boolean
    }
}

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
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
        {
            id: 5,
            type: "mention",
            read: true,
            title: "You were mentioned in a task",
            message: "David assigned you a task 'Implement password reset functionality'.",
            time: "2 days ago",
            project: "DevSync Web App",
            icon: <MessageSquare className="h-5 w-5" />,
        },
    ])

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        email: {
            mentions: true,
            comments: true,
            assignments: true,
            pullRequests: true,
            teamUpdates: false,
        },
        push: {
            mentions: true,
            comments: false,
            assignments: true,
            pullRequests: true,
            teamUpdates: true,
        },
    })

    const markAsRead = useCallback((id: number) => {
        setNotifications((prev) =>
            prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    }, [])

    const deleteNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, [])

    const toggleSetting = useCallback((category: keyof NotificationSettings, setting: string) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: !prev[category][setting as keyof (typeof prev)[typeof category]],
            },
        }))
    }, [])

    const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications])

    const NotificationCard: React.FC<{
        notification: Notification
        onMarkAsRead: (id: number) => void
        onDelete: (id: number) => void
    }> = React.memo(({ notification, onMarkAsRead, onDelete }) => (
        <Card
            className={`border-gray-800 ${!notification.read ? "bg-gray-900/70 border-l-4 border-l-emerald-500" : "bg-gray-900/50"
                }`}
        >
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${!notification.read ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-800 text-gray-400"
                            }`}
                    >
                        {notification.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                            <h3 className={`font-medium ${!notification.read ? "text-white" : "text-gray-300"}`}>
                                {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onDelete(notification.id)}
                                    className="text-gray-400 hover:text-gray-300"
                                    aria-label="Delete notification"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{notification.message}</p>
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center text-xs text-gray-500">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {notification.time}
                                </span>
                                <span className="text-xs text-gray-500">{notification.project}</span>
                            </div>
                            {!notification.read && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-emerald-500 hover:text-emerald-400"
                                    onClick={() => onMarkAsRead(notification.id)}
                                >
                                    Mark as read
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    ))

    const SettingToggle: React.FC<{
        label: string
        description: string
        checked: boolean
        onCheckedChange: () => void
    }> = React.memo(({ label, description, checked, onCheckedChange }) => (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label htmlFor={label} className="text-base">
                    {label}
                </Label>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <Switch id={label} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    ))

    const EmptyState: React.FC<{ message: string }> = React.memo(({ message }) => (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">{message}</h3>
            <p className="mt-2 text-sm text-gray-400">
                Notifications about mentions, comments, and updates will appear here.
            </p>
        </div>
    ))

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-16">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                        <span className="text-emerald-500">Notifications</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                        Stay updated on mentions, comments, and changes to your projects.
                    </p>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <TabsList className="mb-4 bg-gray-900 sm:mb-0">
                            <TabsTrigger value="all">
                                All
                                {unreadCount > 0 && (
                                    <span className="ml-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-black">{unreadCount}</span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                            <TabsTrigger value="mentions">Mentions</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700"
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark all as read
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="all" className="mt-6">
                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                        onDelete={deleteNotification}
                                    />
                                ))
                            ) : (
                                <EmptyState message="No notifications to display" />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="unread" className="mt-6">
                        <div className="space-y-4">
                            {notifications.filter((n) => !n.read).length > 0 ? (
                                notifications
                                    .filter((notification) => !notification.read)
                                    .map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onDelete={deleteNotification}
                                        />
                                    ))
                            ) : (
                                <EmptyState message="No unread notifications" />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="mentions" className="mt-6">
                        <div className="space-y-4">
                            {notifications.filter((n) => n.type === "mention").length > 0 ? (
                                notifications
                                    .filter((notification) => notification.type === "mention")
                                    .map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onDelete={deleteNotification}
                                        />
                                    ))
                            ) : (
                                <EmptyState message="No mentions to display" />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle>Notification Settings</CardTitle>
                                <CardDescription>Configure how and when you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                                        <div className="space-y-4">
                                            <SettingToggle
                                                label="Mentions"
                                                description="Receive emails when you're mentioned in comments or tasks"
                                                checked={notificationSettings.email.mentions}
                                                onCheckedChange={() => toggleSetting("email", "mentions")}
                                            />
                                            <SettingToggle
                                                label="Comments"
                                                description="Receive emails for new comments on your tasks or code"
                                                checked={notificationSettings.email.comments}
                                                onCheckedChange={() => toggleSetting("email", "comments")}
                                            />
                                            <SettingToggle
                                                label="Assignments"
                                                description="Receive emails when you're assigned to a task"
                                                checked={notificationSettings.email.assignments}
                                                onCheckedChange={() => toggleSetting("email", "assignments")}
                                            />
                                            <SettingToggle
                                                label="Pull Requests"
                                                description="Receive emails for pull request reviews and updates"
                                                checked={notificationSettings.email.pullRequests}
                                                onCheckedChange={() => toggleSetting("email", "pullRequests")}
                                            />
                                            <SettingToggle
                                                label="Team Updates"
                                                description="Receive emails for team announcements and updates"
                                                checked={notificationSettings.email.teamUpdates}
                                                onCheckedChange={() => toggleSetting("email", "teamUpdates")}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="mb-4 text-lg font-medium">Push Notifications</h3>
                                        <div className="space-y-4">
                                            <SettingToggle
                                                label="Mentions"
                                                description="Receive push notifications when you're mentioned"
                                                checked={notificationSettings.push.mentions}
                                                onCheckedChange={() => toggleSetting("push", "mentions")}
                                            />
                                            <SettingToggle
                                                label="Comments"
                                                description="Receive push notifications for new comments"
                                                checked={notificationSettings.push.comments}
                                                onCheckedChange={() => toggleSetting("push", "comments")}
                                            />
                                            <SettingToggle
                                                label="Assignments"
                                                description="Receive push notifications for task assignments"
                                                checked={notificationSettings.push.assignments}
                                                onCheckedChange={() => toggleSetting("push", "assignments")}
                                            />
                                            <SettingToggle
                                                label="Pull Requests"
                                                description="Receive push notifications for pull requests"
                                                checked={notificationSettings.push.pullRequests}
                                                onCheckedChange={() => toggleSetting("push", "pullRequests")}
                                            />
                                            <SettingToggle
                                                label="Team Updates"
                                                description="Receive push notifications for team updates"
                                                checked={notificationSettings.push.teamUpdates}
                                                onCheckedChange={() => toggleSetting("push", "teamUpdates")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthGuard>
    )
}

export default NotificationsPage
