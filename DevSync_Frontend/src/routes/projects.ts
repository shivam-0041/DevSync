import axios from "axios";
import { toast } from "sonner"
import type { DashboardTask } from "../components/task-allocation"

const BASE_URL = "http://localhost:8000/api/projects/"; // adjust if needed

export interface ProjectFormData {
    name: string;
    description: string;
    visibility: "public" | "private";
    template: string;
    gitignore: string;
    license: string;
    readme: boolean;
    issues: boolean;
    wiki: boolean;
    projects: boolean;
    discussions: boolean;
    autoInit: boolean;
}

export async function createProject(data: ProjectFormData) {
    try {

        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.post(
            `${BASE_URL}create/`,
            {
                ...data,
                issues_enabled: data.issues,
                wiki_enabled: data.wiki,
                boards_enabled: data.projects,
                discussions_enabled: data.discussions,
                auto_init: data.autoInit,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return { success: true, project: response.data };
    } catch (error: any) {
        console.error("Project creation failed:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || "Unknown error" };
    }
}

export async function fetchProjects() {

    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.get(`${BASE_URL}list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        throw error;
    }
}

export async function fetchPublicProjects(username: string) {
    try {
        const response = await axios.get(`${BASE_URL}public/${username}/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch public projects:", error);
        throw error;
    }
}


export async function fetchProjectData(projectId) {

    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.get(`${BASE_URL}${projectId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch project data:", error);
        throw error;
    }
};



export async function createNewIssue(slug,formData){
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        console.log(formData);
        

        const response = await axios.post(`${BASE_URL}${slug}/issues/create/`,formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };

    } catch (error) {
        console.error("Failed to create issue:", error);
        throw error;
    }
}

export async function createNewPL(slug,formData){
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        console.log(formData);
        

        const response = await axios.post(`${BASE_URL}${slug}/issues/create/`,formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };

    } catch (error) {
        console.error("Failed to create pull request:", error);
        throw error;
    }
}


export async function createTask(slug,formData){
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        console.log(formData);
        

        const response = await axios.post(`${BASE_URL}${slug}/tasks/create/`,formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };

    } catch (error) {
        console.error("Failed to create task:", error);
        throw error;
    }
}

export const updateProject = async (formData, slug) => {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }
        
        
        const response = await axios.put(`${BASE_URL}${slug}/update/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        toast.success("Project updated successfully!");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        toast.error("Failed to update project");
        return { success: false };
    }
};

export async function fetchMyTasks(_username: string): Promise<DashboardTask[]> {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return [];
        }

        const res = await fetch(`${BASE_URL}tasks/my/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch assigned tasks");
        }

        const data = await res.json();
        return Array.isArray(data) ? data : data.results || [];
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return [];
    }
}


// export async function fetchWhiteboard(slug, whiteboard_id) {

//     try {
//         const token = localStorage.getItem("access");

//         if (!token) {
//             console.error("No token found in localStorage");
//             return { success: false };
//         }

//         const response = await axios.get(`${BASE_URL}projects/${slug}/whiteboard/${whiteboard_id}/`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Failed to fetch whiteboard data:", error);
//         throw error;
//     }
// };