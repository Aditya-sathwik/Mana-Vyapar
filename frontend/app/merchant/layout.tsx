"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { MerchantHeader } from "@/components/layout/MerchantHeader"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  // ROUTE PROTECTION: Ensure only logged-in merchants can access this sidebar layout
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login")
    }
  }, [user, loading, router])

  // Show a loading screen while auth state is resolving
  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-12 w-12 text-primary animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Establishing Secure Connection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-body relative overflow-hidden">
      {/* Background Mesh Gradient (Subtle for Merchant) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.15]">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[80px]" />
      </div>

      {/* Desktop Sidebar: Locked height and no scroll */}
      <Sidebar className="hidden md:flex h-screen shrink-0 border-r border-border/50" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-[70] w-72 md:hidden"
            >
              <div className="relative h-full">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute right-[-48px] top-4 h-10 w-10 flex items-center justify-center bg-card text-foreground rounded-xl border border-border shadow-2xl"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="h-full w-full pointer-events-auto shadow-2xl">
                   <Sidebar className="flex w-full" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area: Constrained to screen height */}
      <div className="flex-1 flex flex-col h-screen min-w-0 relative z-10 overflow-hidden">
        <MerchantHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-32 md:pb-12 bg-transparent">
          <div className="max-w-[1700px] mx-auto min-h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
          
          <footer className="mt-20 py-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-12 md:mb-0">
            <p className="text-center md:text-left">© 2026 MANA VYAPAR • MERCHANT HUB V2.4</p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Help & Support</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
          </footer>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
