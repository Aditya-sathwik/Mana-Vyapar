"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Wallet,
  Package,
  ScanLine
} from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/scanner", label: "Scanner", icon: ScanLine },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/khata", label: "Khata", icon: Wallet },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#132a23]/90 backdrop-blur-lg border-t border-slate-200 dark:border-primary/10 md:hidden pb-safe-area-bottom">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-current/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
