import { useState, useEffect, useCallback } from "react";
import { dashboardMentorAPI } from "./api";
import { notifier } from "@/modules/notifier";
import { DashboardStatResponse, SearchStudentResponse, RegisterStudentRequest } from "./types";

/**
 * Hook untuk mendapatkan statistik dashboard mentor.
 */
export function useDashboardMentorStats(mentorId?: string | number) {
  const [stats, setStats] = useState<DashboardStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardMentorAPI.getDashboardStats(mentorId);
      if (response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengambil statistik dashboard mentor.";
      notifier.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [mentorId]);

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

/**
 * Hook untuk melakukan pencarian mahasiswa bimbingan.
 */
export function useSearchStudents(initialSearchTerm: string = "") {
  const [students, setStudents] = useState<SearchStudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const fetchStudents = useCallback(async (nameQuery?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardMentorAPI.searchStudents(nameQuery);
      if (response.data) {
        setStudents(response.data);
      }
    } catch (err: any) {
      const errMsg = err.message || "Gagal melakukan pencarian mahasiswa.";
      notifier.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Basic debounce for automatic searching (could be optimized with a real debounce)
    const timeout = setTimeout(() => {
      fetchStudents(searchTerm);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchStudents]);

  return {
    students,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refreshStudents: () => fetchStudents(searchTerm)
  };
}
