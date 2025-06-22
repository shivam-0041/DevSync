import axios from "axios";

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

        const token = localStorage.getItem("access_token"); // or wherever you store it

        if (!token) {
            console.error('No token found in localStorage');
            return null;
        }

        const response = await axios.get(`${BASE_URL}profile/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                // Include credentials if needed
                
            },
            withCredentials: true  // if you're using session authentication or CSRF
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
        return null;
    }
};




// Update profile
export const updateUserProfile = async (formData) => {
    return await axios.patch(`${BASE_URL}profile/`, formData);
};