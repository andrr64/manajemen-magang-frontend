import { notifier } from "@/modules/notifier";
import { useState, useEffect, useCallback } from "react";
import { AssessmentItem, GradeSummary, PenilaianStatResponse, PenilaianResponse, PenilaianRequest } from "./types";
import { penilaianAPI, mapPenilaianToAssessmentItems } from "./api";

export function useAssessment() {
  const [penilaian,    setPenilaian]    = useState<PenilaianResponse | null>(null);
  const [assessments,  setAssessments]  = useState<AssessmentItem[]>([]);
  const [isLoading,    setIsLoading]    = useState<boolean>(true);
  const [error,        setError]        = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await penilaianAPI.getMahasiswaNilai();
      setPenilaian(data);
      // hanya map ke assessments jika statusPenilaian SUDAH_DINILAI
      setAssessments(data?.statusPenilaian === "SUDAH_DINILAI" ? mapPenilaianToAssessmentItems(data) : []);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat data penilaian.";
      notifier.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  return { penilaian, assessments, isLoading, error, refreshAssessments: fetchAssessments };
}



export function useStudentAssessments() {
  const [assessments,  setAssessments]  = useState<PenilaianResponse[]>([]);
  const [isLoading,    setIsLoading]    = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error,        setError]        = useState<string | null>(null);

  const fetchAssessments = useCallback(async (status?: string, namaMahasiswa?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await penilaianAPI.getStudentAssessmentList(status, namaMahasiswa);
      setAssessments(response.data);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat daftar penilaian mahasiswa.";
      notifier.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  const submitGrades = async (payload: PenilaianRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await penilaianAPI.submitStudentGrades(payload);
      await fetchAssessments();
      notifier.success("Penilaian berhasil disimpan.");
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal menyimpan penilaian.";
      notifier.error(msg);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { assessments, isLoading, isSubmitting, error, submitGrades, refreshAssessments: fetchAssessments };
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
