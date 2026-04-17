import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


export const authStore = create((set, get) => ({
    loggedUser: null,
    onlineUsers: [],
    socket: null,


    signup: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ loggedUser: res.data })
            toast.success("Signup successfull");
            get().connectSocket();
        } catch (error) {
            toast.error("Signup failed. Please try again.", error);
            set({loggedUser:null})
        }
    },

    login: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ loggedUser: res.data })
            toast.success("Login successfull");
            get().connectSocket();
        } catch (error) {
            toast.error("Login failed. Please try again.", error);
            set({loggedUser:null})
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.get("/auth/logout");
            set({ loggedUser: null });
            toast.success(res.data.message || "Logout successfull");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Logout failed. Please try again.", error);
        }
    },

    updateProfile: async (data) => {
        
        try {
        const res = await axiosInstance.put("auth/update-profile", data);
        set({ loggedUser: res.data });
        toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Updating profile failed.", error);
        }
    },

    connectSocket: () => {
        const { loggedUser } = get();
        const socket = io("https://buzzhub-backend-8z53.onrender.com", {
            query: { userId: loggedUser._id }
        });
            
        socket.connect()
        set({ socket: socket })
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
            console.log(userIds);
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}))