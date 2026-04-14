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
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/context/auth-context"
import { Modal } from "@/components/ui/modal"

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
          ? "bg-primary/10 text-primary border border-primary/20 dark:shadow-[0_0_15px_-5px_rgba(5,148,103,0.3)] shadow-[0_0_10px_-2px_rgba(5,148,103,0.1)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-pill-admin"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(5,148,103,1)]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <item.icon className={cn(
        "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors"
      )} />

      {!isCollapsed && (
        <span className="text-sm font-bold truncate tracking-tight">{item.label}</span>
      )}

      {isCollapsed && (
        <div className="absolute left-14 bg-foreground text-background text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 border border-border font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
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
      { href: "/admin/api-engine", label: "API Engine", icon: Zap },
      { href: "/admin/infrastructure", label: "Edge Config", icon: Box },
    ]
  }
]

export function AdminSidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isActuallyCollapsed = isCollapsed && !isHovered;

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

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
    <>
      <motion.aside
      initial={false}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isActuallyCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative bg-card/95 backdrop-blur-2xl border-r border-border/50 flex flex-col z-40 h-screen sticky top-0 shadow-2xl overflow-visible group/sidebar",
        className
      )}
    >
      {/* Sidebar Toggle Button - Only show on Desktop */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-10 bg-primary text-white h-8 w-8 rounded-full hidden md:flex items-center justify-center shadow-[0_0_15px_rgba(5,148,103,0.4)] hover:scale-110 transition-all border-2 border-background z-50 group-hover/sidebar:opacity-100 opacity-0 group/toggle"
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />}
      </button>

      {/* Header / Logo */}
      <div className={cn(
        "h-20 flex items-center border-b border-border/50 transition-all duration-300",
        isActuallyCollapsed ? "px-4 justify-center" : "px-6"
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
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background shadow-[0_0_5px_rgba(5,148,103,1)]" />
          </div>
          {!isActuallyCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-foreground font-black text-lg tracking-tighter leading-none uppercase">MANA VYAPAR</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Control Layer</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {!isActuallyCollapsed && (
        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-10 pr-4 text-xs text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6 custom-scrollbar">
        {adminSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isActuallyCollapsed && (
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.3em] mb-3 ml-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-border" />
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isCollapsed={isActuallyCollapsed}
                  isActive={pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className={cn(
        "p-4 mt-auto border-t border-border/50 bg-card/50 backdrop-blur-md",
        isActuallyCollapsed ? "flex flex-col items-center gap-4" : ""
      )}>
        <div className="flex items-center justify-between gap-2 px-1">
          <ThemeToggle />
          {!isActuallyCollapsed && (
            <div className="flex-1 flex items-center gap-3 pl-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-foreground truncate uppercase">{user?.fullname?.split(" ")[0] || "Aditya"}</span>
                <span className="text-[8px] font-bold text-primary uppercase opacity-70">Operator</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group relative border border-transparent hover:border-red-500/10"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!isActuallyCollapsed && <span className="font-bold text-[10px] uppercase tracking-widest">End Session</span>}
        </button>
      </div>

      {/* Subtle background glow */}
      <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-30 dark:opacity-20 transition-opacity" />
    </motion.aside>

    <Modal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={handleLogout}
      title="Terminating Session"
      description="Are you sure you want to end your current session? You will be returned to the kernel login."
      confirmLabel="End Session"
      variant="danger"
      isLoading={isLoggingOut}
    />
  </>
)
}
