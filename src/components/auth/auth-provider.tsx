"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  id: Id<"users">;
  name: string;
  roomId: Id<"rooms">;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("poker-user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch (e) {
    console.error("Failed to parse stored user", e);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark loading as complete after initial render - intentional hydration pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save user to localStorage
    if (user) {
      localStorage.setItem("poker-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("poker-user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};