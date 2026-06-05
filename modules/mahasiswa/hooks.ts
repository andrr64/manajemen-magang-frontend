import { useState, useEffect, useCallback, useMemo } from "react";
import { Student, CreateStudentRequest, UpdateStudentRequest, StudentStat, StudentFilterParams } from "./types";
import { mahasiswaAPI } from "./api";

export function useStudents(filters?: StudentFilterParams & { searchQuery?: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Extract backend-only filters to prevent refetching on search query changes
  const backendFilters = useMemo(() => {
    return {
      gender: filters?.gender,
      universitas: filters?.universitas,
      status: filters?.status
    };
  }, [filters?.gender, filters?.universitas, filters?.status]);

  const filterKey = JSON.stringify(backendFilters);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mahasiswaAPI.listStudents(backendFilters);
      setStudents(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async (payload: CreateStudentRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await mahasiswaAPI.createStudent(payload);
      setStudents(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mendaftarkan mahasiswa.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeStudent = async (id: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await mahasiswaAPI.deleteStudent(id);
      setStudents(prev => prev.filter(s => String(s.id) !== String(id)));
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus akun mahasiswa.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized local search filter on top of the backend filter results
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const query = (filters?.searchQuery || "").toLowerCase().trim();
      const matchesSearch = 
        query === "" ||
        s.name.toLowerCase().includes(query) ||
        s.nim.includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.university.toLowerCase().includes(query) ||
        s.program.toLowerCase().includes(query) ||
        s.role.toLowerCase().includes(query) ||
        s.company.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [students, filters?.searchQuery]);

  return {
    students: filteredStudents,
    rawStudents: students,
    isLoading,
    isSubmitting,
    error,
    addStudent,
    removeStudent,
    refreshStudents: fetchStudents
  };
}

export function useStudentDetail(id?: number | string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id === undefined || id === null || id === "" || (typeof id === "number" && Number.isNaN(id))) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await mahasiswaAPI.getStudentById(id);
      setStudent(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat detail mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateStudentDetail = async (payload: UpdateStudentRequest) => {
    if (!id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await mahasiswaAPI.updateStudent(id, payload);
      setStudent(response.data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memperbarui data mahasiswa.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    student,
    isLoading,
    isSubmitting,
    error,
    updateStudentDetail,
    refreshDetail: fetchDetail
  };
}

export function useStudentStats(filters?: { gender?: string; universitas?: string }) {
  const [stats, setStats] = useState<StudentStat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mahasiswaAPI.getStudentStatistics(filters);
      setStats(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat statistik mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  }, [filterKey]);

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
