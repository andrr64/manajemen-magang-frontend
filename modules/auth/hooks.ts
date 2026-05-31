import { useState, useEffect, useCallback } from "react";
import { User, LoginRequest, RegisterRequest, ProfileUpdateRequest } from "./types";
import { authAPI } from "./api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(!!response.data);
    } catch (err: any) {
      console.warn("No active session:", err.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(payload);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal masuk. Silakan coba lagi.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(payload);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal mendaftar. Silakan coba lagi.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Gagal logout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshSession: fetchSession
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.getCurrentUser();
      setProfile(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data profil.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (payload: ProfileUpdateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.updateProfile(payload);
      setProfile(response.data);
      // Also update current session
      return response.data;
    } catch (err: any) {
      const errMsg = err.message || "Gagal memperbarui profil.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
}
