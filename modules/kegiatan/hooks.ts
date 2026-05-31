import { useState, useEffect, useCallback } from "react";
import { Activity, CreateActivityRequest } from "./types";
import { kegiatanAPI, MentorActivityLog } from "./api";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await kegiatanAPI.getStudentActivities();
      setActivities(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar kegiatan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (payload: CreateActivityRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await kegiatanAPI.createStudentActivity(payload);
      setActivities(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menambahkan kegiatan.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadAttachment = async (activityId: number, fileName: string, fileSize: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await kegiatanAPI.uploadStudentAttachment(activityId, fileName, fileSize);
      setActivities(prev => prev.map(a => a.id === activityId ? response.data : a));
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengunggah berkas lampiran.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteActivity = async (activityId: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await kegiatanAPI.deleteStudentActivity(activityId);
      setActivities(prev => prev.filter(a => a.id !== activityId));
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus kegiatan.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activities,
    isLoading,
    isSubmitting,
    error,
    addActivity,
    uploadAttachment,
    deleteActivity,
    refreshActivities: fetchActivities
  };
}

export function useMentorActivities() {
  const [activities, setActivities] = useState<MentorActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await kegiatanAPI.getMentorActivities();
      setActivities(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data kegiatan mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const approveActivity = async (activityId: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await kegiatanAPI.approveMentorActivity(activityId, "Disetujui");
      setActivities(prev => prev.map(a => a.id === activityId ? response.data : a));
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memverifikasi kegiatan.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectActivity = async (activityId: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await kegiatanAPI.deleteMentorActivity(activityId);
      setActivities(prev => prev.filter(a => a.id !== activityId));
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menolak laporan kegiatan.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activities,
    isLoading,
    isSubmitting,
    error,
    approveActivity,
    rejectActivity,
    refreshActivities: fetchActivities
  };
}
