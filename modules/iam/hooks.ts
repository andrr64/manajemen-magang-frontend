import { useState, useCallback, useEffect } from "react";
import { iamAPI } from "./api";
import { LoginRequest, RegisterRequest, UpdateUserRequest } from "./types";
import { useIamStore } from "./store";
import { notifier } from "@/modules/notifier";

export function useIam() {
  const store = useIamStore();
  const [mounted, setMounted] = useState(false);
  
  // Start with loading true to prevent hydration mismatch for protected routes
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSession = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const response = await iamAPI.getMe();
      store.setUser(response.data);
    } catch (err: any) {
      store.clearUser();
      if (!silent) console.warn("No active session:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  useEffect(() => {
    if (mounted) {
      if (store.isAuthenticated) {
        // Silently re-verify session in the background so we don't block the UI
        fetchSession(true);
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const login = async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await iamAPI.login(payload);
      // Fetch session data
      const response = await iamAPI.getMe();
      store.setUser(response.data);
      notifier.success("Login berhasil!");
    } catch (err: any) {
      store.clearUser();
      const errMsg = err.message || "Failed to login.";
      notifier.error(errMsg);
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
      } else {
        notifier.success("Registrasi berhasil!");
      }
    } catch (err: any) {
      const errMsg = err.message || "Failed to register.";
      notifier.error(errMsg);
      setError(errMsg);
      setIsLoading(false);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload: UpdateUserRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await iamAPI.updateProfile(payload);
      store.setUser(response.data);
      notifier.success("Profil berhasil diperbarui!");
    } catch (err: any) {
      const errMsg = err.message || "Failed to update profile.";
      notifier.error(errMsg);
      setError(errMsg);
      setIsLoading(false);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await iamAPI.logout();
      notifier.success("Logout berhasil!");
    } finally {
      store.clearUser();
      setIsLoading(false);
    }
  };

  return {
    user: mounted ? store.user : null,
    isAuthenticated: mounted ? store.isAuthenticated : false,
    isLoading: !mounted || isLoading,
    error,
    login,
    register,
    updateProfile,
    logout,
    refreshSession: () => fetchSession(false)
  };
}
