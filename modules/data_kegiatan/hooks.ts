import { useState, useEffect, useCallback } from "react";
import { Activity, CreateActivityRequest, ActivityStat, ActivityRekapResponse } from "./types";
import { kegiatanAPI, MentorActivityLog } from "./api";
import { mediaAPI } from "../media/api";
import { notifier } from "@/modules/notifier";

export function useActivities() {
  const [activities,   setActivities]   = useState<Activity[]>([]);
  const [isLoading,    setIsLoading]    = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error,        setError]        = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await kegiatanAPI.getStudentActivities();
      setActivities(res.data);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat daftar kegiatan.";
      notifier.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const addActivity = async (payload: CreateActivityRequest): Promise<Activity> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await kegiatanAPI.createStudentActivity(payload);
      setActivities(prev => [res.data, ...prev]);
      notifier.success("Kegiatan berhasil ditambahkan.");
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal menambahkan kegiatan.";
      setError(msg);
      throw new Error(msg);
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
      const msg = err.message || "Gagal menghapus kegiatan.";
      notifier.error(msg);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { activities, isLoading, isSubmitting, error, addActivity, deleteActivity, refreshActivities: fetchActivities };
}

export function useMentorActivities() {
  const [activities,   setActivities]   = useState<MentorActivityLog[]>([]);
  const [isLoading,    setIsLoading]    = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error,        setError]        = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await kegiatanAPI.getMentorActivities();
      setActivities(res.data);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat data kegiatan mahasiswa.";
      notifier.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const approveActivity = async (activityId: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await kegiatanAPI.approveMentorActivity(activityId, "Disetujui");
      setActivities(prev => prev.map(a => String(a.id) === String(activityId) ? res.data : a));
      notifier.success("Kegiatan berhasil disetujui.");
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal memverifikasi kegiatan.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const revokeActivity = async (activityId: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await kegiatanAPI.approveMentorActivity(activityId, "Dalam Review");
      setActivities(prev => prev.map(a => String(a.id) === String(activityId) ? res.data : a));
      notifier.success("Persetujuan kegiatan berhasil dicabut.");
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal mencabut persetujuan kegiatan.";
      notifier.error(msg);
      setError(msg);
      throw new Error(msg);
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
      const msg = err.message || "Gagal menolak laporan kegiatan.";
      notifier.error(msg);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileUrls = (activity: MentorActivityLog): string[] => {
    return (activity.attachments ?? []).map(key => mediaAPI.getFileUrl(key));
  };

  return { activities, isLoading, isSubmitting, error, approveActivity, revokeActivity, rejectActivity, getFileUrls, refreshActivities: fetchActivities };
}

export function useActivityStats(status?: string, namaMahasiswa?: string) {
  const [stats,     setStats]     = useState<ActivityStat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await kegiatanAPI.getActivityStatistics(status, namaMahasiswa);
      setStats(res.data);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat statistik kegiatan.";
      notifier.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [status, namaMahasiswa]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, isLoading, error, refreshStats: fetchStats };
}

export function useRekapKegiatan(mahasiswaId?: string) {
  const [data, setData] = useState<ActivityRekapResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRekap = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = mahasiswaId 
        ? await kegiatanAPI.getRekapActivitiesByMahasiswaId(mahasiswaId)
        : await kegiatanAPI.getRekapActivities();
      setData(res.data);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat rekap kegiatan.";
      notifier.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [mahasiswaId]);

  useEffect(() => { fetchRekap(); }, [fetchRekap]);

  return { data, isLoading, error, refreshRekap: fetchRekap };
}
