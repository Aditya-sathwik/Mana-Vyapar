"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Wallet,
  Package,
  ScanLine,
  Settings,
  Store,
  HeadphonesIcon
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/khata", label: "My Khata", icon: Wallet },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/scanner", label: "AI Scanner", icon: ScanLine },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-[#132a23] border-r border-primary/10 flex-col hidden md:flex z-20 h-screen sticky top-0">
      <div className="h-16 flex items-center justify-between px-6 border-b border-primary/10">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Store className="h-6 w-6" />
          <span>Mana Vyapar</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center justify-between mb-2">
           <ThemeToggle />
           <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary rounded-lg font-medium transition-colors text-sm"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>

        <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90">Need Help?</p>
            <p className="text-xs opacity-75 mt-1">Contact our support team 24/7</p>
            <button className="mt-3 text-xs bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg">
              Chat Now
            </button>
          </div>
          <HeadphonesIcon className="absolute -bottom-4 -right-4 h-16 w-16 opacity-20" />
        </div>
      </div>
    </aside>
  )
}
