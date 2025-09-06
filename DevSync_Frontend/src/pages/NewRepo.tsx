"use client"

import React, { useState, useCallback } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Lock, Globe, Users, FileText, ArrowRight, AlertCircle } from "lucide-react"
import { Link,useNavigate } from "react-router-dom"
import { createProject } from '../routes/projects'
import { toast } from "sonner";
interface FormData {
    name: string
    description: string
    visibility: "public" | "private"
    template: string
    gitignore: string
    license: string
    readme: boolean
    issues: boolean
    wiki: boolean
    projects: boolean
    discussions: boolean
    autoInit: boolean
}

interface FormErrors {
    [key: string]: string | null
}

const NewRepositoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        visibility: "private",
        template: "",
        gitignore: "",
        license: "",
        readme: true,
        issues: true,
        wiki: true,
        projects: true,
        discussions: false,
        autoInit: true,
        
    })
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [errors, setErrors] = useState<FormErrors>({})

    const handleInputChange = useCallback(
        (field: keyof FormData, value: string | boolean) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: null }))
            }
        },
        [errors],
    )

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Repository name is required"
        } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.name)) {
            newErrors.name = "Repository name can only contain letters, numbers, dots, hyphens, and underscores"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData.name])

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) return;

            setIsCreating(true);

            try {
                const response = await createProject(formData);

                if (response.success) {
                    navigate(`/dashboard/${response.project.slug}`);
                } else {
                    toast(`Failed to create project: ${response?.error || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Unexpected error creating project:", error);
                toast("Unexpected error occurred. Please try again.");
            } finally {
                setIsCreating(false);
            }
        }

    const handleVisibilityChange = useCallback(
        (visibility: "public" | "private") => {
            handleInputChange("visibility", visibility)
        },
        [handleInputChange],
    )

    const handleSuggestedName = useCallback(() => {
        handleInputChange("name", "stellar-journey")
    }, [handleInputChange])

    const templates = React.useMemo(
        () => [
            { value: "none", label: "No template" },
            { value: "react-app", label: "React Application" },
            { value: "nextjs-app", label: "Next.js Application" },
            { value: "node-api", label: "Node.js API" },
            { value: "python-flask", label: "Python Flask" },
            { value: "vue-app", label: "Vue.js Application" },
            { value: "express-api", label: "Express.js API" },
        ],
        [],
    )

    const gitignoreTemplates = React.useMemo(
        () => [
            { value: "none", label: "None" },
            { value: "node", label: "Node.js" },
            { value: "python", label: "Python" },
            { value: "java", label: "Java" },
            { value: "react", label: "React" },
            { value: "vue", label: "Vue.js" },
            { value: "go", label: "Go" },
        ],
        [],
    )

    const licenses = React.useMemo(
        () => [
            { value: "none", label: "None" },
            { value: "mit", label: "MIT License" },
            { value: "apache-2.0", label: "Apache License 2.0" },
            { value: "gpl-3.0", label: "GNU General Public License v3.0" },
            { value: "bsd-3-clause", label: "BSD 3-Clause License" },
            { value: "unlicense", label: "The Unlicense" },
        ],
        [],
    )

    const VisibilityOption: React.FC<{
        type: "public" | "private"
        icon: React.ReactNode
        title: string
        description: string
    }> = React.memo(({ type, icon, title, description }) => (
        <div
            className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${formData.visibility === type ? "border-emerald-500 bg-emerald-500/5" : "border-gray-700 hover:border-gray-600"
                }`}
            onClick={() => handleVisibilityChange(type)}
        >
            <input
                type="radio"
                name="visibility"
                value={type}
                checked={formData.visibility === type}
                onChange={() => handleVisibilityChange(type)}
                className="mt-1"
            />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    {icon}
                    <span className="font-medium">{title}</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
        </div>
    ))

    const FeatureToggle: React.FC<{
        field: keyof FormData
        title: string
        description: string
    }> = React.memo(({ field, title, description }) => (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label>{title}</Label>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <Switch checked={formData[field] as boolean} onCheckedChange={(checked) => handleInputChange(field, checked)} />
        </div>
    ))

    return (
        
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create a New <span className="text-emerald-500">Repository</span>
                    </h1>
                    <p className="mt-2 text-gray-400">A repository contains all project files, including the revision history.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card className="border-gray-800 bg-gray-900/50">
                                <CardHeader>
                                    <CardTitle>Repository Details</CardTitle>
                                    <CardDescription>Basic information about your repository</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Repository name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="my-awesome-project"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className={`border-gray-700 bg-gray-800 ${errors.name ? "border-red-500" : ""}`}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 flex items-center">
                                                <AlertCircle className="mr-1 h-4 w-4" />
                                                {errors.name}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            Great repository names are short and memorable. Need inspiration? How about{" "}
                                            <button type="button" className="text-emerald-500 hover:underline" onClick={handleSuggestedName}>
                                                stellar-journey
                                            </button>
                                            ?
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (optional)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="A short description of your repository"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            className="border-gray-700 bg-gray-800"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Visibility</Label>
                                        <div className="space-y-3">
                                            <VisibilityOption
                                                type="public"
                                                icon={<Globe className="h-5 w-5 text-emerald-500" />}
                                                title="Public"
                                                description="Anyone on the internet can see this repository. You choose who can commit."
                                            />
                                            <VisibilityOption
                                                type="private"
                                                icon={<Lock className="h-5 w-5 text-emerald-500" />}
                                                title="Private"
                                                description="You choose who can see and commit to this repository."
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-800 bg-gray-900/50">
                                <CardHeader>
                                    <CardTitle>Initialize Repository</CardTitle>
                                    <CardDescription>Add files to help others understand your project</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="template">Repository template</Label>
                                        <Select value={formData.template} onValueChange={(value) => handleInputChange("template", value)}>
                                            <SelectTrigger className="border-gray-700 bg-gray-800">
                                                <SelectValue placeholder="Choose a template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {templates.map((template) => (
                                                    <SelectItem key={template.value} value={template.value}>
                                                        {template.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-gray-400">
                                            Start with a template to quickly set up your repository structure.
                                        </p>
                                    </div>

                                    <FeatureToggle
                                        field="readme"
                                        title="Add a README file"
                                        description="This is where you can write a long description for your project."
                                    />

                                    <div className="space-y-2">
                                        <Label htmlFor="gitignore">Add .gitignore</Label>
                                        <Select value={formData.gitignore} onValueChange={(value) => handleInputChange("gitignore", value)}>
                                            <SelectTrigger className="border-gray-700 bg-gray-800">
                                                <SelectValue placeholder="Choose .gitignore template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {gitignoreTemplates.map((template) => (
                                                    <SelectItem key={template.value} value={template.value}>
                                                        {template.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-gray-400">Choose which files not to track from a list of templates.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="license">Choose a license</Label>
                                        <Select value={formData.license} onValueChange={(value) => handleInputChange("license", value)}>
                                            <SelectTrigger className="border-gray-700 bg-gray-800">
                                                <SelectValue placeholder="Choose a license" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {licenses.map((license) => (
                                                    <SelectItem key={license.value} value={license.value}>
                                                        {license.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-gray-400">
                                            A license tells others what they can and can't do with your code.{" "}
                                            <a href="#" className="text-emerald-500 hover:underline">
                                                Learn more
                                            </a>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-800 bg-gray-900/50">
                                <CardHeader>
                                    <CardTitle>Features</CardTitle>
                                    <CardDescription>Enable additional features for your repository</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FeatureToggle
                                        field="issues"
                                        title="Issues"
                                        description="Track ideas, feedback, bugs, and other requests."
                                    />
                                    <FeatureToggle field="wiki" title="Wiki" description="Document your project with a wiki." />
                                    <FeatureToggle
                                        field="projects"
                                        title="Projects"
                                        description="Organize and prioritize your work with project boards."
                                    />
                                    <FeatureToggle
                                        field="discussions"
                                        title="Discussions"
                                        description="Enable discussions for community conversations."
                                    />
                                </CardContent>
                            </Card>

                            <div className="flex space-x-4">
                                <Button onClick={handleSubmit} className="bg-emerald-500 text-black hover:bg-emerald-600" disabled={isCreating}>
                                    {isCreating ? (
                                        "Creating repository..."
                                    ) : (
                                        <>
                                            Create repository <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                                <Link to="/dashboard/:username">
                                    <Button variant="outline" className="border-gray-700">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5 text-emerald-500" />
                                    Repository Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Great repository names are:</h4>
                                    <ul className="space-y-1 text-sm text-gray-400">
                                        <li>� Short and memorable</li>
                                        <li>� Descriptive of the project</li>
                                        <li>� Use lowercase letters</li>
                                        <li>� Use hyphens to separate words</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium">README files should include:</h4>
                                    <ul className="space-y-1 text-sm text-gray-400">
                                        <li>� What the project does</li>
                                        <li>� How to install and use it</li>
                                        <li>� How to contribute</li>
                                        <li>� License information</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-900/50">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-emerald-500" />
                                    Import Repository
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400 mb-4">Already have a repository elsewhere? Import it to DevSync.</p>
                                <Link to="/import-repository">
                                    <Button variant="outline" className="w-full border-gray-700">
                                        Import repository
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        
    )
}

export default NewRepositoryPage
