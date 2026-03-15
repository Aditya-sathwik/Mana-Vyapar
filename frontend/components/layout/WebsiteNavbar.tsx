"use client"

import Link from "next/link"
import { Store, Menu } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function WebsiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <Store className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Mana Vyapar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Features</Link>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Pricing</Link>
            <Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Success Stories</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium px-4 py-2 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 dark:text-slate-300 hover:text-primary">
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#09090b] border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="#" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary">Features</Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary">Pricing</Link>
            <Link href="/auth/login" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary">Login</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
