"use client"

import { Search, Bell, Menu, User, Store } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MerchantHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800/50 bg-white/80 dark:bg-[#09090b]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex flex-col">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Merchant Workspace</p>
          <h1 className="text-xl font-bold dark:text-white text-slate-900 capitalize">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search in store..."
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 text-xs dark:text-slate-300 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 w-64 transition-all"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(5,148,103,1)]" />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        <div className="flex items-center gap-3 pl-1">
          <div className="hidden lg:flex flex-col items-end text-right">
            <p className="text-xs font-bold dark:text-white text-slate-900 leading-none">Vamshi Electronics</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mt-1">Premium Dealer</p>
          </div>
          <div className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 overflow-hidden">
             <Store className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  )
}
