"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, Menu, X, Shield, User, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

import { ThemeToggle } from "@/components/ui/theme-toggle"

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border text-muted-foreground md:hidden shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex flex-col">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Management Hub</p>
          <h1 className="text-2xl font-black text-foreground tracking-tighter capitalize leading-none">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden xl:block group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Universal search..."
            className="h-12 rounded-2xl border border-border bg-muted/30 pl-11 pr-4 text-xs font-bold text-foreground focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 w-80 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:text-primary transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card shadow-lg shadow-primary/40 animate-pulse" />
          </button>
        </div>

        <div className="h-10 w-px bg-border/60 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3 pl-1">
          <div className="hidden lg:flex flex-col items-end text-right">
            <p className="text-xs font-bold text-white leading-none">{user?.fullname || "Aditya Sathwik"}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mt-1">{user?.role === "admin" ? "Operator 01" : user?.role || "System Admin"}</p>
          </div>
          <div className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-center text-slate-400 overflow-hidden">
            {user?.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user.fullname} 
                width={40} 
                height={40} 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
