"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Link, useParams } from "react-router-dom"
import { Code, Save, Download, Undo, Redo, Trash2, Square, Circle, Type, Pencil, ImageIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Slider } from "../components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { getBrandHomePath } from "../lib/brand-link"

export default function WhiteboardPage() {
    const { id: projectId } = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [tool, setTool] = useState<string>("pencil")
    const [color, setColor] = useState<string>("#000000")
    const [brushSize, setBrushSize] = useState<number>(5)
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)

    // const { slug, whiteboard_id } = useParams();
    // const [whiteboard, setWhiteboard] = useState<any>(null);

    

    // Sample collaborators data
    const collaborators = [
        { name: "John Doe", avatar: "/placeholder.svg?height=40&width=40", status: "online", initials: "JD" },
        { name: "Alex Kim", avatar: "/placeholder.svg?height=40&width=40", status: "online", initials: "AK" },
        { name: "Maria Torres", avatar: "/placeholder.svg?height=40&width=40", status: "away", initials: "MT" },
    ]

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size to match parent container
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
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setIsDrawing(true)
        setLastPosition({ x, y })
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !lastPosition) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        setLastPosition({ x, y })
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        setLastPosition(null)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const saveWhiteboard = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        // In a real app, this would save to the server
        // For now, we'll just download the image
        const dataUrl = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.to = dataUrl
        a.download = `whiteboard-${projectId}-${new Date().toISOString().slice(0, 10)}.png`
        a.click()
    }

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to={getBrandHomePath()} className="flex items-center gap-2">
                                <Code className="h-6 w-6 text-emerald-500" />
                                <span className="font-bold">DevSync</span>
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <Link to={`/project/${projectId}`} className="text-sm hover:underline">
                                Project
                            </Link>
                            <span className="text-zinc-400">/</span>
                            <span className="text-sm font-medium">Whiteboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {collaborators.map((collaborator, index) => (
                                    <Avatar key={index} className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                                        <AvatarFallback>{collaborator.initials}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <Button size="sm" variant="outline" onClick={saveWhiteboard}>
                                <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button size="sm" variant="outline">
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
                        <ToggleGroupItem value="pencil" aria-label="Pencil tool" className="w-10 h-10 p-0">
                            <Pencil className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="rectangle" aria-label="Rectangle tool" className="w-10 h-10 p-0">
                            <Square className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="circle" aria-label="Circle tool" className="w-10 h-10 p-0">
                            <Circle className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="text" aria-label="Text tool" className="w-10 h-10 p-0">
                            <Type className="h-5 w-5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="image" aria-label="Image tool" className="w-10 h-10 p-0">
                            <ImageIcon className="h-5 w-5" />
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="w-10 h-10 mt-4 border-2" style={{ borderColor: color }}>
                                <span className="sr-only">Pick a color</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
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
                                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10" />
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
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                        <Button variant="ghost" size="icon" className="w-10 h-10">
                            <Undo className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-10 h-10">
                            <Redo className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-10 h-10 text-red-500" onClick={clearCanvas}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative bg-white">
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
