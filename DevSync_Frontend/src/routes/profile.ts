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

        const token = localStorage.getItem("access"); // or wherever you store it

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


export const updateUserProfile = async (formValues) => {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            console.error('No token found in localStorage');
            return null;
        }

        const formData = new FormData();

        if (formValues.avatar) formData.append('avatar', formValues.avatar);
        if (formValues.full_name) formData.append('name', formValues.full_name);
        if (formValues.username) formData.append('username', formValues.username);
        if (formValues.email) formData.append('email', formValues.email);
        if (formValues.location) formData.append('location', formValues.location);
        if (formValues.bio) formData.append('bio', formValues.bio);
        if (formValues.company) formData.append('company', formValues.company);
        if (formValues.github) formData.append('github', formValues.github);
        if (formValues.linkedin) formData.append('linkedin', formValues.linkedin);
        if (formValues.personal_website) formData.append('personal_website', formValues.personal_website);
        if (formValues.twitter) formData.append('twitter', formValues.twitter);

        // Serialize arrays/objects
        if (formValues.skills) {
            formData.append('skill', JSON.stringify(formValues.skills));
        }

        if (formValues.full_name) {
            formData.append('user.get_full_name', formValues.full_name); 
        }
        if (formValues.username) {
            formData.append('user.username', formValues.username);
        }
        if (formValues.email) {
            formData.append('user.email', formValues.email);
        }
       

        const response = await axios.put(`${BASE_URL}profile/settings/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error.response?.data || error.message);
        return null;
    }
};