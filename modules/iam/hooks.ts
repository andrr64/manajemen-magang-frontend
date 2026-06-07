import { useState, useCallback, useEffect } from "react";
import { iamAPI } from "./api";
import { LoginRequest, RegisterRequest, UpdateUserRequest } from "./types";
import { useIamStore } from "./store";

export function useIam() {
  // Use global persisted state
  const { user, isAuthenticated, setUser, clearUser } = useIamStore();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await iamAPI.getMe();
      setUser(response.data);
    } catch (err: any) {
      clearUser();
      console.warn("No active session:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    // Karena kita sekarang menggunakan HttpOnly cookies (atau mock token),
    // kita tidak bisa mengecek localStorage internflow_token.
    // Jika di Zustand store isAuthenticated adalah true, kita pastikan sessionnya masih valid di server.
    if (isAuthenticated) {
      fetchSession();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await iamAPI.login(payload);
      // Panggil session dan biarkan melemparkan error jika gagal
      const response = await iamAPI.getMe();
      setUser(response.data);
    } catch (err: any) {
      clearUser();
      const errMsg = err.message || "Failed to login.";
      setError(errMsg);
      setIsLoading(false);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await iamAPI.register(payload);
      // Automatically attempt login if password is provided
      if (payload.password) {
        await login({ email: payload.email, password: payload.password });
      }
    } catch (err: any) {
      const errMsg = err.message || "Failed to register.";
      setError(errMsg);
      setIsLoading(false);
      throw new Error(errMsg);
    }
  };

  const updateProfile = async (payload: UpdateUserRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await iamAPI.updateProfile(payload);
      setUser(response.data);
    } catch (err: any) {
      const errMsg = err.message || "Failed to update profile.";
      setError(errMsg);
      setIsLoading(false);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await iamAPI.logout();
    clearUser();
    setIsLoading(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    updateProfile,
    logout,
    refreshSession: fetchSession
  };
}
