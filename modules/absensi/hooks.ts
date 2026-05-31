import { useState, useEffect, useCallback } from "react";
import { AttendanceLog, AttendanceSummary, CheckInRequest } from "./types";
import { absensiAPI } from "./api";

export function useAttendance() {
  const [history, setHistory] = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (status?: string, namaMahasiswa?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await absensiAPI.getHistory(status, namaMahasiswa);
      setHistory(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat riwayat kehadiran.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const checkIn = async (payload: CheckInRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await absensiAPI.checkIn(payload);
      // Optimistic update or refetch
      setHistory(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal melakukan check-in.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkOut = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await absensiAPI.checkOut();
      // Update local state
      setHistory(prev => prev.map(item => item.date === response.data.date ? response.data : item));
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal melakukan check-out.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verify = async (id: string | number, status: "Diverifikasi" | "Ditolak") => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await absensiAPI.verifyAttendance(id, status);
      setHistory(prev => prev.map(item => item.id === id ? response.data : item));
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memverifikasi kehadiran.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLog = async (id: string | number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await absensiAPI.deleteAttendance(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus catatan absensi.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper helper to check today's status
  const getTodayStatus = useCallback(() => {
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const todayLog = history.find(h => h.date === todayStr);
    
    return {
      hasCheckedIn: !!todayLog,
      hasCheckedOut: todayLog ? todayLog.checkOut !== "Pending" : false,
      todayLog
    };
  }, [history]);

  return {
    history,
    isLoading,
    isSubmitting,
    error,
    checkIn,
    checkOut,
    verify,
    deleteLog,
    getTodayStatus,
    refreshHistory: fetchHistory
  };
}

export function useAttendanceStats() {
  const [stats, setStats] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await absensiAPI.getSummary();
      setStats(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat statistik kehadiran.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
