import { create } from "zustand";
const BASE_URL = import.meta.env.VITE_API_URL;
import { socket as socket1 } from "@/store/authStore";
import { useAuthStore } from "@/store/authStore";
// Define types for messages and users
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  sendMessage: (messageData: any) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages:()=>void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/api/messages/v1/users`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      //   console.log(data)
      set({ users: data.users });
    } catch (error) {
      console.error("Error getting users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const response = await fetch(
        `${BASE_URL}/api/messages/v1/getMessages/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log(data);
      set({ messages: data.messages });
    } catch (error) {
      console.error("Error getting messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: any) => {
    const { selectedUser, messages } = get();
    console.log(messageData);
    try {
      const response = await fetch(
        `${BASE_URL}/api/messages/v1/send/${selectedUser?._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        }
      );
      const data = await response.json();
      console.log(data);
      set({ messages: [...messages, data] });
    } catch (error) {
      console.log(error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = socket1;

    socket!.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = socket1;
    socket!.off("newMessage");
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
