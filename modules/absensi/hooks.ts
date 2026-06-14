import { useState, useEffect, useCallback } from "react";
import {
  AttendanceLog,
  AttendanceSummary,
  AbsensiMahasiswaStat,
  CheckInRequest,
  SubmitAbsensiRequest,
} from "./types";
import { absensiAPI } from "./api";

// =====================================================================
// useAttendance — MENTOR: list, verifikasi, hapus, refresh
// =====================================================================

export function useAttendance() {
  const [history,      setHistory]      = useState<AttendanceLog[]>([]);
  const [isLoading,    setIsLoading]    = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error,        setError]        = useState<string | null>(null);

  const fetchHistory = useCallback(async (status?: string, namaMahasiswa?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await absensiAPI.getHistory(status, namaMahasiswa);
      setHistory(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat riwayat kehadiran.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  /** Verifikasi absensi: setujui / tolak */
  const verify = async (id: string | number, status: "Diverifikasi" | "Ditolak") => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await absensiAPI.verifyAttendance(id, status);
      setHistory(prev => prev.map(item => item.id === id ? res.data : item));
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal memverifikasi kehadiran.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Hapus record absensi */
  const deleteLog = async (id: string | number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await absensiAPI.deleteAttendance(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      const msg = err.message || "Gagal menghapus catatan absensi.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Ekspor rekap absensi ke CSV */
  const exportCSV = async (status?: string, namaMahasiswa?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await absensiAPI.exportAbsensi(status, namaMahasiswa);
      // Trigger browser download
      const blob = new Blob([res.data as string], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "rekap-absensi.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      const msg = err.message || "Gagal mengekspor data absensi.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Lihat URL surat keterangan */
  const getSuratKeterangan = async (id: string | number) => {
    try {
      const res = await absensiAPI.getSuratKeterangan(id);
      return res.data.url;
    } catch (err: any) {
      const msg = err.message || "Gagal mendapatkan surat keterangan.";
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    history,
    isLoading,
    isSubmitting,
    error,
    verify,
    deleteLog,
    exportCSV,
    getSuratKeterangan,
    refreshHistory: fetchHistory,
    clearError: () => setError(null),
  };
}

// =====================================================================
// useAttendanceStats — MENTOR: statistik (hadir + izin/sakit)
// =====================================================================

export function useAttendanceStats(namaMahasiswa?: string) {
  const [stats,     setStats]     = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await absensiAPI.getSummary(namaMahasiswa);
      setStats(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat statistik kehadiran.");
    } finally {
      setIsLoading(false);
    }
  }, [namaMahasiswa]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, isLoading, error, refreshStats: fetchStats };
}

// =====================================================================
// useSubmitAbsensi — MAHASISWA: submit absensi harian + file upload
// =====================================================================

export function useSubmitAbsensi() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result,       setResult]       = useState<AttendanceLog | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  /**
   * Submit absensi harian.
   * @param payload - { status, keterangan?, file? }
   */
  const submit = async (payload: SubmitAbsensiRequest): Promise<AttendanceLog> => {
    // Validasi file di sisi klien sebelum kirim ke backend
    if (payload.file) {
      const MAX_MB = 10;
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(payload.file.type)) {
        const msg = "Tipe file tidak didukung. Gunakan PDF, JPEG, atau PNG.";
        setError(msg);
        throw new Error(msg);
      }
      if (payload.file.size > MAX_MB * 1024 * 1024) {
        const msg = `Ukuran file melebihi ${MAX_MB}MB. Kompres file Anda terlebih dahulu.`;
        setError(msg);
        throw new Error(msg);
      }
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await absensiAPI.submitAbsensi(payload);
      setResult(res.data);
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal mengirimkan absensi. Coba lagi.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submit,
    isSubmitting,
    result,
    error,
    clearError: () => setError(null),
    clearResult: () => setResult(null),
  };
}

// =====================================================================
// useRiwayatAbsensi — MAHASISWA: riwayat 30 hari terakhir
// =====================================================================

export function useRiwayatAbsensi() {
  const [riwayat,   setRiwayat]   = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchRiwayat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await absensiAPI.getRiwayatAbsensi();
      setRiwayat(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat riwayat absensi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchRiwayat(); }, [fetchRiwayat]);

  /**
   * Cek apakah mahasiswa sudah absen hari ini.
   * Berguna untuk menonaktifkan tombol kirim presensi.
   */
  const getTodayStatus = useCallback(() => {
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const todayLog = riwayat.find(h => h.date === todayStr);
    return {
      hasSubmitted: !!todayLog,
      todayLog,
    };
  }, [riwayat]);

  return {
    riwayat,
    isLoading,
    error,
    getTodayStatus,
    refreshRiwayat: fetchRiwayat,
    clearError: () => setError(null),
  };
}

// =====================================================================
// useAbsensiMahasiswaStat — MAHASISWA: statistik pribadi
// =====================================================================

export function useAbsensiMahasiswaStat() {
  const [stat,      setStat]      = useState<AbsensiMahasiswaStat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchStat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await absensiAPI.getMahasiswaStat();
      setStat(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat statistik absensi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStat(); }, [fetchStat]);

  return { stat, isLoading, error, refreshStat: fetchStat };
}

// =====================================================================
// useTotalKehadiran — MAHASISWA: total kehadiran
// =====================================================================

export function useTotalKehadiran(overrideUserId?: string | number) {
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await absensiAPI.getTotalKehadiran(overrideUserId);
        setTotal(res.data);
      } catch (err) {
        console.error("Gagal mendapatkan total kehadiran", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTotal();
  }, [overrideUserId]);

  return { total, isLoading };
}

// =====================================================================
// useStatistikKehadiran — MAHASISWA: statistik harian kehadiran
// =====================================================================

export function useStatistikKehadiran() {
  const [stat, setStat] = useState<{ totalHadir: number; totalIzin: number; totalSakit: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await absensiAPI.getStatistikKehadiran();
      setStat(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat statistik kehadiran harian.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStat(); }, [fetchStat]);

  return { stat, isLoading, error, refreshStat: fetchStat };
}


// =====================================================================
// Legacy export — kompatibilitas komponen yang sudah ada
// =====================================================================

/** @deprecated Gunakan useRiwayatAbsensi + useSubmitAbsensi untuk MAHASISWA side */
export function useAttendanceLegacy() {
  const [history,      setHistory]      = useState<AttendanceLog[]>([]);
  const [isLoading,    setIsLoading]    = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error,        setError]        = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await absensiAPI.getRiwayatAbsensi();
      setHistory(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat riwayat kehadiran.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const checkIn = async (payload: CheckInRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await absensiAPI.checkIn(payload);
      setHistory(prev => [res.data, ...prev]);
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal melakukan check-in.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkOut = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await absensiAPI.checkOut();
      setHistory(prev => prev.map(item => item.date === res.data.date ? res.data : item));
      return res.data;
    } catch (err: any) {
      const msg = err.message || "Gagal melakukan check-out.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayStatus = useCallback(() => {
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const todayLog = history.find(h => h.date === todayStr);
    return {
      hasCheckedIn:  !!todayLog,
      hasCheckedOut: todayLog ? todayLog.checkOut !== "Pending" : false,
      todayLog,
    };
  }, [history]);

  return {
    history,
    isLoading,
    isSubmitting,
    error,
    checkIn,
    checkOut,
    getTodayStatus,
    refreshHistory: fetchHistory,
  };
}
