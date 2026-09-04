import { create } from "zustand";

interface AuthState {
  userId: string | null;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: {
    id: string;
    email: string;
    display_name: string | null;
  }) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  userId: null,
  email: null,
  displayName: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user) =>
    set({
      userId: user.id,
      email: user.email,
      displayName: user.display_name,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearAuth: () =>
    set({
      userId: null,
      email: null,
      displayName: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
