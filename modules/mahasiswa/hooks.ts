import { useState, useEffect, useCallback, useMemo } from "react";
import { Student, CreateStudentRequest, UpdateStudentRequest } from "./types";
import { mahasiswaAPI } from "./api";

export function useStudents(options?: { searchQuery?: string; statusFilter?: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mahasiswaAPI.listStudents();
      setStudents(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const removeStudent = async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await mahasiswaAPI.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus akun mahasiswa.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized filtered list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const query = (options?.searchQuery || "").toLowerCase().trim();
      const matchesSearch = 
        query === "" ||
        s.name.toLowerCase().includes(query) ||
        s.nim.includes(query) ||
        s.university.toLowerCase().includes(query) ||
        s.program.toLowerCase().includes(query) ||
        s.role.toLowerCase().includes(query);

      const status = options?.statusFilter || "Semua";
      const matchesStatus = status === "Semua" || s.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [students, options?.searchQuery, options?.statusFilter]);

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
