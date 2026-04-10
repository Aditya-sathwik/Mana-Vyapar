"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { AdminHeader } from "@/components/layout/AdminHeader"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="bg-background min-h-screen flex text-foreground font-body selection:bg-primary/30 selection:text-primary overflow-hidden relative transition-colors duration-300">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-900/10 dark:bg-emerald-900/20 rounded-full blur-[100px]" />
      </div>
 
      {/* Sidebar - Desktop */}
      <AdminSidebar className="hidden md:flex" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md md:hidden"
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
                  className="absolute right-[-48px] top-4 h-10 w-10 flex items-center justify-center bg-slate-900 text-white rounded-xl border border-slate-800 shadow-2xl"
                >
                  <X className="h-5 w-5" />
                </button>
                <AdminSidebar className="flex w-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
        <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative">
          <div className="max-w-[1700px] mx-auto min-h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
          
          {/* Subtle footer inside main content */}
          <footer className="mt-20 py-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            <p>© 2026 MANA VYAPAR PLATFORM • KERNEL V4.0.2</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">API Status</a>
              <a href="#" className="hover:text-primary transition-colors">Security Audit</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
