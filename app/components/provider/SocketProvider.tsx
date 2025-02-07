"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

// Define the context type
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_BACKEND_URL;

// Socket Provider Component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!SOCKET_SERVER_URL) {
      console.error("❌ Missing NEXT_PUBLIC_CHAT_BACKEND_URL in .env file");
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected:", newSocket.id);
      
      // Emit register event after connection
      if (user) {
        newSocket.emit("register", {
          l1: 23,  // Including l1
          l2: 79,  // Including l2
          username: user.fullName || "Guest",
          profileUrl: user.imageUrl || "fallback-image-url",
        });
        console.log("📤 Register event sent");
      }
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

// Custom Hook to Use Socket
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
