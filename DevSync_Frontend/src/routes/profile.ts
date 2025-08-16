import axios from "axios";
import { toast } from "sonner";
// Set base URL for your backend
const BASE_URL = "http://localhost:8000/api/core/";

// Function to fetch CSRF token and set the cookie
export async function getCsrfToken() {

    const response = await fetch(`${BASE_URL}csrf/`, {
        method: "GET",
        credentials: "include",  // Include cookies (CSRF token is in the cookie)
    });

    if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
    }
}

export const fetchUserProfile = async () => {
    try {

        const token = localStorage.getItem("access"); 

        if (!token) {
            console.error('No token found in localStorage');
            return null;
        }

        const response = await axios.get(`${BASE_URL}profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                
            },
            //withCredentials: true  // if you're using session authentication or CSRF
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
        return null;
    }
};


export const updateUserProfile = async (formData) => {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }
        
        
        const response = await axios.put(`${BASE_URL}profile/settings/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        toast.success("Profile updated successfully!");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        toast.error("Failed to update profile");
        return { success: false };
    }
};

export const updateUserPassword = async (formData) => {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }
        
        
        const response = await axios.post(`${BASE_URL}profile/password-update/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        toast.success("Password updated successfully!");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        toast.error("Failed to update password");
        return { success: false };
    }
}