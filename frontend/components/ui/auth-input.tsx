"use client"

import React, { useState } from "react"
import { Eye, EyeOff, LucideIcon } from "lucide-react"
import { COLORS } from "@/lib/colors"

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
      <div className="space-y-3.5 w-full group">
        <label 
          className="block text-sm font-semibold tracking-wide ml-1.5 transition-colors"
          style={{ 
            color: COLORS.text.muted,
          }}
        >
          {label}
        </label>
        
        <div className="relative">
          {Icon && (
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: COLORS.slate[500] }}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
          
          <input
            {...props}
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={`
              w-full rounded-2xl border bg-transparent px-4 py-4 text-white placeholder:text-slate-600 
              focus:outline-none focus:ring-2 transition-all duration-300
              ${Icon ? 'pl-12' : 'pl-5'} 
              ${isPassword ? 'pr-12' : 'pr-5'}
              ${className}
            `}
            style={{ 
              backgroundColor: COLORS.background.dark, 
              borderColor: COLORS.border.dark,
              // Focus state handled by CSS or dynamic theme
            }}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 transition-colors"
              style={{ color: COLORS.slate[500] }}
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
          <p className="text-xs ml-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1 font-medium" style={{ color: COLORS.error }}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"
