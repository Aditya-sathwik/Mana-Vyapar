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

  // Layout transforms
  const top = useTransform(scrollY, [thresholdStart, thresholdEnd], ["0px", "16px"])
  const borderRadius = useTransform(scrollY, [thresholdStart, thresholdEnd], ["0px", "16px"])
  const paddingY = useTransform(scrollY, [thresholdStart, thresholdEnd], ["24px", "14px"])
  
  // Background transforms
  const bgOpacity = useTransform(scrollY, [thresholdStart, thresholdEnd], [0, 1])
  const backgroundColor = useTransform(bgOpacity, (v) => `rgba(var(--nav-bg), ${v})`)
  const backdropFilter = useTransform(bgOpacity, (v) => `blur(${v * 16}px)`)
  const shadow = useTransform(scrollY, [thresholdStart, thresholdEnd], ["0 0 0 rgba(0,0,0,0)", "0 10px 40px rgba(0,0,0,0.2)"])
  
  // Text color transforms (White to theme-aware var)
  const navTextColor = useTransform(
    scrollY, 
    [thresholdStart, thresholdEnd], 
    ["rgba(255, 255, 255, 1)", "rgba(var(--nav-fg), 1)"]
  )
  const navLinkColor = useTransform(
    scrollY, 
    [thresholdStart, thresholdEnd], 
    ["rgba(255, 255, 255, 0.7)", "rgba(var(--nav-fg), 0.6)"]
  )

  return (
    <>
      <motion.nav
        style={{
          width: "calc(100% - 48px)",
          maxWidth: "1400px",
          top,
          borderRadius,
          backgroundColor,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          boxShadow: shadow,
          color: navTextColor,
        }}
        className="fixed left-6 z-[60] overflow-hidden border-b lg:border-b-0 border-slate-100/10 dark:border-white/5 transition-all duration-700"
      >
        <motion.div
          style={{ paddingTop: paddingY, paddingBottom: paddingY }}
          className="px-6 lg:px-12 relative z-10"
        >
          <div className="flex justify-between items-center w-full">
            {/* Logo Wrapper */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-4 group">
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
              <motion.span 
                style={{ color: navTextColor }}
                className="font-display font-black text-xl lg:text-3xl tracking-tighter uppercase whitespace-nowrap drop-shadow-sm"
              >
                Mana <span className="text-primary italic">Vyapar</span>
              </motion.span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {["Features", "Pricing", "Security", "About"].map((item) => (
                <Link
                  key={item}
                  href={item === "Pricing" ? "/pricing" : "#"}
                  className="px-6 py-2 group/nav"
                >
                  <motion.span 
                    style={{ color: navLinkColor }}
                    whileHover={{ color: "rgba(var(--primary-rgb), 1)" }}
                    className="text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 pointer-events-auto"
                  >
                    {item}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-6">
              <ThemeToggle />
              <Link href="/auth/login" className="group/login">
                <motion.span 
                  style={{ color: navTextColor }}
                  whileHover={{ color: "rgba(var(--primary-rgb), 1)" }}
                  className="text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Login
                </motion.span>
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary text-white h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <span>Free Trial</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <motion.button
                style={{ color: navTextColor }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </motion.button>
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
              className="md:hidden bg-white dark:bg-[#09090b] border-t border-slate-100 dark:border-white/5 overflow-hidden"
            >
              <div className="px-8 py-12 space-y-8">
                {["Features", "Pricing", "Security", "About"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Pricing" ? "/pricing" : "#"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-8 flex flex-col gap-6">
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
                    className="w-full bg-primary text-white py-6 rounded-2xl text-sm font-black uppercase tracking-widest text-center shadow-2xl shadow-primary/30"
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
          --nav-fg: 15, 23, 42;
          --primary-rgb: 0, 168, 107;
        }
        .dark {
          --nav-bg: 9, 9, 11;
          --nav-fg: 255, 255, 255;
        }
      `}</style>
    </>
  )
}
