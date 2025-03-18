export interface FetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: any;
    headers?: HeadersInit;
}

export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
}

/**
 * HTTP methods for the API.
 */
export const Method = {
    get: "GET",
    post: "POST",
    patch: "PATCH",
    delete: "DELETE",
    put: "PUT",
} as const;

/**
 * HTTP endpoints for the API.
 */
export const Endpoints = {
    register: "auth/register",
    login: "auth/login",
    getComments: "comments",
    createComments: "comments",
    deleteComments: "comments/:id",
    createProfile: "profiles",
    deleteProfile: "profiles/1",
    getProfiles: "profiles?page=1&limit=0"
} as const;

export const fetchAPI = async <T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    try {
        const { method = "GET", data, headers = {} } = options;

        const fetchOptions: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        if (data && method !== "GET") {
            fetchOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, fetchOptions);
        const result: ApiResponse<T> = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        return result;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
