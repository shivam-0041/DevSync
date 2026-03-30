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


export const fetchPublicProfile = async (username: string) => {
    try {
        const response = await axios.get(`${BASE_URL}users/${username}/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching public profile:', error.response?.data || error.message);
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

export const followUser = async (username: string) => {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.post(`${BASE_URL}users/${username}/follow/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        toast.success(`You are now following ${username}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Follow failed:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to follow user");
        return { success: false };
    }
}

export const unfollowUser = async (username: string) => {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.post(`${BASE_URL}users/${username}/unfollow/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        toast.success(`You have unfollowed ${username}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Unfollow failed:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to unfollow user");
        return { success: false };
    }
}

export const checkIsFollowing = async (username: string) => {
    try {
        const token = localStorage.getItem("access");

        const config = token ? {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        } : {};

        const response = await axios.get(`${BASE_URL}users/${username}/is-following/`, config);

        return response.data.is_following || false;
    } catch (error) {
        console.error("Failed to check following status:", error.response?.data || error.message);
        return false;
    }
}

export type SocialConnection = {
    id: number;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    is_following: boolean;
};

const getAuthConfig = () => {
    const token = localStorage.getItem("access");
    if (!token) {
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

export const fetchFollowers = async (username: string): Promise<SocialConnection[]> => {
    try {
        const response = await axios.get(`${BASE_URL}users/${username}/followers/`, getAuthConfig());
        return response.data?.results || [];
    } catch (error: any) {
        console.error("Failed to fetch followers:", error.response?.data || error.message);
        toast.error("Failed to load followers list");
        return [];
    }
};

export const fetchFollowing = async (username: string): Promise<SocialConnection[]> => {
    try {
        const response = await axios.get(`${BASE_URL}users/${username}/following/`, getAuthConfig());
        return response.data?.results || [];
    } catch (error: any) {
        console.error("Failed to fetch following:", error.response?.data || error.message);
        toast.error("Failed to load following list");
        return [];
    }
};