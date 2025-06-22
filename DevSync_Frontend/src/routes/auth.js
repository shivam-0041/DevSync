import axios from "axios";

// Set base URL for your backend
const BASE_URL = "http://localhost:8000/api/auth/";

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

//Function to handle registration
export async function handleRegisterSubmit(formData) {
    try {
        // First, get the CSRF token
        await getCsrfToken();

        // Now, make the actual registration request
        const response = await fetch(`${BASE_URL}register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Csrftoken": getCookie("csrftoken"), // Send the CSRF token in the header
            },
            credentials: "include",  // Make sure credentials (cookies) are included
            body: JSON.stringify({
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: "Account created successfully!", data };
        } else {
            return { success: false, message: data.message || "Registration failed." };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Server error. Please try again later." };
    }
}


//export async function handleRegistrationSubmit(formData) {
//    try {
//        // ? REMOVED verifyEmailCode check from frontend, it should be handled in backend

//        await getCsrfToken();

//        const response = await fetch(`${BASE_URL}register/`, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                "X-Csrftoken": getCookie("csrftoken"),
//            },
//            credentials: "include",
//            body: JSON.stringify({
//                first_name: formData.firstName,
//                last_name: formData.lastName,
//                username: formData.username,
//                email: formData.email,
//                password: formData.password,
                
//            }),
//        });

//        const data = await response.json();

//        if (response.ok) {
//            return { success: true, message: "Account created successfully!", data };
//        } else {
//            return { success: false, message: data.message || "Registration failed." };
//        }
//    } catch (error) {
//        console.error("Registration error:", error);
//        return { success: false, message: "Server error. Please try again later." };
//    }
//}



// Helper to get a cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");  // Split cookies into an array
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(`${name}=`)) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function getCurrCookie(name) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
}

export async function loginUser(username, password) {
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
            const errorText = await response.text();  // Only read the body once
            console.error("Raw error response:", errorText);
            return { success: false, message: "Login failed." };
        }

        // Read JSON only after checking if response is OK
        const data = await response.json();
        //const res = await axios.post(`${BASE_URL}login/`, {
        //    username,
        //    password
        //});
        localStorage.setItem("access_token", data.token);

        return { success: true, data };


    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Server error. Please try again later." };
    }

}
export async function verifyEmailCode(email, code) {
    try {
        // ? Ensure the email and code are sent to the backend for validation
        const response = await fetch(`${BASE_URL}verify-email/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }), // ? send email and code for verification
        });

        const data = await response.json();

        if (response.ok) {
            // ? If verification is successful, backend should handle the activation
            return { success: true };
        } else {
            return { success: false, message: data.error || "Invalid code" };
        }
    } catch (error) {
        return { success: false, message: "Server error" };
    }
}
