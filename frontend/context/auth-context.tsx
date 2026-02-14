"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
}

interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    // Check if we have a "fake" session in localStorage for this demo
    const storedUser = localStorage.getItem("mana_vyapar_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/users/current-user");
      if (response.success) {
        setUser(response.data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Hardcoded Admin Logic
    if ((credentials.email === "admin" || credentials.username === "admin") && credentials.password === "admin123") {
      const adminUser: User = {
        _id: "admin_001",
        fullname: "Super Admin",
        username: "admin",
        email: "admin@manavyapar.com",
        role: "admin",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5QGtyS46ffXJmtiUOY-Mq-cEmOc7FePMAok4tf6sm3G4X7oW97TivKVxOLQ0NsUlEoQN7-oYfr5cpdKMJrOd6mD19rgvD6Z1yTasNnlhUUAu47Jw6vXSJ40yql6yHWPvUFNA3qE9kwyQA0B_TOvtUhEgBDXKwxCi9bsIJMP5rRhX15jNJr35xjlrXSycBVedLuDD4lJ0Swodp1ogo0-Sbnysa4H65Ujorz0BV-0X3HiLMw-Kf_TMQjxRGw9xjO1WkdjtItytNu-A"
      };
      setUser(adminUser);
      localStorage.setItem("mana_vyapar_user", JSON.stringify(adminUser));
      router.push("/admin/dashboard");
      return;
    }

    // Attempt real login for merchants
    try {
        const response = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        });

        if (response.success) {
        setUser(response.data.user);
        localStorage.setItem("mana_vyapar_user", JSON.stringify(response.data.user));
        router.push("/dashboard");
        }
    } catch {
        // Fallback for demo: if API fails, log them in as a demo merchant
        const demoUser: User = {
            _id: "merchant_001",
            fullname: "Rajesh Kumar",
            username: "rajesh_shop",
            email: credentials.email || "rajesh@example.com",
            role: "merchant",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtNBxEoxDkJh3EIMpjGazj9jp4wUw9hw5vx9yu4RHiUCd88TMS2ekRb-lNcv632IuBbCby3TqAvZ6Rs1Y-sHJHCiD3cHFSQew1Z9wKQE--E6RfcAHC8BfLhoUg-EDe7WZ3Dtf8_cNWDjKuvy7eSVKvqjsvj2ETcIIwp0GGxKvbkGclqOO9jqmnzmJ4a0VbBxFT_LYnybEtXXiX2xoL01AuQzBN6qIUOV63QXNDe41SgDiu8nkGMpjw_OXX81ajiNaz6W_uoh7250I"
        };
        setUser(demoUser);
        localStorage.setItem("mana_vyapar_user", JSON.stringify(demoUser));
        router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/users/logout", { method: "POST" });
    } catch {
        // ignore error
    } finally {
      localStorage.removeItem("mana_vyapar_user");
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
