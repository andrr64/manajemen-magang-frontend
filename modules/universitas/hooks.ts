import { notifier } from "@/modules/notifier";
import { useState, useEffect, useCallback } from "react";
import { Universitas, UniversitasRequest } from "./types";
import { universitasApi } from "./api";

export function useUniversitas() {
  const [universitasList, setUniversitasList] = useState<Universitas[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversitasList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await universitasApi.getUniversitasList();
      setUniversitasList(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Gagal memuat daftar universitas.";
      notifier.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversitasList();
  }, [fetchUniversitasList]);

  const addUniversitas = async (payload: UniversitasRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await universitasApi.addUniversitas(payload);
      setUniversitasList(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menambahkan universitas.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editUniversitas = async (id: number, payload: UniversitasRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await universitasApi.editUniversitas(id, payload);
      setUniversitasList(prev => 
        prev.map(u => (u.id === id ? response.data : u))
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mengupdate universitas.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUniversitas = async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await universitasApi.deleteUniversitas(id);
      setUniversitasList(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err: any) {
      const errMsg = err.message || "Gagal menghapus universitas.";
      notifier.error(errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    universitasList,
    isLoading,
    isSubmitting,
    error,
    fetchUniversitasList,
    addUniversitas,
    editUniversitas,
    deleteUniversitas
  };
}
