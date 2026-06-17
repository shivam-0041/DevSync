import axios from "axios";
import { toast } from "sonner"
import type { DashboardTask } from "../components/task-allocation"

const BASE_URL = "http://localhost:8000/api/projects/"; // adjust if needed

export const API_BASE_URL = BASE_URL;

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

export async function fetchAllPublicProjects() {
    try {
        const response = await axios.get(`${BASE_URL}public/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all public projects:", error);
        throw error;
    }
}

export type GithubPopularRepo = {
    id: number
    name: string
    full_name: string
    description: string | null
    stargazers_count: number
    forks_count: number
    language: string | null
    owner: {
        login: string
    }
    html_url: string
}

export async function fetchGithubPopularRepos() {
    try {
        const response = await axios.get("https://api.github.com/search/repositories", {
            params: {
                q: "stars:>1",
                sort: "stars",
                order: "desc",
                per_page: 100,
            },
            headers: {
                Accept: "application/vnd.github+json",
            },
        })

        return (response.data?.items || []) as GithubPopularRepo[]
    } catch (error) {
        console.error("Failed to fetch GitHub popular repositories:", error)
        throw error
    }
}

export async function searchGithubRepositories(query: string) {
    const trimmed = query.trim()
    if (!trimmed) {
        return [] as GithubPopularRepo[]
    }

    try {
        const response = await axios.get("https://api.github.com/search/repositories", {
            params: {
                q: trimmed,
                sort: "stars",
                order: "desc",
                per_page: 30,
            },
            headers: {
                Accept: "application/vnd.github+json",
            },
        })

        return (response.data?.items || []) as GithubPopularRepo[]
    } catch (error) {
        console.error("Failed to search GitHub repositories:", error)
        throw error
    }
}


export async function fetchProjectData(projectId: string) {

    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, data: null };
        }

        const response = await axios.get(`${BASE_URL}${projectId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to fetch project data:", error);
        return { success: false, data: null, error: error.message };
    }
};

/**
 * Fetch public project detail — no authentication required.
 * Works for public repos only; private repos return 404.
 * Optionally attaches the auth token if the user is logged in,
 * so the `is_starred` field is populated correctly.
 */
export async function fetchPublicProjectDetail(username: string, slug: string) {
    try {
        const token = localStorage.getItem("access");
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axios.get(`${BASE_URL}view/${username}/${slug}/`, { headers });
        return { success: true, data: response.data };
    } catch (error: any) {
        const httpStatus = error.response?.status;
        return {
            success: false,
            data: null,
            status: httpStatus,
            error: error.response?.data?.detail || error.message || "Unknown error",
        };
    }
}

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
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.post(`${BASE_URL}${slug}/pull-requests/create/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };

    } catch (error: any) {
        console.error("Failed to create pull request:", error);
        return { 
            success: false, 
            error: error.response?.data?.error || error.message || "Failed to create pull request"
        };
    }
}


export async function fetchPullRequests(slug: string) {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.get(`${BASE_URL}${slug}/pull-requests/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };

    } catch (error: any) {
        console.error("Failed to fetch pull requests:", error);
        return { 
            success: false, 
            error: error.response?.data?.error || error.message || "Failed to fetch pull requests"
        };
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

export interface DashboardTeammateResponseItem {
    id: number;
    username: string;
    display_name: string;
    role: "admin" | "maintainer" | "developer" | "guest";
    avatar: string | null;
    last_activity: string | null;
    status: "online" | "away" | "offline";
}

export async function fetchDashboardTeammates() {
    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false, teammates: [] as DashboardTeammateResponseItem[] };
        }

        const response = await axios.get<{ teammates: DashboardTeammateResponseItem[] }>(`${BASE_URL}teammates/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, teammates: response.data.teammates || [] };
    } catch (error) {
        console.error("Failed to fetch dashboard teammates:", error);
        return { success: false, teammates: [] as DashboardTeammateResponseItem[] };
    }
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

export async function createProjectItem(
    projectSlug: string,
    payload: {
        name: string
        itemType: "file" | "folder"
        parentId?: number | null
        branch?: string
        initialContent?: string
    }
) {
    try {
        const token = localStorage.getItem("access")

        if (!token) {
            console.error("No token found in localStorage")
            return { success: false, error: "No authentication token found" }
        }

        const response = await axios.post(
            `${BASE_URL}${projectSlug}/files/create/`,
            {
                name: payload.name,
                item_type: payload.itemType,
                parent_id: payload.parentId ?? null,
                branch: payload.branch || "main",
                initial_content: payload.initialContent ?? "",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )

        return { success: true, data: response.data }
    } catch (error: any) {
        console.error("Failed to create project item:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to create item",
        }
    }
}

// ============================
// Discussion Thread & Comments Helper Functions
// ============================

export async function fetchDiscussionThreads(slug: string) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.get(`${BASE_URL}${slug}/discussions/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to fetch discussions:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to fetch discussions",
        };
    }
}

export async function fetchDiscussionThread(slug: string, threadId: number) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.get(`${BASE_URL}${slug}/discussions/${threadId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to fetch discussion thread:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to fetch discussion",
        };
    }
}

export async function createDiscussionThread(
    slug: string,
    data: {
        title: string;
        description: string;
        thread_type: string;
        labels?: string[];
    }
) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.post(`${BASE_URL}${slug}/discussions/create/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to create discussion thread:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to create discussion",
        };
    }
}

export async function addDiscussionComment(
    slug: string,
    threadId: number,
    content: string
) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.post(
            `${BASE_URL}${slug}/discussions/${threadId}/comments/create/`,
            { content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to add comment:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to add comment",
        };
    }
}

export async function updateDiscussionComment(
    slug: string,
    threadId: number,
    commentId: number,
    content: string
) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.patch(
            `${BASE_URL}${slug}/discussions/${threadId}/comments/${commentId}/`,
            { content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to update comment:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to update comment",
        };
    }
}

export async function deleteDiscussionComment(
    slug: string,
    threadId: number,
    commentId: number
) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        await axios.delete(
            `${BASE_URL}${slug}/discussions/${threadId}/comments/${commentId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete comment:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to delete comment",
        };
    }
}

export async function closeDiscussionThread(slug: string, threadId: number) {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            return { success: false, error: "No authentication token" };
        }

        const response = await axios.post(
            `${BASE_URL}${slug}/discussions/${threadId}/close/`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Failed to close discussion:", error);
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to close discussion",
        };
    }
}





export async function fetchWhiteboard(slug, whiteboard_id) {

    try {
    const token = localStorage.getItem("access");

    if (!token) {
        console.error("No token found in localStorage");
        return { success: false };
    }

    const response = await axios.get(`${BASE_URL}${slug}/whiteboard/${whiteboard_id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            },
    });
    console.log(response.data)
    return response.data;
    } catch (error) {
    console.error("Failed to fetch whiteboard data:", error);
    throw error;
    }
};


export async function updateWhiteboard(slug, whiteboard_id, data) {

    try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No token found in localStorage");
            return { success: false };
        }

        const response = await axios.put(`${BASE_URL}${slug}/whiteboard/${whiteboard_id}/update`, data ,{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
        toast.success("Whiteboard updated successfully!");
        return response.data;
    
    } catch (error) {
    console.error("Failed to update whiteboard data:", error);
    toast.error("Failed to save whiteboard");
    throw error;
    }
};

// ============================
// Star / Unstar
// ============================

export async function toggleStarProject(slug: string): Promise<{ is_starred: boolean; stars: number } | null> {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No token found in localStorage");
            return null;
        }
        const response = await axios.post(`${BASE_URL}${slug}/star/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to toggle star:", error);
        return null;
    }
}

// ============================
// Notifications
// ============================

export interface BackendNotification {
    id: number;
    type: "mention" | "pull_request" | "commit" | "team" | "task" | "general";
    title: string;
    message: string;
    project: string | null;
    read: boolean;
    time: string;
}

export async function fetchNotifications(): Promise<BackendNotification[]> {
    try {
        const token = localStorage.getItem("access");
        if (!token) return [];
        const response = await axios.get<BackendNotification[]>(`${BASE_URL}notifications/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
    }
}

export async function markNotificationRead(notificationId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem("access");
        if (!token) return false;
        await axios.post(`${BASE_URL}notifications/${notificationId}/read/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        return false;
    }
}

export async function markAllNotificationsRead(): Promise<boolean> {
    try {
        const token = localStorage.getItem("access");
        if (!token) return false;
        await axios.post(`${BASE_URL}notifications/read-all/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        return false;
    }
}