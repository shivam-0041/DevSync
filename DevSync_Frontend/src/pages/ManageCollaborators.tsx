"use client"
import { ProjectInvite } from "../routes/projects"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Search,
  Mail,
  Clock,
  X,
  Shield,
  User,
  UserCog,
  UserMinus,
  UsersRound,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useParams } from "react-router-dom"

type Collaborator = {
  id: number
  name: string
  email: string
  avatar: string
  role: "admin" | "maintainer" | "developer" | "guest"
  joined: string
}

type PendingInvite = {
  id: number
  email: string
  role: "admin" | "maintainer" | "developer" | "guest"
  invited: string
}

type Team = {
  id: number
  name: string
  members: number
  role: "admin" | "maintainer" | "developer" | "guest"
}

const ManageCollaborators = () => {
  const { slug } = useParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<"admin" | "maintainer" | "developer" | "guest">("developer")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  // const [collaborators, setCollaborators] = useState<Collaborator[]>([
  //   {
  //     id: 1,
  //     name: "Alex Johnson",
  //     email: "alex@example.com",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     role: "admin",
  //     joined: "2023-01-15",
  //   },
  //   {
  //     id: 2,
  //     name: "Sarah Williams",
  //     email: "sarah@example.com",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     role: "maintainer",
  //     joined: "2023-02-20",
  //   },
  //   {
  //     id: 3,
  //     name: "Michael Brown",
  //     email: "michael@example.com",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     role: "developer",
  //     joined: "2023-03-10",
  //   },
  //   {
  //     id: 4,
  //     name: "Emily Davis",
  //     email: "emily@example.com",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     role: "developer",
  //     joined: "2023-04-05",
  //   },
  //   {
  //     id: 5,
  //     name: "David Wilson",
  //     email: "david@example.com",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     role: "guest",
  //     joined: "2023-05-12",
  //   },
  // ])

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  // const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
  //   {
  //     id: 1,
  //     email: "jennifer@example.com",
  //     role: "developer",
  //     invited: "2023-06-01",
  //   },
  //   {
  //     id: 2,
  //     email: "robert@example.com",
  //     role: "guest",
  //     invited: "2023-06-05",
  //   },
  // ])

  const [teams, setTeams] = useState<Team[]>([])
  // const [teams, setTeams] = useState<Team[]>([
  //   {
  //     id: 1,
  //     name: "Frontend Team",
  //     members: 8,
  //     role: "maintainer",
  //   },
  //   {
  //     id: 2,
  //     name: "Backend Team",
  //     members: 6,
  //     role: "developer",
  //   },
  //   {
  //     id: 3,
  //     name: "Design Team",
  //     members: 4,
  //     role: "developer",
  //   },
  // ])

  // Fetch project members and pending invites from backend
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem("access")
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        // Fetch project members
        const membersResponse = await fetch(`http://localhost:8000/api/projects/${slug}/members/`, {
          method: "GET",
          headers,
        })

        if (membersResponse.ok) {
          const membersData = await membersResponse.json()
          const formattedCollaborators = membersData.members?.map((member: any) => ({
            id: member.id,
            name: member.user?.first_name && member.user?.last_name 
              ? `${member.user.first_name} ${member.user.last_name}`
              : member.user?.username || "Unknown",
            email: member.user?.email || "",
            avatar: member.user?.profile?.avatar || "/placeholder.svg?height=40&width=40",
            role: member.role,
            joined: new Date(member.created_at).toISOString().split("T")[0],
          })) || []
          setCollaborators(formattedCollaborators)
        } else {
          const errorData = await membersResponse.json().catch(() => ({}))
          console.error("Failed to fetch members:", membersResponse.status, errorData)
        }

        // Fetch pending invites
        const invitesResponse = await fetch(`http://localhost:8000/api/projects/${slug}/pending-invites/`, {
          method: "GET",
          headers,
        })

        if (invitesResponse.ok) {
          const invitesData = await invitesResponse.json()
          const formattedInvites = invitesData.invites?.map((invite: any, index: number) => ({
            id: index + 1,
            email: invite.email,
            role: invite.role_to_assign,
            invited: new Date(invite.created_at).toISOString().split("T")[0],
          })) || []
          setPendingInvites(formattedInvites)
        } else {
          const errorData = await invitesResponse.json().catch(() => ({}))
          console.error("Failed to fetch invites:", invitesResponse.status, errorData)
        }
      } catch (error) {
        console.error("Failed to fetch project data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (slug) {
      fetchProjectData()
    }
  }, [slug])

  const handleInvite = async () => {
    if (!newEmail) {
      toast.error("Please enter an email address")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      const formData = {
        email: newEmail,
        role: newRole,
      }

      const result = await ProjectInvite(slug, formData)

      if (result.success) {
        toast.success(`Invitation sent to ${newEmail}`)
        const newInvite: PendingInvite = {
          id: pendingInvites.length + 1,
          email: newEmail,
          role: newRole,
          invited: new Date().toISOString().split("T")[0],
        }
        setPendingInvites([...pendingInvites, newInvite])
        setNewEmail("")
        setNewRole("developer")
        setIsInviteDialogOpen(false)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to send invitation"
      toast.error(errorMessage)
      console.error("Invite error:", error)
    }
  }

  const handleCancelInvite = (id: number) => {
    setPendingInvites(pendingInvites.filter((invite) => invite.id !== id))
  }

  const handleRemoveCollaborator = (id: number) => {
    setCollaborators(collaborators.filter((collaborator) => collaborator.id !== id))
  }

  const handleChangeRole = (id: number, role: "admin" | "maintainer" | "developer" | "guest") => {
    setCollaborators(
      collaborators.map((collaborator) => (collaborator.id === id ? { ...collaborator, role } : collaborator)),
    )
  }

  const filteredCollaborators = collaborators.filter(
    (collaborator) =>
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Admin</Badge>
      case "maintainer":
        return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Maintainer</Badge>
      case "developer":
        return <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">Developer</Badge>
      case "guest":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Guest</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {isLoadingData && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-3"></div>
            <p className="text-muted-foreground">Loading project data...</p>
          </div>
        </div>
      )}
      
      {!isLoadingData && (
      <>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Collaborators</h1>
            <p className="text-muted-foreground">Manage who has access to this project and what permissions they have</p>
          </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Collaborator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Collaborator</DialogTitle>
              <DialogDescription>Add someone to your project by email address</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <Input
                  id="email"
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium leading-none">
                  Role
                </label>
                <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="maintainer">Maintainer</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {newRole === "admin" && "Full access to all resources"}
                  {newRole === "maintainer" && "Can merge PRs and manage most settings"}
                  {newRole === "developer" && "Can push code and create PRs"}
                  {newRole === "guest" && "Can view code and create issues"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="collaborators" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="collaborators" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Collaborators</CardTitle>
              <CardDescription>Manage individual collaborators and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collaborators..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollaborators.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No collaborators found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCollaborators.map((collaborator) => (
                      <TableRow key={collaborator.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                              <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{collaborator.name}</div>
                              <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(collaborator.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{collaborator.joined}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleChangeRole(collaborator.id, "admin")}>
                                <Shield className="mr-2 h-4 w-4 text-red-500" />
                                Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(collaborator.id, "maintainer")}>
                                <UserCog className="mr-2 h-4 w-4 text-amber-500" />
                                Maintainer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(collaborator.id, "developer")}>
                                <UserCog className="mr-2 h-4 w-4 text-emerald-500" />
                                Developer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(collaborator.id, "guest")}>
                                <User className="mr-2 h-4 w-4 text-blue-500" />
                                Guest
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Remove
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Collaborator</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove {collaborator.name} from this project? They will
                                      lose all access to the project.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>What each role can do in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-500/20 p-2 rounded-md">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Admin</h3>
                    <p className="text-sm text-muted-foreground">
                      Full access to all resources. Can manage collaborators, change settings, and delete the project.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500/20 p-2 rounded-md">
                    <UserCog className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Maintainer</h3>
                    <p className="text-sm text-muted-foreground">
                      Can merge pull requests, manage most settings, and create releases. Cannot delete the project or
                      manage admins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-500/20 p-2 rounded-md">
                    <UserCog className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Developer</h3>
                    <p className="text-sm text-muted-foreground">
                      Can push code, create branches, and open pull requests. Cannot merge to protected branches or
                      change settings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/20 p-2 rounded-md">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Guest</h3>
                    <p className="text-sm text-muted-foreground">
                      Can view code, create issues, and comment on pull requests. Cannot push code or change any
                      settings.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Manage invitations that have been sent but not yet accepted</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingInvites.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No pending invitations</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInvites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{invite.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(invite.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{invite.invited}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelInvite(invite.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancel Invitation</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Resend Invitation</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <div className="mt-4">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send New Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Access</CardTitle>
              <CardDescription>Manage team access to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <UsersRound className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.members} members</Badge>
                      </TableCell>
                      <TableCell>{getRoleBadge(team.role)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Team
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4 text-red-500" />
                              Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4 text-amber-500" />
                              Maintainer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4 text-emerald-500" />
                              Developer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4 text-blue-500" />
                              Guest
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Add Team
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create a New Team</CardTitle>
              <CardDescription>Create a new team to group collaborators together</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="team-name" className="text-sm font-medium leading-none">
                    Team Name
                  </label>
                  <Input id="team-name" placeholder="e.g., Mobile Development Team" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="team-description" className="text-sm font-medium leading-none">
                    Description
                  </label>
                  <Input id="team-description" placeholder="Brief description of the team" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="team-role" className="text-sm font-medium leading-none">
                    Default Role
                  </label>
                  <Select defaultValue="developer">
                    <SelectTrigger id="team-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="maintainer">Maintainer</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </>
      )}
    </div>
  )
}

export default ManageCollaborators;
