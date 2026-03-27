"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Wallet,
  Package,
  ScanLine,
  Settings,
  Store,
  HeadphonesIcon,
  Bell,
  AlertTriangle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Search,
  Box,
  Truck,
  TrendingUp,
  User
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const sidebarSections = [
  {
    title: "Business",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/khata", label: "Smart Khata", icon: Wallet },
      { href: "/inventory", label: "Inventory", icon: Package },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { href: "/scanner", label: "AI Product Scan", icon: ScanLine },
      { href: "/analytics", label: "Sales Data", icon: TrendingUp },
    ]
  },
  {
    title: "Operations",
    items: [
      { href: "/notifications", label: "Messages", icon: Bell },
      { href: "/alerts", label: "System Sync", icon: AlertTriangle },
      { href: "/subscription", label: "Billing", icon: CreditCard },
      { href: "/delivery", label: "Orders", icon: Truck },
    ]
  }
]

const NavItem = ({ item, isCollapsed, isActive }: any) => {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20 dark:shadow-[0_0_15px_-5px_rgba(5,148,103,0.3)] shadow-[0_0_10px_-2px_rgba(5,148,103,0.1)]"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-black dark:hover:text-white border border-transparent"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-pill-merchant"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(5,148,103,1)]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <item.icon className={cn(
        "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-primary" : "text-slate-400 group-hover:text-primary transition-colors"
      )} />
      
      {!isCollapsed && (
        <span className="text-sm font-bold truncate tracking-tight">{item.label}</span>
      )}

      {isCollapsed && (
        <div className="absolute left-14 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 border border-slate-700 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
          {item.label}
        </div>
      )}
    </Link>
  )
}

export function Sidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1280) setIsCollapsed(true)
      else if (window.innerWidth >= 1280) setIsCollapsed(false)
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
        "relative bg-white/95 dark:bg-[#09090b]/90 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/50 flex flex-col z-40 h-screen sticky top-0 shadow-2xl overflow-visible group/sidebar",
        className
      )}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-10 bg-slate-900 text-slate-400 h-7 w-7 rounded-full hidden md:flex items-center justify-center shadow-xl hover:text-primary hover:border-primary/50 transition-all border border-slate-700 z-50 group-hover/sidebar:opacity-100 opacity-0"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Header / Logo */}
      <div className={cn(
        "h-20 flex items-center border-b border-slate-200 dark:border-slate-800/50 transition-all duration-300",
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
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-white dark:border-[#09090b] shadow-[0_0_5px_rgba(5,148,103,1)]" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-slate-900 dark:text-white font-black text-lg tracking-tighter leading-none uppercase">MANA VYAPAR</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Merchant Hub</span>
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
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs dark:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6 custom-scrollbar">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-3 ml-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Support Card */}
      {!isCollapsed && (
        <div className="px-4 mb-4">
          <div className="bg-slate-50 dark:bg-primary/10 rounded-2xl p-4 border border-slate-100 dark:border-primary/10 group relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <HeadphonesIcon className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Node Support</span>
                </div>
                <button className="w-full py-2 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">Get AI Assistance</button>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Zap className="h-16 w-16 text-primary fill-primary" />
             </div>
          </div>
        </div>
      )}

      {/* Footer / Settings */}
      <div className={cn(
        "p-4 border-t border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-md",
        isCollapsed ? "flex flex-col items-center gap-4" : ""
      )}>
        <div className="flex items-center justify-between gap-2 px-1">
           <ThemeToggle />
           {!isCollapsed && (
             <Link
              href="/store-settings"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                pathname === "/store-settings" && "text-primary bg-primary/10 border-primary/20"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </Link>
           )}
           {isCollapsed && (
              <Link href="/store-settings" className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <Settings className="h-5 w-5" />
              </Link>
           )}
        </div>

        <button
          className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group relative border border-transparent hover:border-red-500/10"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!isCollapsed && <span className="font-bold text-[10px] uppercase tracking-widest">End Session</span>}
        </button>
      </div>
    </motion.aside>
  )
}
