"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, Info, CheckCircle2 } from "lucide-react"
import { COLORS } from "@/lib/colors"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  variant?: "danger" | "info" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  confirmLabel = "Confirm",
  onConfirm,
  variant = "info",
  size = "md",
  isLoading = false
}: ModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  const variantIcons = {
    danger: <AlertTriangle className="h-6 w-6 text-red-500" />,
    info: <Info className="h-6 w-6 text-emerald-500" />,
    success: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full overflow-hidden rounded-3xl border shadow-2xl relative z-10",
              sizeClasses[size]
            )}
            style={{ 
              backgroundColor: COLORS.slate[900], 
              borderColor: COLORS.slate[800] 
            }}
          >
            {/* Header / Title Section */}
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl" style={{ backgroundColor: `${variant === 'danger' ? '#ef4444' : COLORS.primary.vibrant}15` }}>
                    {variantIcons[variant]}
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {description && (
                <p className="text-sm font-medium leading-relaxed pl-1" style={{ color: COLORS.text.secondary }}>
                  {description}
                </p>
              )}
            </div>

            {/* Main Content */}
            {children && (
              <div className="px-6 py-4">
                {children}
              </div>
            )}

            {/* Footer / Actions */}
            <div className="p-6 pt-2 flex items-center justify-end gap-3">
              {footer ? (
                footer
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all hover:bg-white/5 border border-transparent hover:border-slate-800"
                    style={{ color: COLORS.text.secondary }}
                  >
                    Cancel
                  </button>
                  {onConfirm && (
                    <button
                      onClick={onConfirm}
                      disabled={isLoading}
                      className={cn(
                        "px-6 py-2.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50",
                        variant === "danger" 
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                      )}
                      style={{ 
                        backgroundColor: variant === "danger" ? "#ef4444" : COLORS.primary.vibrant 
                      }}
                    >
                      {isLoading ? "Processing..." : confirmLabel}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Decorative background glow */}
            <div 
              className="absolute -right-24 -bottom-24 h-48 w-48 blur-[100px] rounded-full opacity-10 pointer-events-none" 
              style={{ backgroundColor: variant === 'danger' ? '#ef4444' : COLORS.primary.vibrant }} 
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
