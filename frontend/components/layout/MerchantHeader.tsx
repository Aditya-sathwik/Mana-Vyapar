"use client"

import { Search, Bell, Menu, User, Store } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function MerchantHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"
  
  const getSearchConfig = () => {
    if (pathname.includes("/merchant/khata")) return { placeholder: "Search ledger records...", path: "/merchant/khata" }
    if (pathname.includes("/merchant/delivery")) return { placeholder: "Search orders / customers...", path: "/merchant/delivery" }
    if (pathname.includes("/merchant/inventory")) return { placeholder: "Search products in store...", path: "/merchant/inventory" }
    if (pathname.includes("/merchant/categories")) return { placeholder: "Search categories...", path: "/merchant/categories" }
    if (pathname.includes("/merchant/insights")) return { placeholder: "Search intelligence...", path: "/merchant/insights" }
    return { placeholder: "Search anything...", path: pathname }
  }

  const { placeholder, path } = getSearchConfig()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`${path}?search=${encodeURIComponent(search.trim())}`)
    setSearch("")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-card/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex flex-col">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Merchant Workspace</p>
          <h1 className="text-xl font-bold text-foreground capitalize">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-xs text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 w-64 transition-all"
          />
        </form>

        <Link 
          href="/merchant/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(5,148,103,1)]" />
        </Link>

        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-3 pl-1">
          <div className="hidden lg:flex flex-col items-end text-right">
            <p className="text-xs font-bold text-foreground leading-none">{user?.businessName || user?.fullname || "Vamshi Electronics"}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mt-1">{user?.role === "Merchant" ? "Premium Dealer" : user?.role || "Merchant Hub"}</p>
          </div>
          <div className="h-10 w-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground overflow-hidden">
             {user?.avatar ? (
               <Image 
                 src={user.avatar} 
                 alt={user.fullname} 
                 width={40} 
                 height={40} 
                 className="h-full w-full object-cover"
               />
             ) : (
               <Store className="h-5 w-5 text-primary" />
             )}
          </div>
        </div>
      </div>
    </header>
  )
}
