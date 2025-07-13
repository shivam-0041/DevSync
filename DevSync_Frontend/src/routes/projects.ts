import axios from "axios";

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

export async function createProject(data: ProjectFormData, accessToken: string) {
    try {
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
                    Authorization: `Bearer ${accessToken}`,
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

export async function fetchProjects(accessToken: string) {
    try {
        const response = await axios.get(`${BASE_URL}list/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        throw error;
    }
}
