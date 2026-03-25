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


export async function fetchProjectData(projectId: string) {

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

/**
 * Fetches code files for a project
 * Returns hierarchical nested folder/file tree with metadata
 * data includes: id, name, item_type, file_url, size, uploaded_at, uploaded_by, branch, children
 */
export async function fetchProjectFiles(projectId: string) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, files: [] };
        }

        const response = await axios.get(`${BASE_URL}${projectId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        // Files are included in the main project response via ProjectDetailSerializer
        return { 
            success: true, 
            files: response.data?.files || [],
            data: response.data 
        };
    } catch (error) {
        console.error("Failed to fetch project files:", error);
        return { success: false, files: [], error };
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


export async function ProjectInvite(slug,formData){
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.post(`${BASE_URL}${slug}/invite/`,formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };

    } catch (error) {
        console.error("Failed to invite user:", error);
        throw error;
    }
}

export interface ProjectMemberResponseItem {
    id: number;
    user: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        profile?: {
            avatar?: string | null;
        };
    };
    role: "admin" | "maintainer" | "developer" | "guest";
    created_at: string | null;
}

export interface PendingInviteResponseItem {
    id: number;
    email: string;
    role_to_assign: "admin" | "maintainer" | "developer" | "guest";
    status: "pending" | "accepted" | "declined" | "expired";
    created_at: string;
    expires_at: string;
}

export async function fetchProjectMembers(slug: string) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, members: [] as ProjectMemberResponseItem[] };
        }

        const response = await axios.get<{ members: ProjectMemberResponseItem[] }>(`${BASE_URL}${slug}/members/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, members: response.data.members || [] };
    } catch (error) {
        console.error("Failed to fetch project members:", error);
        return { success: false, members: [] as ProjectMemberResponseItem[] };
    }
}

export async function fetchProjectPendingInvites(slug: string) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, invites: [] as PendingInviteResponseItem[] };
        }

        const response = await axios.get<{ invites: PendingInviteResponseItem[] }>(`${BASE_URL}${slug}/pending-invites/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, invites: response.data.invites || [] };
    } catch (error) {
        console.error("Failed to fetch pending invites:", error);
        return { success: false, invites: [] as PendingInviteResponseItem[] };
    }
}

export async function cancelProjectPendingInvite(slug: string, inviteId: number) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, error: "Authentication token not found" };
        }

        const response = await axios.post(`${BASE_URL}${slug}/pending-invites/${inviteId}/cancel/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to cancel pending invite:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to cancel invitation",
        };
    }
}

/**
 * Upload files to a project
 * @param projectSlug - The project slug
 * @param files - File objects or File array to upload
 * @param parentId - (optional) Parent folder ID for nested uploads
 * @param branch - (optional) Branch name, defaults to 'main'
 * @returns Promise with success status, uploaded file count, and updated file tree
 */
export async function uploadFiles(
    projectSlug: string,
    files: File[] | File,
    parentId?: number,
    branch?: string
) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, error: "No authentication token found" };
        }

        const formData = new FormData();
        
        // Handle both single file and multiple files
        const fileArray = Array.isArray(files) ? files : [files];
        const pathsList: string[] = [];
        
        fileArray.forEach((file) => {
            formData.append("files", file);
            // Send webkitRelativePath for nested folder structure preservation
            const filePath = (file as any).webkitRelativePath || file.name;
            pathsList.push(filePath);
            console.log("Uploading file with path:", filePath, "webkitRelativePath:", (file as any).webkitRelativePath);
            formData.append("file_paths", filePath);
        });
        
        console.log("Total files:", fileArray.length, "Paths:", pathsList);

        if (parentId) {
            formData.append("parent_id", parentId.toString());
        }

        if (branch) {
            formData.append("branch", branch);
        }

        const response = await axios.post(
            `${BASE_URL}${projectSlug}/files/upload/`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return {
            success: true,
            message: response.data.message,
            uploadedCount: response.data.uploaded_count,
            files: response.data.files,
            data: response.data,
        };
    } catch (error) {
        console.error("Failed to upload files:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed",
            uploadedCount: 0,
        };
    }
}

/**
 * Delete a file or folder from a project
 * @param projectSlug - The project slug
 * @param fileId - The file/folder ID to delete
 * @param fileName - The file name (required for confirmation)
 * @returns Promise with success status and updated file tree
 */
export async function deleteFile(
    projectSlug: string,
    fileId: number,
    fileName: string
) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, error: "No authentication token found" };
        }

        const response = await axios.delete(
            `${BASE_URL}${projectSlug}/files/${fileId}/delete/`,
            {
                data: { file_name: fileName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            success: true,
            message: response.data.message,
            files: response.data.files,
            data: response.data,
        };
    } catch (error: any) {
        console.error("Failed to delete file:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Delete failed",
        };
    }
}

/**
 * Download all project files as a ZIP archive
 * @param projectSlug - The project slug
 * @param branch - (optional) Branch name, defaults to 'main'
 * @returns Success status or error
 */
export async function downloadFiles(
    projectSlug: string,
    branch?: string
) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, error: "No authentication token found" };
        }

        const params = new URLSearchParams();
        if (branch) {
            params.append("branch", branch);
        }

        const response = await axios.get(
            `${BASE_URL}${projectSlug}/files/download/?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            }
        );

        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${projectSlug}-${branch || "main"}.zip`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        return {
            success: true,
            message: "Files downloaded successfully",
        };
    } catch (error) {
        console.error("Failed to download files:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Download failed",
        };
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