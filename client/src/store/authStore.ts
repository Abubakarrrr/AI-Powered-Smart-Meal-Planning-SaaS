import { create } from "zustand";
import axios from "axios";

// Define API URL
const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "nutritionist";
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Signup function
  signup: (email: string, name: string, password: string, role: "user" | "nutritionist") => Promise<void>;

  // Login function
  login: (email: string, password: string) => Promise<void>;

  // Logout function
  logout: () => void;
}

// Zustand Store Implementation
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signup: async (email, name, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        role,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error signing up",
      });
      throw error;
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<{ user: User }>(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Invalid credentials",
      });
      throw error;
    }
  },

  // Logout function
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
