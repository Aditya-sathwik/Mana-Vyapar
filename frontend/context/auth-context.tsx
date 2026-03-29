"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import storage from "@/lib/storage";

interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  businessName?: string;
}

interface LoginCredentials {
  identifier: string;
  password?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    // 1. Initial hydration from local storage (Fast recovery)
    const savedUser = storage.getUser();
    const token = storage.getAccessToken();

    if (savedUser) {
      setUser(savedUser);
    }

    // 2. Refresh state from server to ensure data is current (UserDetails API)
    // We only call this if we previously had a token or user in storage
    if (token) {
      try {
        const response = await apiFetch("/users/current-user");
        if (response.success && response.data) {
          // If response.data is directly the user or inside property
          const userData = response.data.user || response.data;
          setUser(userData);
          storage.setUser(userData);
        } else {
          // Clear if current-user check fails (session ended/invalid)
          storage.clearAuth();
          setUser(null);
        }
      } catch (err) {
        // If the API call fails, we rely on the storage until the user manually logs out 
        // OR we clear it if the error is 401/403
        console.error("Session refresh failed:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { identifier, password } = credentials;

    // Hardcoded Admin Logic
    if (identifier === "admin" && password === "admin123") {
      const adminUser: User = {
        _id: "admin_001",
        fullname: "Super Admin",
        username: "admin",
        email: "admin@manavyapar.com",
        role: "admin",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5QGtyS46ffXJmtiUOY-Mq-cEmOc7FePMAok4tf6sm3G4X7oW97TivKVxOLQ0NsUlEoQN7-oYfr5cpdKMJrOd6mD19rgvD6Z1yTasNnlhUUAu47Jw6vXSJ40yql6yHWPvUFNA3qE9kwyQA0B_TOvtUhEgBDXKwxCi9bsIJMP5rRhX15jNJr35xjlrXSycBVedLuDD4lJ0Swodp1ogo0-Sbnysa4H65Ujorz0BV-0X3HiLMw-Kf_TMQjxRGw9xjO1WkdjtItytNu-A"
      };
      setUser(adminUser);
      storage.setUser(adminUser);
      toast.success("Welcome back, Super Admin!");
      router.push("/admin/dashboard");
      return;
    }

    // Attempt real login for merchants
    try {
      const response = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ 
          email: identifier, 
          username: identifier, 
          phone: identifier, 
          password 
        }),
      });

      if (response.success) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        setUser(userData);
        storage.setUser(userData);
        storage.setTokens(accessToken, refreshToken);
        
        toast.success(`Welcome back, ${userData.fullname}!`);
        
        // Dynamic Redirect Logic based on role
        if (userData.role === "Merchant") {
          router.push("/merchant/dashboard");
        } else if (userData.role === "Super Admin" || userData.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/store");
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await apiFetch("/users/register", {
        method: "POST",
        body: formData,
        isMultipart: true,
      });

      if (response.success) {
        if (response.data?.accessToken) {
          const { user: userData, accessToken, refreshToken } = response.data;
          setUser(userData);
          storage.setUser(userData);
          storage.setTokens(accessToken, refreshToken);
          toast.success("Account created successfully!");
          
          if (userData.role === "Merchant") {
            router.push("/merchant/dashboard");
          } else {
            router.push("/store");
          }
        } else {
          toast.success("Registration complete! Please log in.");
          router.push("/auth/login?registered=true");
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/users/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      storage.clearAuth();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
