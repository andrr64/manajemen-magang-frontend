import { notifier } from "@/modules/notifier";
import { useState, useEffect, useCallback } from "react";
import { LetterInfo, RequestLetterPayload, VerifyLetterResponse, SuratKeteranganResponse, SuratKeteranganStatResponse } from "./types";
import { suratKeteranganAPI } from "./api";

export function useReferenceLetter() {
  const [letter, setLetter] = useState<LetterInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerifyLetterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLetter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await suratKeteranganAPI.getLetter();
      setLetter(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat surat keterangan magang.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetter();
  }, [fetchLetter]);

  const requestLetter = async (payload: RequestLetterPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await suratKeteranganAPI.requestLetter(payload);
      setLetter(response.data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memohon surat keterangan magang baru.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (code: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await suratKeteranganAPI.verifyCode(code);
      setVerificationResult(response.data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memverifikasi kode surat keterangan.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signLetter = async (payload: Partial<LetterInfo>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await suratKeteranganAPI.signLetter(payload);
      setLetter(response.data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menyetujui dan menandatangani surat.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    letter,
    isLoading,
    isSubmitting,
    verificationResult,
    error,
    requestLetter,
    verifyCode,
    signLetter,
    refreshLetter: fetchLetter,
    clearVerification: () => setVerificationResult(null)
  };
}

export function useStudentReferenceLetters() {
  const [letters, setLetters] = useState<SuratKeteranganResponse[]>([]);
  const [statistics, setStatistics] = useState<SuratKeteranganStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLetters = useCallback(async (status?: string, namaMahasiswa?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        suratKeteranganAPI.getLetterList(status, namaMahasiswa),
        suratKeteranganAPI.getLetterStatistics(namaMahasiswa)
      ]);
      setLetters(listRes.data);
      setStatistics(statsRes.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat daftar surat keterangan magang.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadStudentLetter = async (periodeMagangId: string, url: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await suratKeteranganAPI.uploadSuratKeterangan(periodeMagangId, url);
      await fetchLetters();
      return res.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengunggah berkas surat keterangan magang.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    letters,
    statistics,
    isLoading,
    isSubmitting,
    error,
    refreshLetters: fetchLetters,
    uploadStudentLetter
  };
}
