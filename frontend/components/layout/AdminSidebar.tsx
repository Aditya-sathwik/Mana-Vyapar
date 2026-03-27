"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Store,
  Monitor,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  Terminal,
  Activity,
  Layers,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Shield,
  Zap,
  Box,
  LayoutDashboard
} from "lucide-react"

interface NavItemProps {
  item: any
  isCollapsed: boolean
  isActive: boolean
}

const NavItem = ({ item, isCollapsed, isActive }: NavItemProps) => {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_rgba(5,148,103,0.3)]"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(5,148,103,1)]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <item.icon className={cn(
        "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-primary" : "text-slate-400 group-hover:text-white"
      )} />
      
      {!isCollapsed && (
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}

      {isCollapsed && (
        <div className="absolute left-14 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 border border-slate-700 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
          {item.label}
        </div>
      )}
    </Link>
  )
}

const adminSections = [
  {
    title: "Intelligence",
    items: [
      { href: "/admin/command-center", label: "Command Center", icon: Monitor },
      { href: "/admin/dashboard", label: "Platform Health", icon: Activity },
    ]
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/merchants", label: "Merchants", icon: Store },
      { href: "/admin/analytics", label: "Performance", icon: BarChart3 },
      { href: "/admin/analytics/detailed", label: "Data Layers", icon: Layers },
    ]
  },
  {
    title: "System",
    items: [
      { href: "/admin/support", label: "Support Queue", icon: HelpCircle },
      { href: "/admin/system-alerts", label: "Kernel Logs", icon: Terminal },
      { href: "/admin/infrastructure", label: "Edge Config", icon: Box },
    ]
  }
]

export function AdminSidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Handle client-side responsiveness for initial state
  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on smaller screens, but only if not mobile (which uses its own overlay)
      if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        setIsCollapsed(true)
      } else if (window.innerWidth >= 1280) {
        setIsCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative bg-[#09090b]/90 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col z-40 h-screen sticky top-0 shadow-2xl overflow-visible group/sidebar",
        className
      )}
    >
      {/* Sidebar Toggle Button - Only show on Desktop */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-10 bg-slate-900 text-slate-400 h-7 w-7 rounded-full hidden md:flex items-center justify-center shadow-xl hover:text-primary hover:border-primary/50 transition-all border border-slate-700 z-50 group-hover/sidebar:opacity-100 opacity-0"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Header / Logo */}
      <div className={cn(
        "h-20 flex items-center border-b border-slate-800/50 transition-all duration-300",
        isCollapsed ? "px-4 justify-center" : "px-6"
      )}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-tr from-primary/20 to-emerald-400/20 rounded-xl flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_20px_rgba(5,148,103,0.3)] overflow-hidden">
              <Image 
                src="/images/logo.png"
                alt="Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-[#09090b] shadow-[0_0_5px_rgba(5,148,103,1)]" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-white font-black text-lg tracking-tighter leading-none uppercase italic">MANA VYAPAR</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Control Layer</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="System search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6 custom-scrollbar">
        {adminSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-3 ml-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-800" />
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className={cn(
        "p-4 mt-auto border-t border-slate-800/50 bg-[#09090b]/50 backdrop-blur-md",
        isCollapsed ? "flex flex-col items-center gap-4" : ""
      )}>
        {!isCollapsed ? (
          <div className="flex flex-col gap-3">
             <Link
              href="/admin/profile"
              className="flex items-center gap-3 p-2 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 transition-all group"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                  <User className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-primary rounded-full border-2 border-[#09090b] flex items-center justify-center">
                  <Zap className="h-2 w-2 text-black" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Aditya Sathwik</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-wider">Super Operator</p>
              </div>
              <Settings className="h-4 w-4 text-slate-500 hover:text-white transition-colors" />
            </Link>
            
            <button
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20 group text-xs font-bold uppercase tracking-wider"
            >
              <span>Terminate Session</span>
              <LogOut className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
             <Link
              href="/admin/profile"
              className="relative h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group pointer-events-auto"
            >
              <User className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
               <div className="absolute left-14 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 border border-slate-700 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
                My Profile
              </div>
            </Link>
            <button className="h-10 w-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 group relative">
              <LogOut className="h-5 w-5" />
              <div className="absolute left-14 bg-red-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 border border-red-700 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
                Logout
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Glossy Overlay effect for active states */}
      <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-30" />
    </motion.aside>
  )
}
