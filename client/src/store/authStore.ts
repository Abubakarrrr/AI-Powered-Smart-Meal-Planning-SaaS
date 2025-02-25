import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string | undefined;
  role:"user" | "nutritionist" | "admin"
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setAvatar:(user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
       
      setAvatar: (user) => set({user}),
      setAuth: (user) =>
        set({ user, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null,isAuthenticated: false }),
    }),
    { name: "auth-store" }
  )
);
    