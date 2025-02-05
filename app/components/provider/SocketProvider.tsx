"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

// Define the types for the context


interface SocketContextType {
  user: any;
  socket: Socket | null;
  isChat: boolean;
  setIsChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_BACKEND_URL; // Replace with your server's URL

// SocketProvider Component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isChat, setIsChat] = useState<boolean>(true);
  const { user } = useUser();

  // Establish WebSocket connection when the component mounts
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    // Optionally, set user info when the socket connects (for example, from a session or user data)
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.emit("register", {
        l1: 23,
        l2: 79,
        username: user?.fullName || "name not found",
        profileUrl: user?.imageUrl || "fallback-image-url",
      });


    // Cleanup on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [user]);



  return (
    <SocketContext.Provider value={{ user, socket, isChat, setIsChat }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom Hook to use the SocketContext
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
