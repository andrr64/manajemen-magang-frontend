import { useState, useEffect, useCallback } from "react";
import { Activity, CreateActivityRequest, ActivityStat } from "./types";
import { kegiatanAPI, MentorActivityLog } from "./api";
import { mediaAPI } from "../media/api";
import { notifier } from "@/modules/notifier";

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
      const errMsg = err.message || "Gagal memuat daftar kegiatan.";
      notifier.error(errMsg);
      setError(errMsg);
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
      notifier.success("Kegiatan berhasil ditambahkan.");
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menambahkan kegiatan.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadAttachment = async (activityId: number | string, fileKey: string, fileName: string, fileSize: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await kegiatanAPI.uploadStudentAttachment(activityId, fileKey, fileName, fileSize);
      setActivities(prev => prev.map(a => String(a.id) === String(activityId) ? response.data : a));
      notifier.success("Berkas lampiran berhasil diunggah.");
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengunggah berkas lampiran.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteActivity = async (activityId: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await kegiatanAPI.deleteStudentActivity(activityId);
      setActivities(prev => prev.filter(a => String(a.id) !== String(activityId)));
      notifier.success("Kegiatan berhasil dihapus.");
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus kegiatan.";
      notifier.error(errMsg);
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
      const errMsg = err.message || "Gagal memuat data kegiatan mahasiswa.";
      notifier.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const approveActivity = async (activityId: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await kegiatanAPI.approveMentorActivity(activityId, "Disetujui");
      setActivities(prev => prev.map(a => String(a.id) === String(activityId) ? response.data : a));
      notifier.success("Kegiatan berhasil disetujui.");
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memverifikasi kegiatan.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectActivity = async (activityId: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await kegiatanAPI.deleteMentorActivity(activityId);
      setActivities(prev => prev.filter(a => String(a.id) !== String(activityId)));
      notifier.success("Laporan kegiatan berhasil ditolak.");
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menolak laporan kegiatan.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchFileUrl = async (activityId: number | string) => {
    try {
      const response = await kegiatanAPI.getActivityFileUrl(activityId);
      return mediaAPI.getFileUrl(response.data.url);
    } catch (err: any) {
      throw new Error(err.message || "Gagal mendapatkan tautan berkas.");
    }
  };

  return {
    activities,
    isLoading,
    isSubmitting,
    error,
    approveActivity,
    rejectActivity,
    fetchFileUrl,
    refreshActivities: fetchActivities
  };
}

export function useActivityStats(status?: string, namaMahasiswa?: string) {
  const [stats, setStats] = useState<ActivityStat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await kegiatanAPI.getActivityStatistics(status, namaMahasiswa);
      setStats(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat statistik kegiatan.";
      notifier.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [status, namaMahasiswa]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats
  };
}
