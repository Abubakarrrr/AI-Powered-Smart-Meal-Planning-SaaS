import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string | undefined;
  role: "user" | "nutritionist" | "admin";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setAvatar: (user: User | null) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  checkAuth: () => Promise<void>;
  onlineUsers: string[];
}

// Store socket instance outside Zustand to prevent circular references
export let socket: Socket | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      onlineUsers: [],
      isCheckingAuth: true,

      checkAuth: async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/auth/v1/check-auth`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (data.success) {
            set({ user: data.user });
            get().connectSocket();
          }
    } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ user: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      setAvatar: (user) => set({ user }),
      //login
      setAuth: (user) => {
        set({ user, isAuthenticated: true });
        get().connectSocket();
      },
      //logout
      clearAuth: () => {
        set({ user: null, isAuthenticated: false });
        get().disconnectSocket();
      },

      connectSocket: () => {
        const { user } = get();
        if (!user || (socket && socket.connected)) return;

        socket = io("http://localhost:3001", {
          query: {
            userId: user._id,
          },
        });

        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        if (socket) {
          socket.disconnect();
        }
      },
    }),
    { name: "auth-store" }
  )
);
