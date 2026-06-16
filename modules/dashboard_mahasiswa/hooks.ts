import { useState, useEffect, useCallback } from "react";
import { dashboardMahasiswaAPI } from "./api";
import { notifier } from "@/modules/notifier";
import { DashboardMahasiswaStatResponse } from "./types";

export function useDashboardMahasiswaStats(mahasiswaId?: string | number) {
  const [stats, setStats] = useState<DashboardMahasiswaStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!mahasiswaId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardMahasiswaAPI.getDashboardStats(mahasiswaId);
      if (response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengambil data statistik dashboard.";
      notifier.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [mahasiswaId]);

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
