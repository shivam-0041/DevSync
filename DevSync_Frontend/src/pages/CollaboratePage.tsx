"use client"
import { Link, useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import {
    Code,
    MessageSquare,
    Users,
    FileCode,
    Send,
    Plus,
    Video,
    Mic,
    Share2,
    MoreHorizontal,
    GitBranch,
    GitCommit,
    Save,
    Folder,
    ChevronUp,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { ScrollArea } from "../components/ui/scroll-area"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/projects/";

export default function CollaboratePage() {
    const { username, slug: projectSlug } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const folderId = searchParams.get('folder');
    const folderName = location.state?.folderName || 'Folder';
    const [folderContents, setFolderContents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Sample project data - kept for reference
    const project = {
        slug: projectSlug,
        name: "E-commerce Platform",
        owner: username,
        collaborators: [
            { name: "John Doe", username: "johndoe", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
            { name: "Alex Kim", username: "alexkim", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
            { name: "Maria Torres", username: "mariatorres", status: "away", avatar: "/placeholder.svg?height=40&width=40" },
            { name: "Liam Miller", username: "liammiller", status: "offline", avatar: "/placeholder.svg?height=40&width=40" },
        ],
        files: [
            {
                name: "src",
                type: "folder",
                children: [
                    {
                        name: "components",
                        type: "folder",
                        children: [
                            { name: "ProductCard.jsx", type: "file" },
                            { name: "ProductList.jsx", type: "file" },
                            { name: "ShoppingCart.jsx", type: "file" },
                        ],
                    },
                    {
                        name: "pages",
                        type: "folder",
                        children: [
                            { name: "Home.jsx", type: "file" },
                            { name: "Product.jsx", type: "file" },
                            { name: "Checkout.jsx", type: "file" },
                        ],
                    },
                    { name: "App.jsx", type: "file" },
                    { name: "index.js", type: "file" },
                ],
            },
            {
                name: "public",
                type: "folder",
                children: [
                    { name: "index.html", type: "file" },
                    { name: "favicon.ico", type: "file" },
                ],
            },
            { name: "package.json", type: "file" },
            { name: "README.md", type: "file" },
        ],
        currentFile: {
            name: "ProductCard.jsx",
            path: "src/components/ProductCard.jsx",
            content: `import React from 'react';
import { Button } from './Button';
import { formatPrice } from '../utils/format';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, price, image, description } = product;
  
  return (
    <div className="product-card">
      <img src={image || "/placeholder.svg"} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <div className="product-price">{formatPrice(price)}</div>
      <Button onClick={() => onAddToCart(id)}>Add to Cart</Button>
    </div>
  );
};

export default ProductCard;`,
        },
        messages: [
            { user: "johndoe", text: "I'm working on the ProductCard component", time: "10:15 AM" },
            { user: "alexkim", text: "I'll handle the shopping cart functionality", time: "10:17 AM" },
            { user: "mariatorres", text: "Should we add a rating system to the product cards?", time: "10:20 AM" },
            { user: "johndoe", text: "That's a good idea. Let me update the component", time: "10:22 AM" },
            { user: "alexkim", text: "I've pushed my changes to the cart. Can someone review?", time: "10:30 AM" },
        ],
    }

    // Fetch folder contents when folderId changes
    useEffect(() => {
        if (folderId) {
            fetchFolderContents();
        } else {
            setLoading(false);
        }
    }, [folderId]);

    const fetchFolderContents = async () => {
        try {
            const token = localStorage.getItem("access");
            if (!token) {
                console.error("No authentication token");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${BASE_URL}${projectSlug}/folder/${folderId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.children) {
                setFolderContents(response.data.children);
            }
        } catch (error) {
            console.error("Failed to fetch folder contents:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <Code className="h-6 w-6 text-emerald-500" />
                                <span className="font-bold">DevSync</span>
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <Link to={`/user/${username}`} className="text-sm hover:underline">
                                {username}
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <Link to={`/${username}/project/${projectSlug}`} className="text-sm font-medium hover:underline">
                                {project.name}
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {project.collaborators.slice(0, 3).map((collaborator, index) => (
                                    <Avatar key={index} className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {project.collaborators.length > 3 && (
                                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs border-2 border-white dark:border-zinc-900">
                                        +{project.collaborators.length - 3}
                                    </div>
                                )}
                            </div>
                            <Button size="sm" variant="outline">
                                <Share2 className="h-4 w-4 mr-1" /> Share
                            </Button>
                            <Button size="sm" variant="outline">
                                <GitBranch className="h-4 w-4 mr-1" /> main
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* File Explorer */}
                <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {folderId && (
                                    <button 
                                        onClick={() => navigate(`/${username}/project/${projectSlug}`)}
                                        className="hover:opacity-70 transition-opacity cursor-pointer"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </button>
                                )}
                                <h3 className="font-medium">{folderId ? `${folderName} - Files` : "Files"}</h3>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Input placeholder="Search files..." className="h-8 text-sm" />
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            {loading ? (
                                <div className="p-4 text-center text-zinc-500">Loading...</div>
                            ) : folderId && folderContents.length > 0 ? (
                                <FileExplorer files={folderContents} level={0} />
                            ) : folderId ? (
                                <div className="p-4 text-center text-zinc-500">No files in this folder</div>
                            ) : (
                                <FileExplorer files={project.files || []} level={0} />
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                                {project.currentFile.path}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                <GitCommit className="h-3 w-3 mr-1" /> main
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-4 font-mono text-sm">
                        <pre className="whitespace-pre-wrap">
                            <code>{project.currentFile.content}</code>
                        </pre>
                    </div>
                </div>

                {/* Collaboration Panel */}
                <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
                    <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                        <TabsList className="w-full justify-start px-2 pt-2 bg-transparent">
                            <TabsTrigger
                                value="chat"
                                className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </TabsTrigger>
                            <TabsTrigger
                                value="people"
                                className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800"
                            >
                                <Users className="h-4 w-4 mr-2" /> People
                            </TabsTrigger>
                        </TabsList>
                        <Separator />

                        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {project.messages.map((message, index) => {
                                        const user = project.collaborators.find((c) => c.username === message.user)
                                        return (
                                            <div key={index} className="flex gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                                                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{user?.name}</span>
                                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{message.time}</span>
                                                    </div>
                                                    <p className="text-sm mt-1">{message.text}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Input placeholder="Type a message..." className="h-8" />
                                    <Button size="icon" className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="people" className="flex-1 p-0 m-0">
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {project.collaborators.map((collaborator, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar>
                                                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                                                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div
                                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${collaborator.status === "online"
                                                                ? "bg-green-500"
                                                                : collaborator.status === "away"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-zinc-300 dark:bg-zinc-600"
                                                            }`}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{collaborator.name}</div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">@{collaborator.username}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Video className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                                    <Plus className="h-4 w-4 mr-2" /> Invite Collaborator
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Mic className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">4 collaborators</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FileExplorer({ files, level }) {
    return (
        <div className="space-y-1">
            {files.map((file, index) => (
                <div key={index}>
                    <div
                        className={`flex items-center gap-2 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ${file.name === "ProductCard.jsx" ? "bg-zinc-100 dark:bg-zinc-800" : ""
                            }`}
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                    >
                        {file.type === "folder" ? (
                            <>
                                <Folder className="h-4 w-4 text-zinc-500" />
                                <span className="text-sm">{file.name}</span>
                            </>
                        ) : (
                            <>
                                <FileCode className="h-4 w-4 text-zinc-500" />
                                <span className="text-sm">{file.name}</span>
                            </>
                        )}
                    </div>
                    {file.type === "folder" && file.children && <FileExplorer files={file.children} level={level + 1} />}
                </div>
            ))}
        </div>
    )
}
