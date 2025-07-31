"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAppState } from "./AppStateProvider";

// Define the context type
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_BACKEND_URL;

// Socket Provider Component
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

      // Try to get real user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          newSocket.emit("register", {
            lat: latitude,
            lng: longitude,
            username: user.fullName || "Guest",
            profileUrl: user.profileUrl || "fallback-image-url",
          });

          console.log("📤 Registered with real location:", latitude, longitude);
        },
        (error) => {
          console.warn("⚠️ Location denied or failed, sending dummy location.");

          // Fallback dummy location (e.g., India Gate, Delhi)
          const dummyLat = 28.6129;
          const dummyLng = 77.2295;

          newSocket.emit("register", {
            lat: dummyLat,
            lng: dummyLng,
            username: user.fullName || "Guest",
            profileUrl: user.profileUrl || "fallback-image-url",
          });

          console.log("📤 Registered with dummy location:", dummyLat, dummyLng);
        }
      );
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
