import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser: res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth", error)
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },
    signup: async (form) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post('/auth/signup', form);
            set({authUser: res.data})
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signup", error)
        } finally {
            set({isSigningUp: false})
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser: null})
            toast.success("Logged out successfully")

            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in logout", error)
        }
    },
    login: async (form) => {
        set({isLoggingIng: true})
        try {
            const res = await axiosInstance.post('/auth/login', form);
            set({authUser: res.data})
            toast.success("Logged in successfully")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in login", error)
        } finally {
            set({isLoggingIng: false})
        }
    },
    updateProfile: async (form) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put('/auth/update-profile', form);
            set({authUser: res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in updateProfile", error)
        } finally {
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
}));