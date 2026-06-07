import { executeHybridRequest } from "../api-client";
import { UploadResponse, DeleteResponse } from "./types";

// Base URL for constructing direct links to media files
// If the app uses a dynamic base URL or environment variable, update this accordingly.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const mediaAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return executeHybridRequest<UploadResponse>(
      `Upload file: ${file.name}`,
      "/api/media/upload",
      {
        method: "POST",
        body: formData,
        // executeHybridRequest will handle removing Content-Type application/json when body is FormData
      },
      () => {
        // Mock fallback behavior
        const fakeKey = `mock-${Date.now()}-${file.name}`;
        return {
          message: "File uploaded successfully (Mock)",
          key: fakeKey
        };
      }
    );
  },

  deleteFile: async (key: string) => {
    return executeHybridRequest<DeleteResponse>(
      `Delete file: ${key}`,
      `/api/media/${key}`,
      {
        method: "DELETE",
      },
      () => {
        // Mock fallback behavior
        return {
          message: "File deleted successfully (Mock)",
          key
        };
      }
    );
  },

  // Helper to get the full URL of a media file by its key
  getFileUrl: (key: string): string => {
    if (!key) return "";
    return `${BASE_URL}/api/media/${key}`;
  }
};
