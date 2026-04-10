"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait for mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full relative"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all text-orange-500 ${
        resolvedTheme === 'dark' 
          ? '-rotate-90 scale-0 opacity-0' 
          : 'rotate-0 scale-100 opacity-100'
      }`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all text-blue-400 ${
        resolvedTheme === 'dark' 
          ? 'rotate-0 scale-100 opacity-100' 
          : 'rotate-90 scale-0 opacity-0'
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

