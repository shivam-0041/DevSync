import { Link, useParams, useNavigate } from "react-router-dom"
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
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { fetchUserProfile } from '../routes/profile';
import { fetchProjects } from '../routes/projects';
import { useState, useEffect } from 'react';

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

    const navigate = useNavigate();
    const { username } = useParams();
    const [profileImage, setProfileImage] = useState<string>("/def-avatar.svg")
    //const loggedInUser = JSON.parse(localStorage.getItem("username"));

    const [user, setUser] = useState({});
    const [repositories, setRepositories] = useState([]);
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
                const formattedRepos = projectsData.map(repo => ({
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
                setUser(prevUser => ({
                    ...prevUser,
                    repositories: formattedRepos.length,
                }));

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);


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

  // Sample activity data
  const activities = [
    {
      type: "commit",
      repo: "E-commerce Platform",
      description: "Added product search functionality",
      time: "2 days ago",
    },
    {
      type: "pull-request",
      repo: "React Component Library",
      description: "Implemented dark mode for all components",
      time: "4 days ago",
    },
    {
      type: "issue",
      repo: "AI Image Generator",
      description: "Fixed memory leak in image processing",
      time: "1 week ago",
    },
    {
      type: "star",
      repo: "Next.js",
      description: "Starred vercel/next.js",
      time: "1 week ago",
    },
    {
      type: "fork",
      repo: "TypeScript",
      description: "Forked microsoft/typescript",
      time: "2 weeks ago",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
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
                  <a to={user.website} className="text-sm text-emerald-500 hover:underline">
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
                    {Array.isArray(user.skills) && user.skills.map((skill, index) => (
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
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{user.followers}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{user.following}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">following</span>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <PenSquare className="h-4 w-4 mr-1" /> Create Repository
                  </Button>
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
                      <RepositoryItem key={index} repo={repo} />
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
                      {user.contributions} contributions in the last year
                    </p>
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md p-4">
                      <ContributionGraph />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function RepositoryItem({ repo }) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-emerald-500 hover:underline">
              <Link to={`/project/${repo.slug}`}>{repo.name}</Link>
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

function ActivityItem({ activity }) {
  const getActivityIcon = (type) => {
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
          <span className="font-medium">{activity.repo}</span>: {activity.description}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{activity.time}</p>
      </div>
    </div>
  )
}

function ContributionGraph() {
  // This is a simplified version of a contribution graph
  // In a real app, you would use actual contribution data

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const weeks = Array.from({ length: 52 }, (_, i) => i)
  const days = ["", "Mon", "", "Wed", "", "Fri", ""]

  // Generate random contribution data
  const getContributionLevel = () => {
    const random = Math.random()
    if (random < 0.6) return 0 // No contributions (60% chance)
    if (random < 0.8) return 1 // Light (20% chance)
    if (random < 0.9) return 2 // Medium (10% chance)
    if (random < 0.97) return 3 // High (7% chance)
    return 4 // Very high (3% chance)
  }

  const contributionLevels = Array.from({ length: 52 * 7 }, () => getContributionLevel())

  const getContributionColor = (level) => {
    switch (level) {
      case 0:
        return "bg-zinc-100 dark:bg-zinc-700"
      case 1:
        return "bg-emerald-100 dark:bg-emerald-900"
      case 2:
        return "bg-emerald-300 dark:bg-emerald-700"
      case 3:
        return "bg-emerald-500 dark:bg-emerald-500"
      case 4:
        return "bg-emerald-700 dark:bg-emerald-300"
      default:
        return "bg-zinc-100 dark:bg-zinc-700"
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex mb-2">
          <div className="w-8"></div>
          <div className="flex-1 flex justify-between">
            {months.map((month, i) => (
              <div key={i} className="text-xs text-zinc-500 dark:text-zinc-400">
                {month}
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
          <div className="flex-1 grid grid-cols-52 gap-1">
            {weeks.map((week) => (
              <div key={week} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }, (_, day) => {
                  const index = week * 7 + day
                  const level = contributionLevels[index]
                  return (
                    <div
                      key={day}
                      className={`h-3 w-3 rounded-sm ${getContributionColor(level)}`}
                      title={`${level} contributions`}
                    ></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-2 items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Less</span>
          <div className={`h-3 w-3 rounded-sm ${getContributionColor(0)}`}></div>
          <div className={`h-3 w-3 rounded-sm ${getContributionColor(1)}`}></div>
          <div className={`h-3 w-3 rounded-sm ${getContributionColor(2)}`}></div>
          <div className={`h-3 w-3 rounded-sm ${getContributionColor(3)}`}></div>
          <div className={`h-3 w-3 rounded-sm ${getContributionColor(4)}`}></div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">More</span>
        </div>
      </div>
    </div>
  )
}

function Search({ className }) {
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

function GitPullRequest({ className }) {
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
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <path d="M6 9v12" />
    </svg>
  )
}

function AlertCircle({ className }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

function GitCommit({ className }) {
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
      <circle cx="12" cy="12" r="3" />
      <line x1="3" x2="9" y1="12" y2="12" />
      <line x1="15" x2="21" y1="12" y2="12" />
    </svg>
  )
}
