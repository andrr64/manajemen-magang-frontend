import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse } from './types';

interface IamState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  setUser: (user: UserResponse | null) => void;
  clearUser: () => void;
}

export const useIamStore = create<IamState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'iam-storage', // The key used in localStorage
    }
  )
);
