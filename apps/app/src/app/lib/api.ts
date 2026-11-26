const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export async function apiFetch<T>( endpoint: string, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);

    const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData;

    if (!isFormData) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(
            data?.message || "Something went wrong. Please try again.",
            response.status,
        );
    }

    return data as T;
}
