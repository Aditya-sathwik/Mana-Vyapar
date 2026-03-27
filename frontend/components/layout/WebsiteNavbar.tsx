"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

export function WebsiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  // Transform values triggered AFTER the 3-stage hero (around 3800px-4000px scroll)
  const thresholdStart = 3800
  const thresholdEnd = 4100

  const width = useTransform(scrollY, [thresholdStart, thresholdEnd], ["100%", "92%"])
  const maxWidth = useTransform(scrollY, [thresholdStart, thresholdEnd], ["100%", "1100px"])
  const top = useTransform(scrollY, [thresholdStart, thresholdEnd], ["0px", "24px"])
  const borderRadius = useTransform(scrollY, [thresholdStart, thresholdEnd], ["0px", "100px"])
  const paddingY = useTransform(scrollY, [thresholdStart, thresholdEnd], ["20px", "12px"])
  const shadowOpacity = useTransform(scrollY, [thresholdStart, thresholdEnd], [0, 0.4])
  
  return (
    <>
      <motion.nav
        style={{
          width,
          maxWidth,
          top,
          borderRadius,
          boxShadow: useTransform(scrollY, [thresholdStart, thresholdEnd], ["0 0 0 rgba(0,0,0,0)", "0 20px 50px rgba(0,0,0,0.3)"]),
        }}
        className="fixed left-1/2 -translate-x-1/2 z-[60] bg-white dark:bg-[#000000] transition-all duration-500 overflow-hidden border-b lg:border-b-0 border-slate-100 dark:border-slate-800"
      >
        {/* Pill Border - Only appears when scrolled */}
        <motion.div 
          style={{ opacity: useTransform(scrollY, [thresholdStart, thresholdEnd], [0, 1]) }}
          className="absolute inset-0 border border-slate-200 dark:border-white/10 rounded-[inherit] pointer-events-none"
        />

        <motion.div 
          style={{ paddingTop: paddingY, paddingBottom: paddingY }}
          className="px-6 lg:px-10 relative z-10"
        >
          <div className="flex justify-between items-center">
            {/* Logo Wrapper */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 lg:gap-4 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-10 h-10 lg:w-12 lg:h-12 relative overflow-hidden"
              >
                <Image 
                  src="/images/logo.png"
                  alt="Mana Vyapar Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <span className="font-display font-black text-lg lg:text-2xl tracking-tighter uppercase text-slate-900 dark:text-white">
                Mana <span className="text-primary italic">Vyapar</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {["Features", "Pricing", "Security", "About"].map((item) => (
                <Link
                  key={item}
                  href={item === "Pricing" ? "/pricing" : "#"}
                  className="px-5 py-2 group/nav"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 group-hover/nav:text-primary transition-all duration-300">
                    {item}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <ThemeToggle />
              <Link href="/auth/login" className="group/login">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-primary transition-colors">
                  Login
                </span>
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary text-white h-11 lg:h-12 px-6 lg:px-8 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                <span>Free Trial</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-[#09090b] border-t border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-6 py-10 space-y-8">
                {["Features", "Pricing", "Security", "About"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Pricing" ? "/pricing" : "#"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-6 flex flex-col gap-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-4 text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-primary text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest text-center shadow-xl shadow-primary/20"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Background variable injector */}
      <style jsx global>{`
        :root {
          --nav-bg: 255, 255, 255;
        }
        .dark {
          --nav-bg: 9, 9, 11;
        }
      `}</style>
    </>
  )
}
