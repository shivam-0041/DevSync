"use client"

import type React from "react"
import { toast } from "sonner";
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Code, User, Shield, Bell, Globe, Github, Twitter, Linkedin, Trash2, LogOut, Check } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Avatar, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { fetchUserProfile, updateUserProfile } from '../routes/profile'
export default function AccountSettings() {
    const [profileImage, setProfileImage] = useState<string>("/def-avatar.svg")
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
    const [newSkill, setNewSkill] = useState("");

    const [formData, setFormData] = useState<any>({
        avatar: null,
        name: "",
        username: "",
        email: "",
        location: "",
        bio: "",
        github: "",
        linkedin: "",
        personal_website: "",
        twitter: "",
        skills: [],
        company: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            const data = await fetchUserProfile();
            if (data) {
                const avatar = data.avatar;

                const isInvalidAvatar =
                    !avatar ||
                    avatar === "null" ||
                    avatar === "undefined" ||
                    avatar.includes("placeholder.svg");

                setProfileImage(isInvalidAvatar ? "/def-avatar.svg" : avatar);

                
                const { socialLinks = {}, skills = [], ...rest } = data;

                //console.log("Profile data loaded:", data);
                setFormData(prev =>({
                    ...prev,
                    ...data,
                    ...socialLinks,
                    skills: data.skills?.skill || [],
                }));
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newSkill.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(newSkill.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, newSkill.trim()],
                }));
            }
            setNewSkill(""); // Clear input
        }
    };

    const handleRemoveSkill = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== indexToRemove),
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview of selected image
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setProfileImage(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);

        // Update formData state with the selected file
        setFormData((prev: any) => ({
            ...prev,
            avatar: file,
        }));
    };

    const handleRemoveAvatar = () => {
        setFormData((prev: any) => ({
            ...prev,
            avatar: null,
        }));
        setProfileImage('/def-avatar.svg');
        toast("Avatar removed");
    };
    


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus("saving");

        const form = new FormData();

        if (formData.avatar instanceof File) {
            form.append("avatar", formData.avatar);
        } else if (formData.avatar === null) {
            form.append("avatar", "");
        }

        if (formData.name) form.append("full_name", formData.name);
        if (formData.username) form.append("username", formData.username);
        if (formData.email) form.append("email", formData.email);
        if (formData.location) form.append("location", formData.location);
        if (formData.bio) form.append("bio", formData.bio);
        if (formData.company) form.append("company", formData.company);

        if (formData.skills?.length > 0) {
            form.append("skills", JSON.stringify({ skill: formData.skills }));
        }
        
        if (formData.github) form.append("github", formData.github);
        if (formData.linkedin) form.append("linkedin", formData.linkedin);
        if (formData.twitter) form.append("twitter", formData.twitter);
        if (formData.personal_website) form.append("personal_website", formData.personal_website);

        console.log(formData)

        const result = await updateUserProfile(form);

        if (result?.success) {
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
            setSaveStatus("idle");
            
        }
    };
    const navigate = useNavigate();
    const handleSignOut = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <Link to="/dashboard/:username" className="flex items-center gap-2">
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
                            <Link to="/profile/:username">
                                <Avatar>
                                    <AvatarImage src={profileImage} alt="User" />
                                </Avatar>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                            <p className="text-zinc-400">Manage your account preferences and settings</p>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={saveStatus === "saving"}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            {saveStatus === "idle" && "Save Changes"}
                            {saveStatus === "saving" && "Saving..."}
                            {saveStatus === "saved" && (
                                <>
                                    <Check className="mr-2 h-4 w-4" /> Saved
                                </>
                            )}
                        </Button>
                    </div>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="bg-zinc-800 mb-6">
                            <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-700">
                                <User className="h-4 w-4 mr-2" /> Profile
                            </TabsTrigger>
                            <TabsTrigger value="security" className="data-[state=active]:bg-zinc-700">
                                <Shield className="h-4 w-4 mr-2" /> Security
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="data-[state=active]:bg-zinc-700">
                                <Bell className="h-4 w-4 mr-2" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="integrations" className="data-[state=active]:bg-zinc-700">
                                <Globe className="h-4 w-4 mr-2" /> Integrations
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Profile Information</CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Update your personal information and public profile
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex flex-col items-center gap-4">
                                            <Avatar className="h-32 w-32">
                                                <AvatarImage src={profileImage} alt="User" />
                                                </Avatar>
                                            <div className="flex gap-2">
                                                <label htmlFor="avatar">
                                                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                                                        <span>Change Avatar</span>
                                                    </Button>
                                                    <input
                                                        id="avatar"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <Button variant="outline" size="sm"  className="text-red-500 hover:text-red-400" onClick={handleRemoveAvatar}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-zinc-300">
                                                        Full Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="bg-zinc-800 border-zinc-700 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="username" className="text-zinc-300">
                                                        Username
                                                    </Label>
                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        className="bg-zinc-800 border-zinc-700 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-zinc-300">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        type="email"
                                                        className="bg-zinc-800 border-zinc-700 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="location" className="text-zinc-300">
                                                        Location
                                                    </Label>
                                                    <Input
                                                        id="location"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                        className="bg-zinc-800 border-zinc-700 text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bio" className="text-zinc-300">
                                                    Bio
                                                </Label>
                                                <Textarea
                                                    id="bio"
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Social Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-zinc-300 flex items-center gap-2">
                                                    <Github className="h-4 w-4" /> GitHub
                                                </Label>
                                                <Input
                                                    id="github"
                                                    name="github"
                                                    value={formData.github}
                                                    onChange={handleChange}
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-300 flex items-center gap-2">
                                                    <Twitter className="h-4 w-4" /> Twitter
                                                </Label>
                                                <Input
                                                    id="twitter"
                                                    name="twitter"
                                                    value={formData.twitter}
                                                    onChange={handleChange}
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-300 flex items-center gap-2">
                                                    <Linkedin className="h-4 w-4" /> LinkedIn
                                                </Label>
                                                <Input
                                                    id="linkedin"
                                                    name="linkedin"
                                                    value={formData.linkedin}
                                                    onChange={handleChange}
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-300 flex items-center gap-2">
                                                    <Globe className="h-4 w-4" /> Website
                                                </Label>
                                                <Input
                                                    id="personal_website"
                                                    name="personal_website"
                                                    value={formData.personal_website}
                                                    onChange={handleChange}
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Skills & Expertise</h3>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-300">Skills</Label>
                                            <div className="flex flex-wrap gap-2 p-3 bg-zinc-800 rounded-md border border-zinc-700">
                                                {formData.skills?.map((skill: string, index: number) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="bg-zinc-700 text-zinc-300 flex items-center gap-1"
                                                    >
                                                        {skill}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-4 w-4 rounded-full hover:bg-zinc-600 p-0 ml-1"
                                                            onClick={() => handleRemoveSkill(index)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </Badge>
                                                ))}
                                                <Input
                                                    placeholder="Add a skill..."
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyDown={handleAddSkill}
                                                    className="bg-zinc-700 border-zinc-600 text-white w-32 h-6 text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-zinc-800 pt-6 flex justify-between">
                                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={saveStatus === "saving"}
                                        className="bg-emerald-500 hover:bg-emerald-600"
                                    >
                                        {saveStatus === "idle" && "Save Changes"}
                                        {saveStatus === "saving" && "Saving..."}
                                        {saveStatus === "saved" && (
                                            <>
                                                <Check className="mr-2 h-4 w-4" /> Saved
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Password & Authentication</CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Manage your password and security settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Change Password</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password" className="text-zinc-300">
                                                    Current Password
                                                </Label>
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    placeholder="��������"
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password" className="text-zinc-300">
                                                    New Password
                                                </Label>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    placeholder="��������"
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password" className="text-zinc-300">
                                                    Confirm New Password
                                                </Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    placeholder="��������"
                                                    className="bg-zinc-800 border-zinc-700 text-white"
                                                />
                                            </div>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 mt-2">Update Password</Button>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-zinc-300">Protect your account with 2FA</p>
                                                <p className="text-sm text-zinc-500">
                                                    Add an extra layer of security by requiring a verification code
                                                </p>
                                            </div>
                                            <Switch id="2fa" />
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Sessions</h3>
                                        <div className="space-y-4">
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">Current Session</p>
                                                        <p className="text-sm text-zinc-500">San Francisco, CA � Chrome on macOS</p>
                                                        <p className="text-xs text-zinc-500 mt-1">Started 2 hours ago</p>
                                                    </div>
                                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                                                </div>
                                            </div>
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">Mobile App</p>
                                                        <p className="text-sm text-zinc-500">San Francisco, CA � iOS App</p>
                                                        <p className="text-xs text-zinc-500 mt-1">Last active 3 days ago</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-400">
                                                        Revoke
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Danger Zone</CardTitle>
                                    <CardDescription className="text-zinc-400">Irreversible and destructive actions</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-red-950/20 border border-red-900/50 rounded-md p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-red-400 font-medium">Delete Account</h3>
                                                <p className="text-sm text-zinc-400">Permanently delete your account and all of your content</p>
                                            </div>
                                            <Button variant="destructive">Delete Account</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Notification Preferences</CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Manage how and when you receive notifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-300">Project updates</p>
                                                    <p className="text-sm text-zinc-500">Receive updates about projects you're involved in</p>
                                                </div>
                                                <Switch id="project-updates" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-300">Comments and mentions</p>
                                                    <p className="text-sm text-zinc-500">
                                                        Receive notifications when someone mentions or replies to you
                                                    </p>
                                                </div>
                                                <Switch id="comments-mentions" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-300">Pull requests and issues</p>
                                                    <p className="text-sm text-zinc-500">Receive notifications about pull requests and issues</p>
                                                </div>
                                                <Switch id="pr-issues" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-300">Security alerts</p>
                                                    <p className="text-sm text-zinc-500">Receive notifications about security vulnerabilities</p>
                                                </div>
                                                <Switch id="security-alerts" defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Web Notifications</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-300">Enable browser notifications</p>
                                                    <p className="text-sm text-zinc-500">
                                                        Receive notifications in your browser when you're using the app
                                                    </p>
                                                </div>
                                                <Switch id="browser-notifications" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-300">Sound alerts</p>
                                                    <p className="text-sm text-zinc-500">Play a sound when you receive a notification</p>
                                                </div>
                                                <Switch id="sound-alerts" />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Notification Frequency</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="frequency" className="text-zinc-300">
                                                Email Digest Frequency
                                            </Label>
                                            <Select defaultValue="daily">
                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                    <SelectItem value="realtime">Real-time</SelectItem>
                                                    <SelectItem value="daily">Daily digest</SelectItem>
                                                    <SelectItem value="weekly">Weekly digest</SelectItem>
                                                    <SelectItem value="never">Never</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-zinc-800 pt-6 flex justify-between">
                                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                        Reset to Defaults
                                    </Button>
                                    <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600">
                                        Save Preferences
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="integrations" className="space-y-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Connected Services</CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Manage third-party services and integrations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Version Control</h3>
                                        <div className="space-y-4">
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <Github className="h-8 w-8 text-white" />
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">GitHub</p>
                                                        <p className="text-sm text-zinc-500">Connected as @johndoe</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                                                    Disconnect
                                                </Button>
                                            </div>
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        className="h-8 w-8 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M22.65 14.39L12 22.13L1.35 14.39C1.20722 14.285 1.10132 14.1375 1.04743 13.9687C0.993548 13.7998 0.994347 13.6183 1.05 13.45L3.11 7.19L9.45 9.83L12 5L14.55 9.83L20.89 7.19L22.95 13.45C23.0056 13.6183 23.0065 13.7998 22.9526 13.9687C22.8987 14.1375 22.7928 14.285 22.65 14.39Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">GitLab</p>
                                                        <p className="text-sm text-zinc-500">Not connected</p>
                                                    </div>
                                                </div>
                                                <Button className="bg-emerald-500 hover:bg-emerald-600">Connect</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Productivity Tools</h3>
                                        <div className="space-y-4">
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        className="h-8 w-8 text-blue-400"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M5.9 8.1L4.5 5.5L1.9 4.1L4.5 2.7L5.9 0.1L7.3 2.7L9.9 4.1L7.3 5.5L5.9 8.1ZM18.1 8.1L16.7 5.5L14.1 4.1L16.7 2.7L18.1 0.1L19.5 2.7L22.1 4.1L19.5 5.5L18.1 8.1ZM12 24L10.6 21.4L8 20L10.6 18.6L12 16L13.4 18.6L16 20L13.4 21.4L12 24ZM12 15.6L9.7 11.2L5.3 8.9L9.7 6.6L12 2.2L14.3 6.6L18.7 8.9L14.3 11.2L12 15.6Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">Jira</p>
                                                        <p className="text-sm text-zinc-500">Connected to Acme Inc. workspace</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                                                    Configure
                                                </Button>
                                            </div>
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        className="h-8 w-8 text-purple-400"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M19.82 4.74C19.6 4.52 19.33 4.37 19.04 4.28C18.75 4.2 18.45 4.2 18.16 4.28C17.87 4.37 17.6 4.52 17.38 4.74L16 6.12L17.88 8L19.26 6.62C19.48 6.4 19.63 6.13 19.72 5.84C19.8 5.55 19.8 5.24 19.72 4.95C19.63 4.66 19.48 4.39 19.26 4.17L19.82 4.74ZM16 8L14.12 6.12L5.5 14.74V16.62H7.38L16 8Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">Slack</p>
                                                        <p className="text-sm text-zinc-500">Not connected</p>
                                                    </div>
                                                </div>
                                                <Button className="bg-emerald-500 hover:bg-emerald-600">Connect</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-zinc-800" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">API Access</h3>
                                        <div className="space-y-4">
                                            <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-zinc-300 font-medium">Personal Access Tokens</p>
                                                        <p className="text-sm text-zinc-500">
                                                            Tokens you've generated that can be used to access the API
                                                        </p>
                                                    </div>
                                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                                                        Generate Token
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center p-2 hover:bg-zinc-700 rounded-md">
                                                        <div>
                                                            <p className="text-zinc-300">Development Token</p>
                                                            <p className="text-xs text-zinc-500">Created 30 days ago � Expires in 60 days</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400">
                                                            Revoke
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Account Management</CardTitle>
                            <CardDescription className="text-zinc-400">Manage your account status and subscription</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Pro Plan</h3>
                                    <p className="text-sm text-zinc-400">Your subscription renews on August 1, 2023</p>
                                </div>
                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                    Manage Subscription
                                </Button>
                            </div>

                            <Separator className="bg-zinc-800" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Account Status</h3>
                                    <p className="text-sm text-zinc-400">Your account is in good standing</p>
                                </div>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                            </div>

                            <Separator className="bg-zinc-800" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-red-400">Sign Out</h3>
                                    <p className="text-sm text-zinc-400">Sign out of your account on this device</p>
                                </div>
                                <Button variant="outline" className="border-zinc-700 text-red-400 hover:text-red-300 hover:bg-zinc-800"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
