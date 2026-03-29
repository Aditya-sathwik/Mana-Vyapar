"use client"

import React, { useState } from "react"
import { Eye, EyeOff, LucideIcon } from "lucide-react"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, type = "text", error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"

    return (
      <div className="space-y-2 w-full group">
        <label
          className="block text-[10px] font-black uppercase tracking-widest ml-1.5 text-muted-foreground transition-colors group-focus-within:text-primary"
        >
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-muted-foreground group-focus-within:text-primary"
            >
              <Icon className="h-5 w-5" />
            </div>
          )}

          <input
            {...props}
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={`
              w-full h-14 rounded-2xl border border-border bg-muted/30 px-4 py-4 text-foreground placeholder:text-muted-foreground/40 
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300
              text-sm font-bold
              ${Icon ? 'pl-12' : 'pl-5'} 
              ${isPassword ? 'pr-12' : 'pr-5'}
              ${className}
            `}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 transition-colors text-muted-foreground hover:text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-[10px] ml-1.5 mt-1.5 font-black uppercase tracking-wider text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"
