import { useState } from "react";
import { mediaAPI } from "./api";
import { UploadResponse, DeleteResponse } from "./types";

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    setError(null);
    try {
      const response = await mediaAPI.uploadFile(file);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengunggah file. Silakan coba lagi.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}

export function useMediaDelete() {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFile = async (key: string): Promise<DeleteResponse> => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await mediaAPI.deleteFile(key);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus file. Silakan coba lagi.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFile, isDeleting, error };
}
