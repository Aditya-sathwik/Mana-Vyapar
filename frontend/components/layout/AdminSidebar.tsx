"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  Monitor,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3
} from "lucide-react"

const adminItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/merchants", label: "Merchant Mgmt", icon: Store },
  { href: "/admin/health", label: "Platform Health", icon: Monitor },
  { href: "/admin/support", label: "Support Queue", icon: HelpCircle },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-surface-dark border-r border-border-dark flex-col hidden md:flex z-20 h-screen sticky top-0 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-border-dark">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-white">Mana Vyapar</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {adminItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-500 group-hover:text-primary transition-colors")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border-dark bg-[#162032]">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-700/50 hover:text-white rounded-lg font-medium transition-colors group"
        >
          <Settings className="h-5 w-5 group-hover:text-primary transition-colors" />
          <span>Settings</span>
        </Link>

        <div className="mt-4 flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  )
}
