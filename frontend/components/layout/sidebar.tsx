"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  History, 
  Settings, 
  LogOut,
  Store,
  ChevronRight,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "next-themes"
import { 
  Languages, 
  Sun, 
  Moon 
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const isAdmin = user?.role === "Super Admin"

  const sidebarItems = [
    { icon: LayoutDashboard, label: t('overview'), href: "/dashboard" },
    { icon: Package, label: t('inventory'), href: "/inventory" },
    { icon: Users, label: t('khata'), href: "/khata" },
    { icon: History, label: t('transactions'), href: "/history" },
    { icon: Settings, label: t('settings'), href: "/settings" },
  ]

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-6 top-6 bottom-6 z-50 flex flex-col rounded-[32px] transition-all duration-500",
        "bg-card border border-border shadow-xl backdrop-blur-2xl",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-4 px-6 py-10 text-foreground">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
          <Store className="h-6 w-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight">
              Mana Vyapar
            </span>
            {isAdmin && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold w-fit">
                {t('master_admin')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2 px-4 font-body">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className={cn("h-6 w-6 shrink-0 transition-transform group-hover:scale-110")} />
                {!isCollapsed && (
                  <span className="font-semibold">{item.label}</span>
                )}
              </div>
            </Link>
          )
        })}

        {/* Master Control Link */}
        {isAdmin && (
          <Link href="/admin/master-control">
            <div className={cn(
              "group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 mt-6 transition-all duration-300 cursor-pointer",
              pathname === "/admin/master-control"
                ? "bg-amber-500/10 text-amber-500" 
                : "text-amber-500/60 hover:bg-amber-500/5 hover:text-amber-500"
            )}>
              <ShieldCheck className="h-6 w-6 shrink-0" />
              {!isCollapsed && <span className="font-bold tracking-tight">Master Panel</span>}
            </div>
          </Link>
        )}
      </nav>

      {/* Bottom Controls */}
      <div className="p-4 space-y-2 border-t border-border">
        {/* Theme Toggle */}
        <div className="flex items-center gap-2 p-1 bg-muted rounded-2xl overflow-hidden">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex-1 flex items-center justify-center p-2 rounded-xl transition-all",
              theme === "light" ? "bg-background shadow-sm text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex-1 flex items-center justify-center p-2 rounded-xl transition-all",
              theme === "dark" ? "bg-background shadow-sm text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "en" ? "te" : "en")}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Languages className="h-5 w-5" />
          {!isCollapsed && (
            <span className="font-semibold text-sm flex-1 text-left">
              {language === "en" ? "Telugu (తెలుగు)" : "English"}
            </span>
          )}
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronRight className={cn("h-5 w-5 transition-transform duration-500", isCollapsed ? "" : "rotate-180")} />
          {!isCollapsed && <span className="font-semibold text-sm">{isCollapsed ? "" : "Collapse"}</span>}
        </button>
        
        <button className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95">
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-bold text-sm">{t('logout')}</span>}
        </button>
      </div>
    </motion.aside>
  )
}
