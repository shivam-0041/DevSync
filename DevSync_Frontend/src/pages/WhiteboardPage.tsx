"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Link, useParams } from "react-router-dom"
import { Code, Save, Download, Undo, Redo, Trash2, Square, Circle, Type, Pencil, Eraser } from "lucide-react"
import { Button } from "../components/ui/button"
import { Slider } from "../components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { getBrandHomePath } from "../lib/brand-link"
import axios from "axios"
import { toast } from "sonner"

const API_BASE_URL = "http://localhost:8000/api"

interface TeamMember {
    username: string
    first_name: string
    last_name: string
    avatar?: string
    status: "online" | "away" | "offline"
}

interface WhiteboardData {
    strokes: any[]
    shapes: any[]
    lastModifiedBy?: string
    lastModifiedAt?: string
    history?: WhiteboardData[]
}

function getStoredUsername() {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return "Unknown"

    try {
        const parsedUser = JSON.parse(storedUser)
        return parsedUser?.username || storedUser
    } catch {
        return storedUser
    }
}

export default function WhiteboardPage() {
    const { slug, whiteboard_id } = useParams()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [tool, setTool] = useState<string>("pencil")
    const [color, setColor] = useState<string>("#000000")
    const [brushSize, setBrushSize] = useState<number>(5)
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)
    const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null)
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [lastEditor, setLastEditor] = useState<string>("")
    const [whiteboardData, setWhiteboardData] = useState<WhiteboardData>({ strokes: [], shapes: [] })
    const [isSaving, setIsSaving] = useState(false)
    const [canvasImageData, setCanvasImageData] = useState<string | null>(null)

    // Fetch team members
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const token = localStorage.getItem("access")
                if (!slug) return

                // Fetch team members for the project
                const membersRes = await axios.get(
                    `${API_BASE_URL}/projects/${slug}/members/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (membersRes.data.members) {
                    const members = membersRes.data.members.map((member: any) => ({
                        username: member.user.username,
                        first_name: member.user.first_name,
                        last_name: member.user.last_name,
                        avatar: member.user.profile?.avatar,
                        status: getActivityStatus(member.user.last_activity),
                    }))
                    setTeamMembers(members)
                }
            } catch (error) {
                console.error("Error fetching team members:", error)
            }
        }

        fetchTeamMembers()
    }, [slug])

    // Load whiteboard data from backend
    useEffect(() => {
        const loadWhiteboardData = async () => {
            if (!slug || !whiteboard_id) return

            try {
                const token = localStorage.getItem("access")
                const res = await axios.get(
                    `${API_BASE_URL}/projects/${slug}/whiteboard/${whiteboard_id}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (res.data && res.data.data) {
                    const data = res.data.data
                    setWhiteboardData(data)
                    if (data.lastModifiedBy) {
                        setLastEditor(data.lastModifiedBy)
                    }
                    // Restore canvas drawing
                    if (data.canvasImageData) {
                        setCanvasImageData(data.canvasImageData)
                    }
                }
            } catch (error) {
                console.error("Error loading whiteboard data:", error)
            }
        }

        loadWhiteboardData()
    }, [slug, whiteboard_id])

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            const container = canvas.parentElement
            if (container) {
                canvas.width = container.clientWidth
                canvas.height = container.clientHeight
            }
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Initialize canvas with white background


        // Restore canvas image if available
        if (canvasImageData) {
            const img = new Image()
            img.src = canvasImageData
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
            }
        }

        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [canvasImageData])

    const getActivityStatus = (lastActivity: string | null): "online" | "away" | "offline" => {
        if (!lastActivity) return "offline"
        const lastActivityTime = new Date(lastActivity).getTime()
        const now = new Date().getTime()
        const minutesAgo = (now - lastActivityTime) / (1000 * 60)

        if (minutesAgo < 5) return "online"
        if (minutesAgo < 30) return "away"
        return "offline"
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setIsDrawing(true)
        setLastPosition({ x, y })
        setStartPosition({ x, y })
        
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (tool === "pencil" && lastPosition) {
            ctx.strokeStyle = color
            ctx.lineWidth = brushSize
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            ctx.beginPath()
            ctx.moveTo(lastPosition.x, lastPosition.y)
            ctx.lineTo(x, y)
            ctx.stroke()

            setLastPosition({ x, y })
        } else if (tool === "eraser" && lastPosition) {
            const eraserSize = brushSize * 3
            ctx.save()
            ctx.globalCompositeOperation = "destination-out"
            ctx.beginPath()
            ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
            setLastPosition({ x, y })
        } else if (tool === "rectangle" || tool === "circle" || tool === "text") {
            setLastPosition({ x, y })
        }
        
    }

    const stopDrawing = () => {
        if (!isDrawing || !startPosition) {
            setIsDrawing(false)
            setLastPosition(null)
            setStartPosition(null)
            return
        }

        const endPosition = lastPosition || startPosition

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Draw shapes on mouse release
        if (tool === "rectangle") {
            const width = endPosition.x - startPosition.x
            const height = endPosition.y - startPosition.y
            ctx.strokeStyle = color
            ctx.lineWidth = brushSize
            ctx.strokeRect(startPosition.x, startPosition.y, width, height)
        } else if (tool === "circle") {
            const radius = Math.sqrt(
                Math.pow(endPosition.x - startPosition.x, 2) +
                Math.pow(endPosition.y - startPosition.y, 2)
            )
            ctx.strokeStyle = color
            ctx.lineWidth = brushSize
            ctx.beginPath()
            ctx.arc(startPosition.x, startPosition.y, radius, 0, Math.PI * 2)
            ctx.stroke()
        } else if (tool === "text") {
            const text = prompt("Enter text:")
            if (text) {
                ctx.fillStyle = color
                ctx.font = `${brushSize * 3}px Arial`
                ctx.fillText(text, startPosition.x, startPosition.y)
            }
        }

        setIsDrawing(false)
        setLastPosition(null)
        setStartPosition(null)
    }

    const undoWhiteboard = async () => {
        if (!slug || !whiteboard_id) return

        try {
            const token = localStorage.getItem("access")
            const response = await axios.post(
                `${API_BASE_URL}/projects/${slug}/whiteboard/${whiteboard_id}/undo/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            if (response.data?.data) {
                const data = response.data.data
                setWhiteboardData(data)
                setLastEditor(data.lastModifiedBy || "")
                setCanvasImageData(data.canvasImageData || null)
            }
        } catch (error) {
            console.error("Error undoing whiteboard:", error)
        }
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return
    
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const saveWhiteboard = async () => {
        const canvas = canvasRef.current
        if (!canvas || !slug || !whiteboard_id) return

        try {
            setIsSaving(true)
            const token = localStorage.getItem("access")
            const user = getStoredUsername()
            const canvasImageData = canvas.toDataURL("image/png")

            const data = {
                data: {
                    strokes: whiteboardData.strokes,
                    shapes: whiteboardData.shapes,
                    canvasImageData: canvasImageData,
                    lastModifiedBy: user,
                    lastModifiedAt: new Date().toISOString(),
                },
            }

            const response = await axios.put(
                `${API_BASE_URL}/projects/${slug}/whiteboard/${whiteboard_id}/update/`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            if (response.data?.data) {
                setWhiteboardData(response.data.data)
                setCanvasImageData(response.data.data.canvasImageData || canvasImageData)
            } else {
                setCanvasImageData(canvasImageData)
            }
            setLastEditor(user)
            toast.success("Whiteboard updated and saved")
        } catch (error) {
            console.error("Error saving whiteboard:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const exportWhiteboard = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const dataUrl = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `whiteboard-${slug}-${whiteboard_id}-${new Date().toISOString().slice(0, 10)}.png`
        a.click()
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to={getBrandHomePath()} className="flex items-center gap-2 hover:opacity-80">
                                <Code className="h-6 w-6 text-emerald-500" />
                                <span className="font-bold">DevSync</span>
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <Link 
                                to={`/${getStoredUsername()}/project/${slug}`} 
                                className="text-sm hover:underline"
                            >
                                Project
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <span className="text-sm font-medium">Whiteboard</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                                {lastEditor && (
                                    <div>
                                        <span className="text-zinc-500 dark:text-zinc-400">Last edited by:</span>
                                        <div className="font-semibold">{lastEditor}</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex -space-x-2">
                                {teamMembers.slice(0, 5).map((member, index) => (
                                    <Avatar key={index} className="h-8 w-8 border-2" title={`${member.first_name} ${member.last_name}`}>
                                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.username} />
                                        <AvatarFallback>{getInitials(member.first_name, member.last_name)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {teamMembers.length > 5 && (
                                    <Avatar className="h-8 w-8 border-2" title={`+${teamMembers.length - 5} more`}>
                                        <AvatarFallback>+{teamMembers.length - 5}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={saveWhiteboard}
                                disabled={isSaving}
                            >
                                <Save className="h-4 w-4 mr-1" /> 
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={exportWhiteboard}>
                                <Download className="h-4 w-4 mr-1" /> Export
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Toolbar */}
                <div className="w-16 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col items-center py-4 gap-4">
                    <ToggleGroup
                        type="single"
                        value={tool}
                        onValueChange={(value) => value && setTool(value)}
                        className="flex flex-col gap-2"
                    >
                        <ToggleGroupItem value="pencil" aria-label="Pencil tool" className="w-10 h-10 p-0 data-[state=on]:bg-emerald-500 data-[state=on]:text-white">
                            <Pencil className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="rectangle" aria-label="Rectangle tool" className="w-10 h-10 p-0 data-[state=on]:bg-emerald-500 data-[state=on]:text-white">
                            <Square className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="circle" aria-label="Circle tool" className="w-10 h-10 p-0 data-[state=on]:bg-emerald-500 data-[state=on]:text-white">
                            <Circle className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="text" aria-label="Text tool" className="w-10 h-10 p-0 data-[state=on]:bg-emerald-500 data-[state=on]:text-white">
                            <Type className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="eraser" aria-label="Eraser tool" className="w-10 h-10 p-0 data-[state=on]:bg-zinc-700 data-[state=on]:text-white">
                            <Eraser className="h-5 w-5" />
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="w-10 h-10 mt-4 border-2"
                                style={{ backgroundColor: color, borderColor: color }}
                            >
                                <span className="sr-only">Pick a color</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="grid grid-cols-6 gap-2">
                                {[
                                    "#000000",
                                    "#ffffff",
                                    "#ff0000",
                                    "#00ff00",
                                    "#0000ff",
                                    "#ffff00",
                                    "#00ffff",
                                    "#ff00ff",
                                    "#c0c0c0",
                                    "#808080",
                                    "#800000",
                                    "#808000",
                                    "#008000",
                                    "#800080",
                                    "#008080",
                                    "#000080",
                                    "#ff9900",
                                    "#9900ff",
                                ].map((c) => (
                                    <button
                                        key={c}
                                        className="w-8 h-8 rounded-md border border-zinc-300 dark:border-zinc-700"
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                        aria-label={`Select color ${c}`}
                                    />
                                ))}
                            </div>
                            <div className="mt-4">
                                <Input 
                                    type="color" 
                                    value={color} 
                                    onChange={(e) => setColor(e.target.value)} 
                                    className="w-full h-10"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="mt-4 px-2 w-full">
                        <Slider
                            value={[brushSize]}
                            min={1}
                            max={20}
                            step={1}
                            onValueChange={(value) => setBrushSize(value[0])}
                            className="w-full"
                        />
                        <div className="text-xs text-center mt-2 text-zinc-500 dark:text-zinc-400">
                            {brushSize}px
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-10 h-10"
                                title="Undo"
                                onClick={undoWhiteboard}
                        >
                            <Undo className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-10 h-10"
                            title="Redo (Coming soon)"
                        >
                            <Redo className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-10 h-10 text-red-500" 
                            onClick={clearCanvas}
                            title="Clear canvas"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Canvas */}
                <div
                    className="flex-1 relative bg-white dark:bg-zinc-900"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(148,163,184,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.28) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                </div>
            </div>
        </div>
    )
}
