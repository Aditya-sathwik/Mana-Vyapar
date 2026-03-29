"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, Menu, X, Shield, User, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-[#09090b]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex flex-col">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Management Layer</p>
          <h1 className="text-xl font-bold text-white capitalize">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search platform..."
            className="h-10 rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-xs text-slate-300 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 w-64 transition-all"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(5,148,103,1)]" />
        </button>

        <div className="h-8 w-px bg-slate-800 mx-1" />

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
