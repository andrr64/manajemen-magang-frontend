import { notifier } from "@/modules/notifier";
import { useState, useEffect, useCallback } from "react";
import { CertificateInfo, VerifyCertificateResponse, SertifikatResponse, SertifikatStatResponse } from "./types";
import { sertifikatAPI } from "./api";

// Student Hook - View and download own certificate
export function useCertificate() {
  const [certificate, setCertificate] = useState<SertifikatResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerifyCertificateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await sertifikatAPI.getCertificate();
      setCertificate(data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat informasi sertifikat.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const verifyCode = async (code: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await sertifikatAPI.verifyCode(code);
      setVerificationResult(response.data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal verifikasi kode sertifikat.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadCertificate = async (payload: Partial<CertificateInfo>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await sertifikatAPI.issueCertificate(payload);
      setCertificate(response.data as unknown as SertifikatResponse);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menerbitkan sertifikat.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    certificate, 
    isLoading, 
    isSubmitting,
    verificationResult,
    error, 
    refreshCertificate: fetchCertificate,
    verifyCode,
    uploadCertificate
  };
}

// Mentor Hook - Manage all student certificates
export function useStudentCertificates() {
  const [certificates, setCertificates] = useState<SertifikatResponse[]>([]);
  const [statistics, setStatistics] = useState<SertifikatStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async (status?: string, namaMahasiswa?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        sertifikatAPI.getCertificateList(status, namaMahasiswa),
        sertifikatAPI.getCertificateStatistics(namaMahasiswa)
      ]);
      setCertificates(listRes.data);
      setStatistics(statsRes.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat daftar sertifikat bimbingan.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadStudentCertificate = async (periodeMagangId: string, url: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await sertifikatAPI.uploadSertifikat(periodeMagangId, url);
      // Refresh list & statistics
      await fetchCertificates();
      return res.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengunggah berkas sertifikat.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    certificates,
    statistics,
    isLoading,
    isSubmitting,
    error,
    refreshCertificates: fetchCertificates,
    uploadStudentCertificate
  };
}
