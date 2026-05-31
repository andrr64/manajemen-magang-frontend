import { useState, useEffect, useCallback, useMemo } from "react";
import { Mentor, CreateMentorRequest, UpdateMentorRequest } from "./types";
import { mentorAPI } from "./api";

export function useMentors(options?: { searchQuery?: string; typeFilter?: string }) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mentorAPI.listMentors();
      setMentors(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar mentor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const addMentor = async (payload: CreateMentorRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await mentorAPI.createMentor(payload);
      setMentors(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menambahkan mentor.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMentor = async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await mentorAPI.deleteMentor(id);
      setMentors(prev => prev.filter(m => m.id !== id));
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus data mentor.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized search and filters
  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      const query = (options?.searchQuery || "").toLowerCase().trim();
      const matchesSearch = 
        query === "" ||
        m.name.toLowerCase().includes(query) ||
        m.identityNo.includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.departmentOrCompany.toLowerCase().includes(query);

      const type = options?.typeFilter || "Semua";
      const matchesType = type === "Semua" || m.type === type;

      return matchesSearch && matchesType;
    });
  }, [mentors, options?.searchQuery, options?.typeFilter]);

  return {
    mentors: filteredMentors,
    rawMentors: mentors,
    isLoading,
    isSubmitting,
    error,
    addMentor,
    removeMentor,
    refreshMentors: fetchMentors
  };
}

export function useMentorDetail(id?: number) {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await mentorAPI.getMentorById(id);
      setMentor(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat detail data mentor.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateMentorDetail = async (payload: UpdateMentorRequest) => {
    if (!id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await mentorAPI.updateMentor(id, payload);
      setMentor(response.data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memperbarui data mentor.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mentor,
    isLoading,
    isSubmitting,
    error,
    updateMentorDetail,
    refreshDetail: fetchDetail
  };
}
