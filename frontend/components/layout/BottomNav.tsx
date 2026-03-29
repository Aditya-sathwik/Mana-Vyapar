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
import { motion } from "framer-motion"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/merchant/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/merchant/scanner", label: "Scanner", icon: ScanLine },
    { href: "/merchant/inventory", label: "Stocks", icon: Package },
    { href: "/merchant/khata", label: "Khata", icon: Wallet },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden pointer-events-none">
      <nav className="flex items-center justify-around h-16 bg-card/80 backdrop-blur-xl border border-border shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-2 pointer-events-auto max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/merchant/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative",
                isActive
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-1 h-1 w-6 bg-primary rounded-full shadow-[0_0_10px_rgba(5,148,103,1)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={cn(
                "p-1.5 rounded-lg transition-all",
                isActive && "bg-primary/10"
              )}>
                 <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
