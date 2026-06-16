import { notifier } from "@/modules/notifier";
import { useState, useEffect, useCallback } from "react";
import { AssessmentItem, GradeSummary, SubmitGradeRequest, PenilaianStatResponse } from "./types";
import { penilaianAPI } from "./api";

export function useAssessment() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await penilaianAPI.getMahasiswaNilai();
      setAssessments(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat detail komponen penilaian.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const submitGrades = async (payload: SubmitGradeRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await penilaianAPI.submitStudentGrades(payload);
      await fetchAssessments(); // Reload
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengirim penilaian.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    assessments,
    isLoading,
    isSubmitting,
    error,
    submitGrades,
    refreshAssessments: fetchAssessments
  };
}

export function useGrades() {
  const [summary, setSummary] = useState<GradeSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await penilaianAPI.getGradeSummary();
      setSummary(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat rekap nilai.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    refreshSummary: fetchSummary
  };
}

export function useStudentAssessments() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async (status?: string, namaMahasiswa?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await penilaianAPI.getStudentAssessmentList(status, namaMahasiswa);
      setAssessments(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat daftar penilaian mahasiswa.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    assessments,
    isLoading,
    error,
    refreshAssessments: fetchAssessments
  };
}

export function usePenilaianStats(namaMahasiswa?: string) {
  const [stats, setStats] = useState<PenilaianStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await penilaianAPI.getPenilaianStatistics(namaMahasiswa);
      setStats(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat statistik penilaian.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [namaMahasiswa]);

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
