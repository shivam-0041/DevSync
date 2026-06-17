import { Link } from "react-router-dom"
import {
  Code,
  Settings,
  User,
  Mail,
  MapPin,
  LinkIcon,
  Calendar,
  Edit,
  Github,
  Twitter,
  Linkedin,
  GitBranch,
  Star,
  Folder,
  Users,
  PenSquare,
  GitCommit,
  GitPullRequest,
  AlertCircle,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { getBrandHomePath } from "../lib/brand-link"
import { fetchUserProfile, fetchFollowers, fetchFollowing, fetchUserActivity, type SocialConnection } from '../routes/profile';
import { fetchProjects } from '../routes/projects';
import { useState, useEffect, useMemo } from 'react';

const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
        JavaScript: "yellow-500",
        TypeScript: "emerald-500",
        Python: "blue-500",
        Java: "red-500",
        "C++": "pink-500",
        "C#": "purple-500",
        Go: "cyan-500",
        Rust: "orange-500",
        PHP: "indigo-500",
        Ruby: "red-600",
    };
    return colors[language] || "gray-500";
};

export default function ProfilePage() {

    const [profileImage, setProfileImage] = useState<string>("/def-avatar.svg")
    //const loggedInUser = JSON.parse(localStorage.getItem("username"));

    const [user, setUser] = useState<any>({});
    const [repositories, setRepositories] = useState<any[]>([]);
    const [isConnectionsOpen, setIsConnectionsOpen] = useState(false)
    const [activeConnectionsTab, setActiveConnectionsTab] = useState<"followers" | "following">("followers")
    const [followersList, setFollowersList] = useState<SocialConnection[]>([])
    const [followingList, setFollowingList] = useState<SocialConnection[]>([])
    const [isConnectionsLoading, setIsConnectionsLoading] = useState(false)
    const [activities, setActivities] = useState<any[]>([])

    const totalContributions = useMemo(() => {
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        return activities.filter((act: any) => act.timestamp && new Date(act.timestamp) >= oneYearAgo).length
    }, [activities])
    // Fetch user profile data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await fetchUserProfile();
                const avatar = profileData.avatar;

                const isInvalidAvatar =
                    !avatar ||
                    avatar === "null" ||
                    avatar === "undefined" ||
                    avatar.includes("placeholder.svg");

                setProfileImage(isInvalidAvatar ? "/def-avatar.svg" : avatar);

                

                // Map backend fields to frontend template
                setUser({
                    name: profileData.name,
                    username: profileData.username,
                    avatar: profileData.avatar,
                    bio: profileData.bio || "",
                    location: profileData.location || "",
                    email: profileData.email,
                    website: profileData.website || "",
                    joinedDate: profileData.joinedDate,
                    company: profileData.company || "",
                    followers: profileData.followers || 0,
                    following: profileData.following || 0,
                    repositories: 0, // Will be updated after fetching repos
                    contributions: profileData.contributions || 0,
                    skills: Array.isArray(profileData.skills) ? profileData.skills : (profileData.skills?.skill ? profileData.skills.skill : []),
                    socialLinks: {
                        github: profileData.socialLinks?.github || "",
                        linkedin: profileData.socialLinks?.linkedin || "",
                        personal_website: profileData.socialLinks?.personal_website || "",
                        twitter: profileData.socialLinks?.twitter || "",
                    },
                });

                // Fetch repositories
                const projectsData = await fetchProjects();
                const formattedRepos = projectsData.map((repo: any) => ({
                    name: repo.name,
                    description: repo.description,
                    language: repo.languages || "Unknown",
                    languageColor: getLanguageColor(repo.languages),
                    stars: repo.stars,
                    forks: repo.forks,
                    lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
                    isPrivate: repo.visibility === 'private',
                    slug: repo.slug,
                }));
                setRepositories(formattedRepos);

                // Update user repositories count
                setUser((prevUser: any) => ({
                    ...prevUser,
                    repositories: formattedRepos.length,
                }));

                // Fetch activities
                if (profileData?.username) {
                    const activityData = await fetchUserActivity(profileData.username);
                    setActivities(Array.isArray(activityData?.activities) ? activityData.activities : []);
                }

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const openConnectionsDialog = async (tab: "followers" | "following") => {
      if (!user?.username) {
        return
      }

      setActiveConnectionsTab(tab)
      setIsConnectionsOpen(true)
      setIsConnectionsLoading(true)

      try {
        const [followersData, followingData] = await Promise.all([
          fetchFollowers(user.username),
          fetchFollowing(user.username),
        ])
        setFollowersList(followersData)
        setFollowingList(followingData)
      } finally {
        setIsConnectionsLoading(false)
      }
    }


  // Sample user data
  //const user = {
  //  name: "John Doe",
  //  username: "johndoe",
  //  avatar: "/placeholder.svg?height=200&width=200",
  //  bio: "Full-stack developer passionate about building great user experiences. I love working with React, Node.js, and TypeScript.",
  //  location: "San Francisco, CA",
  //  email: "john.doe@example.com",
  //  website: "https://johndoe.dev",
  //  joinedDate: "January 2020",
  //  company: "Acme Inc.",
  //  followers: 245,
  //  following: 123,
  //  repositories: 32,
  //  contributions: 867,
  //  skills: ["JavaScript", "TypeScript", "React", "Node.js", "GraphQL", "MongoDB", "AWS"],
  //  socialLinks: {
  //    github: "github.com/johndoe",
  //    twitter: "twitter.com/johndoe",
  //    linkedin: "linkedin.com/in/johndoe",
  //  },
  //}

  // Sample repositories data
  // const repositories = [
  //   {
  //     name: "E-commerce Platform",
  //     description: "A modern e-commerce platform with React and Node.js",
  //     language: "JavaScript",
  //     languageColor: "yellow-500",
  //     stars: 124,
  //     forks: 32,
  //     lastUpdated: "2 days ago",
  //     isPrivate: false,
  //   },
  //   {
  //     name: "AI Image Generator",
  //     description: "Generate images using machine learning models",
  //     language: "Python",
  //     languageColor: "blue-500",
  //     stars: 87,
  //     forks: 15,
  //     lastUpdated: "1 week ago",
  //     isPrivate: true,
  //   },
  //   {
  //     name: "React Component Library",
  //     description: "A collection of reusable React components",
  //     language: "TypeScript",
  //     languageColor: "emerald-500",
  //     stars: 215,
  //     forks: 45,
  //     lastUpdated: "3 days ago",
  //     isPrivate: false,
  //   },
  //   {
  //     name: "Personal Website",
  //     description: "My personal portfolio website built with Next.js",
  //     language: "TypeScript",
  //     languageColor: "emerald-500",
  //     stars: 12,
  //     forks: 3,
  //     lastUpdated: "1 month ago",
  //     isPrivate: false,
  //   },
  // ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={getBrandHomePath()} className="flex items-center gap-2">
              <Code className="h-6 w-6 text-emerald-500" />
              <span className="font-bold">DevSync</span>
            </Link>
            <div className="flex items-center gap-2">
                <Link to={`/${user.username}/account/settings`}>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" /> Settings
                  </Button>
                </Link>
                <Link to={`/dashboard/${user.username}`}>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-40 w-40 mb-4">
                <AvatarImage src={profileImage} alt={user.name} />
              </Avatar>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">@{user.username}</p>
              <p className="text-sm mb-4">{user.bio}</p>
              <Link to={`/${user.username}/account/settings`} className="w-full">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </Link>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm">{user.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm">{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-zinc-500" />
                  <a href={user.website} className="text-sm text-emerald-500 hover:underline">
                    {user.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm">Joined {user.joinedDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-zinc-500" />
                    {user.socialLinks?.github && (
                        <a
                            href={user.socialLinks.github}
                            className="text-sm text-emerald-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {user.socialLinks.github}
                        </a>
                    )}
                  
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-zinc-500" />
                    {user.socialLinks?.twitter && (
                        <a href={user.socialLinks.twitter}
                            className="text-sm text-emerald-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {user.socialLinks.twitter}
                        </a>
                    )}
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-zinc-500" />
                    {user.socialLinks?.linkedin && (
                        <a
                        href={user.socialLinks.linkedin}
                        className="text-sm text-emerald-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                            {user.socialLinks.linkedin}
                        </a>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Skills</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(user.skills) && user.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800">
                            {skill}
                        </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-8">
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Folder className="h-5 w-5" />
                    <span className="font-medium">{user.repositories}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">repositories</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openConnectionsDialog("followers")}
                    className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{user.followers}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">followers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openConnectionsDialog("following")}
                    className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{user.following}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">following</span>
                  </button>
                </div>
                <div>
                  <Link to={`/${user.username}/new-repo`}>
                    <Button variant="outline" size="sm">
                      <PenSquare className="h-4 w-4 mr-1" /> Create Repository
                    </Button>
                  </Link>
                </div>
              </div>

              <Tabs defaultValue="repositories">
                <TabsList className="p-0 bg-transparent border-b border-zinc-200 dark:border-zinc-800 rounded-none w-full justify-start">
                  <TabsTrigger
                    value="repositories"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:shadow-none"
                  >
                    Repositories
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:shadow-none"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="contributions"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:shadow-none"
                  >
                    Contributions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="repositories" className="p-4 m-0">
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Find a repository..."
                        className="w-full p-2 pl-8 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {repositories.map((repo, index) => (
                      <RepositoryItem key={index} repo={repo} username={user.username} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="p-4 m-0">
                  <div className="space-y-6">
                    {activities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="contributions" className="p-4 m-0">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium mb-2">Contribution Graph</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                      {totalContributions} contributions in the last year
                    </p>
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md p-4">
                      <ContributionGraph activities={activities} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <Dialog open={isConnectionsOpen} onOpenChange={setIsConnectionsOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{activeConnectionsTab === "followers" ? "Followers" : "Following"}</DialogTitle>
            </DialogHeader>

            <Tabs value={activeConnectionsTab} onValueChange={(value) => setActiveConnectionsTab(value as "followers" | "following") }>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="followers">Followers ({followersList.length})</TabsTrigger>
                <TabsTrigger value="following">Following ({followingList.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="followers" className="mt-4">
                <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                  {isConnectionsLoading && <p className="text-sm text-zinc-500">Loading followers...</p>}
                  {!isConnectionsLoading && followersList.length === 0 && (
                    <p className="text-sm text-zinc-500">No followers yet.</p>
                  )}
                  {!isConnectionsLoading && followersList.map((person) => (
                    <Link
                      key={`follower-${person.id}`}
                      to={`/p/${person.username}`}
                      className="flex items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar>
                          <AvatarImage src={person.avatar || "/def-avatar.svg"} alt={person.name} />
                          <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{person.name}</p>
                          <p className="text-sm text-zinc-500 truncate">@{person.username}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="following" className="mt-4">
                <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                  {isConnectionsLoading && <p className="text-sm text-zinc-500">Loading following...</p>}
                  {!isConnectionsLoading && followingList.length === 0 && (
                    <p className="text-sm text-zinc-500">Not following anyone yet.</p>
                  )}
                  {!isConnectionsLoading && followingList.map((person) => (
                    <Link
                      key={`following-${person.id}`}
                      to={`/p/${person.username}`}
                      className="flex items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar>
                          <AvatarImage src={person.avatar || "/def-avatar.svg"} alt={person.name} />
                          <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{person.name}</p>
                          <p className="text-sm text-zinc-500 truncate">@{person.username}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

function RepositoryItem({ repo, username }: { repo: any; username: string }) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-emerald-500 hover:underline">
              <Link to={`/${username}/project/${repo.slug}`}>{repo.name}</Link>
            </h3>
            {repo.isPrivate && (
              <Badge variant="outline" className="text-xs">
                Private
              </Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{repo.description}</p>
        </div>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4 mr-1" /> Star
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className={`h-3 w-3 rounded-full bg-${repo.languageColor}`}></span>
          {repo.language}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitBranch className="h-3.5 w-3.5" />
          {repo.forks}
        </span>
        <span>Updated {repo.lastUpdated}</span>
      </div>
    </div>
  )
}

function formatRelativeTime(iso: string): string {
  if (!iso) return ""
  try {
    const date = new Date(iso)
    if (isNaN(date.getTime())) return ""
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return ""
  }
}

function ActivityItem({ activity }: { activity: any }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-5 w-5 text-emerald-500" />
      case "pull-request":
        return <GitPullRequest className="h-5 w-5 text-purple-500" />
      case "issue":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "star":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "fork":
        return <GitBranch className="h-5 w-5 text-blue-500" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  return (
    <div className="flex gap-4">
      <div className="mt-1">{getActivityIcon(activity.type)}</div>
      <div>
        <p className="text-sm">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{activity.repo}</span>: {activity.description}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  )
}

interface ActivityItemType {
    id: string
    type: string
    action: string
    description: string
    timestamp: string
    repo: string
    project: string
    project_slug: string
    project_owner: string
}

function ContributionGraph({ activities }: { activities: ActivityItemType[] }) {
    const { weeks, months } = useMemo(() => {
        const dateMap: Record<string, number> = {}
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

        activities.forEach((act) => {
            if (!act.timestamp) return
            const date = new Date(act.timestamp)
            if (date >= oneYearAgo) {
                const key = date.toISOString().split("T")[0]
                dateMap[key] = (dateMap[key] || 0) + 1
            }
        })

        const today = new Date()
        today.setHours(23, 59, 59, 999)

        const start = new Date(today)
        start.setDate(start.getDate() - 364)
        start.setDate(start.getDate() - start.getDay()) // rewind to Sunday

        const weeksData: { date: string; count: number; future: boolean }[][] = []
        const monthLabels: { label: string; week: number }[] = []
        const cursor = new Date(start)
        let lastMonth = -1

        for (let w = 0; w < 53; w++) {
            const week: { date: string; count: number; future: boolean }[] = []
            for (let d = 0; d < 7; d++) {
                const dateStr = cursor.toISOString().split("T")[0]
                const future = cursor > today
                week.push({ date: dateStr, count: dateMap[dateStr] || 0, future })
                const m = cursor.getMonth()
                if (d === 0 && m !== lastMonth && !future) {
                    monthLabels.push({
                        label: cursor.toLocaleDateString("en-US", { month: "short" }),
                        week: w,
                    })
                    lastMonth = m
                }
                cursor.setDate(cursor.getDate() + 1)
            }
            weeksData.push(week)
        }

        const total = Object.values(dateMap).reduce((s, c) => s + c, 0)
        return { weeks: weeksData, months: monthLabels, totalContributions: total }
    }, [activities])

    const getContributionColor = (count: number, future: boolean) => {
        if (future) return "bg-zinc-100 dark:bg-zinc-900"
        if (count === 0) return "bg-zinc-100 dark:bg-zinc-800"
        if (count === 1) return "bg-emerald-100 dark:bg-emerald-900"
        if (count <= 3) return "bg-emerald-300 dark:bg-emerald-700"
        if (count <= 6) return "bg-emerald-500 dark:bg-emerald-500"
        return "bg-emerald-700 dark:bg-emerald-300"
    }

    const days = ["", "Mon", "", "Wed", "", "Fri", ""]

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="flex mb-2">
                    <div className="w-8"></div>
                    <div className="flex-1 flex justify-between">
                        {months.map((month, i) => (
                            <div key={i} className="text-xs text-zinc-500 dark:text-zinc-400">
                                {month.label}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex">
                    <div className="w-8 flex flex-col justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        {days.map((day, i) => (
                            <div key={i} className="h-3 flex items-center">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}>
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-rows-7 gap-1">
                                {week.map((day, dayIndex) => {
                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`h-3 w-3 rounded-sm ${getContributionColor(day.count, day.future)}`}
                                            title={day.future ? "" : `${day.date}: ${day.count} contributions`}
                                        ></div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-2 items-center gap-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Less</span>
                    <div className={`h-3 w-3 rounded-sm ${getContributionColor(0, false)}`}></div>
                    <div className={`h-3 w-3 rounded-sm ${getContributionColor(1, false)}`}></div>
                    <div className={`h-3 w-3 rounded-sm ${getContributionColor(3, false)}`}></div>
                    <div className={`h-3 w-3 rounded-sm ${getContributionColor(6, false)}`}></div>
                    <div className={`h-3 w-3 rounded-sm ${getContributionColor(7, false)}`}></div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">More</span>
                </div>
            </div>
        </div>
    )
}

function Search({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
