"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the context type
interface AdminContextType {
  isAdmin: boolean;
}

// Create the context with a default value
const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

// AdminProvider component
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom Hook to use the AdminContext
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
