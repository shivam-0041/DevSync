"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface User {
    id: string
    name: string
    email: string
    username: string
    avatar?: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Check if user is logged in on mount
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Simulate API call - in real app, this would be an actual API request
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock user data - in real app, this would come from the API
            const mockUser: User = {
                id: "1",
                name: "John Doe",
                email: email,
                username: "johndoe",
                avatar: "/placeholder.svg?height=40&width=40",
            }

            setUser(mockUser)
            localStorage.setItem("user", JSON.stringify(mockUser))
            return true
        } catch (error) {
            console.error("Login failed:", error)
            return false
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        navigate("/")
    }

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
