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
  User,
  Tag,
  FileText
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/context/auth-context"
import { Modal } from "@/components/ui/modal"

const sidebarSections = [
  {
    title: "Business",
    items: [
      { href: "/merchant/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/merchant/khata", label: "Smart Khata", icon: Wallet },
      { href: "/merchant/categories", label: "Categories", icon: Box },
      { href: "/merchant/coupons", label: "Promotions", icon: Tag },
      { href: "/merchant/website", label: "Website Control", icon: Store },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { href: "/merchant/scanner", label: "AI Product Scan", icon: ScanLine },
      { href: "/merchant/insights", label: "Advanced Insights", icon: TrendingUp },
      { href: "/merchant/forms/list", label: "Customer Forms", icon: FileText },
    ]
  },
  {
    title: "Operations",
    items: [
      { href: "/merchant/notifications", label: "Messages", icon: Bell },
      { href: "/merchant/support", label: "Merchant Support", icon: HeadphonesIcon },
      { href: "/merchant/alerts", label: "System Sync", icon: AlertTriangle },
      { href: "/merchant/subscription", label: "Billing", icon: CreditCard },
      { href: "/merchant/delivery", label: "Orders", icon: Truck },
      { href: "/merchant/settings/policies", label: "Store Policies", icon: FileText },
    ]
  }
]

const NavItem = ({ item, isCollapsed, isActive, onSelect }: any) => {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20 dark:shadow-[0_0_15px_-5px_rgba(5,148,103,0.3)] shadow-[0_0_10px_-2px_rgba(5,148,103,0.1)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
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

export function Sidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActuallyCollapsed = isCollapsed && !isHovered;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1280) setIsCollapsed(true)
      else if (window.innerWidth >= 1280) setIsCollapsed(false)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = async () => {
    setIsLogoutModalOpen(false)
    await logout()
  }

  const filteredSections = sidebarSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

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
  {/* Sidebar Toggle Button */}
  <button
    onClick={() => setIsCollapsed(!isCollapsed)}
    className="absolute -right-4 top-10 bg-primary text-white h-8 w-8 rounded-full hidden md:flex items-center justify-center shadow-[0_0_15px_rgba(5,148,103,0.4)] hover:scale-110 transition-all border-2 border-background z-50 group-hover/sidebar:opacity-100 opacity-0 group/toggle"
  >
    {isCollapsed ? <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform text-white" /> : <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform text-white" />}
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
            <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Merchant Hub</span>
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
    {filteredSections.length > 0 ? (
      filteredSections.map((section) => (
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
                isActive={pathname === item.href || (item.href !== "/merchant/dashboard" && pathname.startsWith(item.href))}
                onSelect={() => {
                  setIsHovered(false);
                  setSearchQuery(""); // Clear search on navigation
                }}
              />
            ))}
          </div>
        </div>
      ))
    ) : (
      <div className="py-10 text-center space-y-2">
        <AlertTriangle className="h-8 w-8 text-muted-foreground/30 mx-auto" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Feature No Found</p>
      </div>
    )}
  </nav>

  {/* Support Card */}
  {!isActuallyCollapsed && (
    <div className="px-4 mb-4">
      <div className="bg-muted/50 dark:bg-primary/10 rounded-2xl p-4 border border-border dark:border-primary/10 group relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <HeadphonesIcon className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase text-muted-foreground">Shop Support</span>
            </div>
            <Link href="/merchant/assistance">
                <button className="w-full py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">Get Assistance</button>
            </Link>
          </div>
         <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
            <Zap className="h-16 w-16 text-primary fill-primary" />
         </div>
      </div>
    </div>
  )}

  {/* Footer / Settings */}
  <div className={cn(
    "p-4 border-t border-border/50 bg-card/50 backdrop-blur-md",
    isActuallyCollapsed ? "flex flex-col items-center gap-4" : ""
  )}>
    <div className="flex items-center justify-between gap-2 px-1">
       <ThemeToggle />
        {!isActuallyCollapsed && (
         <Link
          href="/merchant/store-settings"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest border border-transparent hover:border-border",
            pathname === "/merchant/store-settings" && "text-primary bg-primary/10 border-primary/20"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </Link>
       )}
       {isActuallyCollapsed && (
          <Link href="/merchant/store-settings" className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary transition-colors">
              <Settings className="h-5 w-5" />
          </Link>
       )}
    </div>

    <button
      onClick={() => setIsLogoutModalOpen(true)}
      className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group relative border border-transparent hover:border-red-500/10"
    >
      <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
      {!isActuallyCollapsed && <span className="font-bold text-[10px] uppercase tracking-widest">End Session</span>}
    </button>
  </div>
</motion.aside>

      {/* Reusable Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="End Session?"
        description="Are you sure you want to log out of your merchant dashboard? All unsaved digital ledger entries may be lost."
        confirmLabel="Logout Now"
        onConfirm={handleLogout}
        variant="danger"
        size="sm"
      />
    </>
  )
}
