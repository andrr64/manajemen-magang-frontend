import { notifier } from "@/modules/notifier";
import { useState } from "react";
import { mediaAPI } from "./api";
import { UploadResponse, DeleteResponse } from "./types";

export interface FileUploadOptions {
  /** Maksimum ukuran berkas dalam MB */
  maxSizeMB?: number;
  /** Daftar MIME type yang diizinkan, contoh: ["application/pdf", "image/jpeg"] */
  allowedTypes?: string[];
}

export interface FileUploadResult {
  /** Key media yang disimpan di backend, simpan ini di field url/attachment entitas terkait */
  key: string;
  /** URL proxy backend untuk menampilkan/mengunduh berkas (mediaAPI.getFileUrl) */
  url: string;
  fileName: string;
  fileSize: number;
}

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
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}

/**
 * Hook untuk mengunggah berkas langsung ke modul media saat dipilih di form
 * (upload-now), lalu mengembalikan key + URL proxy backend untuk disimpan
 * pada entitas terkait (absensi, kegiatan, sertifikat, surat keterangan, dll).
 */
export function useFileUpload(options?: FileUploadOptions) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File) => {
    if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error("Tipe file tidak didukung. Gunakan PDF atau gambar (JPEG/PNG).");
    }
    if (options?.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
      throw new Error(`Ukuran file melebihi batas maksimum ${options.maxSizeMB}MB.`);
    }
  };

  const upload = async (file: File): Promise<FileUploadResult> => {
    setError(null);
    try {
      validate(file);
    } catch (err: any) {
      const errMsg = err.message;
      notifier.error(errMsg);
      setError(errMsg);
      throw err;
    }

    setIsUploading(true);
    try {
      const response = await mediaAPI.uploadFile(file);
      const { key } = response.data;
      return {
        key,
        url: mediaAPI.getFileUrl(key),
        fileName: file.name,
        fileSize: file.size,
      };
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengunggah berkas. Silakan coba lagi.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error, reset: () => setError(null) };
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
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFile, isDeleting, error };
}
