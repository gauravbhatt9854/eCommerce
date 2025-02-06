"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

// Define types for the context and user
interface User {
  fullName: string;
  imageUrl: string;
}

interface SocketContextType {
  user: User | null;
  socket: Socket | null;
  isChat: boolean;
  isSupport: boolean;
  setIsChat: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSupport: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextType | null>(null);
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_BACKEND_URL;

let socketInstance: Socket | null = null;

// Custom Hook for Socket Connection
const useSocketConnection = (user: User | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
      console.log("Socket connection established:", socketInstance.id);
    }

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance?.id);
    });

    if (user) {
      socketInstance.emit("register", {
        l1: 23,
        l2: 79,
        username: user.fullName || "name not found",
        profileUrl: user.imageUrl || "fallback-image-url",
      });
    }

    return () => {
      if (socketInstance && socketInstance.connected) {
        socketInstance.disconnect();
        console.log("Socket disconnected");
        socketInstance = null;
      }
    };
  }, [user]);

  return socketRef.current;
};

// SocketProvider Component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChat, setIsChat] = useState<boolean>(true);
  const [isSupport, setIsSupport] = useState<boolean>(true);
  const { user } = useUser();
  const socket = useSocketConnection(user);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      socket,
      isChat,
      setIsChat,
      isSupport,
      setIsSupport,
    }),
    [user, socket, isChat, isSupport]
  );

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

// Custom Hook to use SocketContext
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
