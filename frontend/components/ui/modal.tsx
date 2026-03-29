"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, Info, CheckCircle2 } from "lucide-react"
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
    danger: <AlertTriangle className="h-6 w-6" />,
    info: <Info className="h-6 w-6" />,
    success: <CheckCircle2 className="h-6 w-6" />,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
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
              "modal-container",
              sizeClasses[size]
            )}
          >
            {/* Header / Title Section */}
            <div className="modal-header">
              <div className="flex items-center gap-4">
                <div className={cn("modal-icon-wrapper", variant === "danger" && "danger")}>
                  {variantIcons[variant]}
                </div>
                <div>
                    <h3 className="modal-title">{title}</h3>
                    {description && <p className="modal-description">{description}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content */}
            {children && (
              <div className="modal-body">
                {children}
              </div>
            )}

            {/* Footer / Actions */}
            <div className="modal-footer">
              {footer ? (
                footer
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="modal-btn-cancel"
                  >
                    Cancel
                  </button>
                  {onConfirm && (
                    <button
                      onClick={onConfirm}
                      disabled={isLoading}
                      className={cn(
                        "modal-btn-confirm",
                        variant === "danger" && "danger"
                      )}
                    >
                      {isLoading ? "Processing..." : confirmLabel}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Decorative background glow */}
            <div className={cn("modal-glow", variant === "danger" ? "bg-destructive" : "bg-primary")} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
