"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


const BASE_URL = "http://localhost:8000/api/auth/";

async function getCsrfToken() {

    const response = await fetch(`${BASE_URL}csrf/`, {
        method: "GET",
        credentials: "include",  // Include cookies (CSRF token is in the cookie)
    });

    if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
    }
}


function getCurrCookie(name) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
}
interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<{ success: boolean, user?: User }>
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
        try {
            if (savedUser) {
                const parsed = JSON.parse(savedUser)

                // Optional: validate structure (basic check)
                if (parsed && parsed.username && parsed.email) {
                    setUser(parsed)
                } else {
                    console.warn("Malformed user object:", parsed)
                    localStorage.removeItem("user")
                }
            }
        } catch (err) {
            console.error("Failed to parse user from localStorage:", savedUser)
            localStorage.removeItem("user")  // Clean up bad data
        }
        setIsLoading(false)
    }, [])

    const login = async (username: string, password: string): Promise<{ success: boolean, user?: User }> => {
        try {

            await getCsrfToken();

            const csrfToken = getCurrCookie('csrftoken');

            const response = await fetch(`${BASE_URL}login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken, // Use the CSRF token from the cookie
                },
                credentials: 'include', // Important for cookies (CSRF)
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                console.error("Login failed")
                return { success: false };
            }
            // Read JSON only after checking if response is OK
            const data = await response.json();
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));

            return { success: true, user: data.username };


        } catch (error) {

            console.error("Login error:", error);
            return { success: false };
        }
         
    }

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user")
        if (setUser) {
            setUser(null);
        }
        navigate("/login");
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
