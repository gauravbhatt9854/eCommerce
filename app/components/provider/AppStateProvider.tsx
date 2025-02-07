"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface AppStateContextType {
  user: any;
  isChat: boolean;
  isSupport: boolean;
  isAdmin: boolean;
  setIsChat: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSupport: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context
const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChat, setIsChat] = useState<boolean>(false);
  const [isSupport, setIsSupport] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { user } = useUser();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/services/checkadmin", { method: "POST" });
        const data = await res.json();
        setIsAdmin(data.isAdmin || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdmin();
  }, []);

  return (
    <AppStateContext.Provider value={{ user, isChat, setIsChat, isSupport, setIsSupport, isAdmin }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom Hook to use AppStateContext
export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
