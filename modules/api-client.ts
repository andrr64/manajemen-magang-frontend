/**
 * InternFlow Hybrid API Client
 * Automatically connects to the real Spring Boot backend running on localhost:8080
 * with support for Bearer JWT token headers.
 * Gracefully falls back to high-fidelity simulated LocalStorage mock database when backend is offline.
 */

const BASE_URL = "http://localhost:8080";

export class APIError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

export const delay = (ms: number = 400) => 
  new Promise((resolve) => setTimeout(resolve, ms));

// Stateful LocalStorage Mock DB for high-fidelity offline mode
export const mockDB = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(`internflow_db_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.error(`Error reading key "${key}" from localStorage:`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`internflow_db_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing key "${key}" to localStorage:`, e);
    }
  },

  updateList<T extends { id: string | number }>(
    key: string,
    updateFn: (list: T[]) => T[],
    defaultValue: T[]
  ): T[] {
    const current = this.get<T[]>(key, defaultValue);
    const updated = updateFn(current);
    this.set(key, updated);
    return updated;
  }
};

export interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

// Simulated offline request execution
export async function simulateAPIRequest<T>(
  actionName: string,
  executor: () => T,
  shouldFail: boolean = false,
  failMessage: string = "Request failed"
): Promise<APIResponse<T>> {
  console.log(`[API Mock] Executing: ${actionName}...`);
  await delay();

  if (shouldFail) {
    throw new APIError(failMessage, 400);
  }

  try {
    const data = executor();
    return {
      data,
      status: 200,
      message: "Success (Mock Mode)",
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    throw new APIError(err.message || "Internal Server Error", 500);
  }
}

// Unified hybrid request dispatcher
export async function executeHybridRequest<T>(
  actionName: string,
  apiPath: string,
  fetchOptions: RequestInit = {},
  mockExecutor: () => T
): Promise<APIResponse<T>> {
  console.log(`[API Dispatch] ${actionName} -> target: ${BASE_URL}${apiPath}`);
  
  // 1. Prepare request authorization headers
  const token = typeof window !== "undefined" ? localStorage.getItem("internflow_token") : null;
  const headers = new Headers(fetchOptions.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const mergedOptions = {
    ...fetchOptions,
    headers
  };

  // 2. Attempt real backend network request
  try {
    const response = await fetch(`${BASE_URL}${apiPath}`, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Terjadi kesalahan pada server.";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (_) {}
      console.warn(`[API Real] Error response: ${response.status}`, errorMessage);
      throw new APIError(errorMessage, response.status);
    }

    let data: T;
    if (response.status === 204) {
      data = {} as T;
    } else {
      data = await response.json() as T;
    }

    console.log(`[API Real] Success: ${actionName}`);
    return {
      data,
      status: response.status,
      message: "Success (Real Mode)",
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    // If it is a network connectivity issue (server down or CORS/DNS fail)
    if (err instanceof TypeError || err.message === "Failed to fetch" || err.code === "ECONNREFUSED") {
      console.warn(`[API Dispatch] Spring Boot backend is offline or unreachable at ${BASE_URL}. Falling back to stateful Mock DB.`);
      return await simulateAPIRequest(actionName, mockExecutor);
    }
    
    // Otherwise, propagate actual structured backend/API validation errors
    throw err;
  }
}
