"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAppState } from "./AppStateProvider";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_BACKEND_URL;

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAppState();

  useEffect(() => {
    if (!SOCKET_SERVER_URL) {
      console.error("❌ Missing NEXT_PUBLIC_CHAT_BACKEND_URL in .env file");
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected");
    });

    newSocket.on("requestRegistration", () => {
      console.log("📩 Server requested registration");

      if (!user) {
        console.warn("⚠️ Cannot register without user info");
        return;
      }

      // Send dummy location (0,0)
      newSocket.emit("register", {
        lat: 0,
        lng: 0,
        username: user.fullName || "Guest",
        profileUrl: user.profileUrl || "fallback-image-url",
      });

      console.log("📤 Registered with dummy location: 0,0");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};