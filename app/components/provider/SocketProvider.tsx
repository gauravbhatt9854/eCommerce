"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

// Define types for the context
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_BACKEND_URL;

let socketInstance: Socket | null = null;

// Custom Hook for WebSocket Connection
const useSocketConnection = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
      console.log("🔗 WebSocket Connected:", socketInstance.id);
    }

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance?.id);
    });

    if (user) {
      socketInstance.emit("register", {
        l1: 23,
        l2: 79,
        username: user.fullName || "Guest",
        profileUrl: user.imageUrl || "fallback-image-url",
        
      });
    }

    return () => {
      if (socketInstance && socketInstance.connected) {
        socketInstance.disconnect();
        console.log("❌ WebSocket Disconnected");
        socketInstance = null;
      }
    };
  }, [user]);

  return socketRef.current;
};

// SocketProvider Component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = useSocketConnection();

  // Memoized value to prevent re-renders
  const contextValue = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

// Custom Hook to Use WebSocket
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
