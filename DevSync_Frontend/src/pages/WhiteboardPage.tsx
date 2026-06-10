"use client"

import { useState, useEffect } from "react"
import { Tldraw } from "tldraw"
import { useParams } from "react-router-dom"
import "tldraw/tldraw.css"
import { fetchWhiteboard, updateWhiteboard } from '../routes/projects';

export default function WhiteboardPage() {
    const { slug, whiteboard_id } = useParams()
    const [lastEditor, setLastEditor] = useState("")
    const [lastUpdatedAt, setLastUpdatedAt] = useState("")

    useEffect(() => {
        const loadWhiteboard = async () => {
            try {
                if (!slug || !whiteboard_id) return

                const data = await fetchWhiteboard(slug, whiteboard_id)

                if (data?.last_modified_by) {
                    setLastEditor(data.last_modified_by)
                }

                if (data?.updated_at) {
                    setLastUpdatedAt(data.updated_at)
                }

            } catch (error) {
                console.error("Failed to load whiteboard:", error)
            }
        }

        loadWhiteboard()
    }, [slug, whiteboard_id])

    const handleWhiteboardSave = async () => {
        try {
            if (!slug || !whiteboard_id) return

            await updateWhiteboard(
                slug,
                whiteboard_id,
                {
                    last_modified_by: localStorage.getItem("user")
                        ? JSON.parse(localStorage.getItem("user")!).username
                        : "Unknown"
                }
            )

            setLastEditor(
                localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")!).username
                    : "Unknown"
            )

            setLastUpdatedAt(new Date().toISOString())
            toast.success("Whiteboard updated successfully!");

        } catch (error) {
            console.error("Save failed:", error)
            toast.error("Failed to save whiteboard");
        }
    }

    



    return (
        
        <div style={{ position: "fixed", inset: 0 }}>

            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "white",
                    padding: "8px 12px",
                    marginRight: "16px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >
                <div style={{color:"black"}}>
                    <strong>Last edited by:</strong>{" "}
                    {lastEditor || "No edits yet"}
                </div>

                <div style={{color:"black"}}>
                    <strong >Updated:</strong>{" "}
                    {lastUpdatedAt
                        ? new Date(lastUpdatedAt).toLocaleString()
                        : "-"}
                </div>

                <button
                    onClick={handleWhiteboardSave}
                    style={{
                        marginTop: "8px",
                        padding: "4px 10px",
                        cursor: "pointer",
                        color:"black"
                    }}
                >
                    Save Changes
                </button>
            </div>

            <Tldraw persistenceKey="devsync-whiteboard" />
        </div>
    )
}