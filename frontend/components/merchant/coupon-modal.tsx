"use client"

import { useState, useEffect } from "react"
import { 
  Tag, 
  Percent, 
  IndianRupee, 
  Calendar, 
  Users, 
  Info,
  CheckCircle2,
} from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingCoupon?: any
}

export function CouponModal({ isOpen, onClose, onSuccess, editingCoupon }: CouponModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    type: "FLAT",
    value: 0,
    description: "",
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    perCustomerLimit: 1,
    expiryDate: "",
    isActive: true,
  })

  useEffect(() => {
    if (editingCoupon) {
      setFormData({
        code: editingCoupon.code || "",
        type: editingCoupon.type || "FLAT",
        value: editingCoupon.value || 0,
        description: editingCoupon.description || "",
        minOrderAmount: editingCoupon.minOrderAmount || 0,
        maxDiscountAmount: editingCoupon.maxDiscountAmount || 0,
        usageLimit: editingCoupon.usageLimit || 0,
        perCustomerLimit: editingCoupon.perCustomerLimit || 1,
        expiryDate: editingCoupon.expiryDate ? new Date(editingCoupon.expiryDate).toISOString().split('T')[0] : "",
        isActive: editingCoupon.isActive ?? true,
      })
    } else {
      setFormData({
        code: "",
        type: "FLAT",
        value: 0,
        description: "",
        minOrderAmount: 0,
        maxDiscountAmount: 0,
        usageLimit: 0,
        perCustomerLimit: 1,
        expiryDate: "",
        isActive: true,
      })
    }
  }, [editingCoupon, isOpen])

  const handleSubmit = async () => {
    if (!formData.code || !formData.value) {
      toast.error("Code and Discount Value are required")
      return
    }

    try {
      setIsLoading(true)
      const endpoint = editingCoupon ? `/coupons/${editingCoupon._id}` : "/coupons"
      const method = editingCoupon ? "PATCH" : "POST"

      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      })

      if (res.success) {
        toast.success(editingCoupon ? "Coupon updated" : "Coupon created")
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
      description={editingCoupon ? "Update promotion configuration." : "Register a new discount code for your store."}
      confirmLabel={editingCoupon ? "Save Changes" : "Deploy Coupon"}
      onConfirm={handleSubmit}
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-6 py-4 text-left">
        {/* --- PRIMARY INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Coupon Code</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="E.G. SUMMER20"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-sm font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Discount Type</label>
            <div className="grid grid-cols-2 gap-2 h-12">
              {(["FLAT", "PERCENTAGE"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest",
                    formData.type === t 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {t === "FLAT" ? <IndianRupee className="h-3 w-3" /> : <Percent className="h-3 w-3" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Discount Value</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {formData.type === "FLAT" ? <IndianRupee className="h-4 w-4" /> : <Percent className="h-4 w-4" />}
              </div>
              <input 
                type="number"
                placeholder="0"
                value={formData.value || ""}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-sm font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center justify-between">
               <span>Max Disc (₹)</span>
               {formData.type !== "PERCENTAGE" && <span className="text-[7px] lowercase opacity-40">Perc. Only</span>}
            </label>
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="number"
                disabled={formData.type !== "PERCENTAGE"}
                placeholder="Unlimited"
                value={formData.maxDiscountAmount || ""}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-sm font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* --- CONSTRAINTS --- */}
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Min Order (₹)</label>
            <input 
              type="number"
              placeholder="0"
              value={formData.minOrderAmount || ""}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
              className="w-full h-12 bg-muted/30 border border-border rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Expiry Date</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-xs font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Overall Limit</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="number"
                placeholder="Unlimited"
                value={formData.usageLimit || ""}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Per User Limit</label>
            <input 
              type="number"
              min="1"
              value={formData.perCustomerLimit || ""}
              onChange={(e) => setFormData({ ...formData, perCustomerLimit: Number(e.target.value) })}
              className="w-full h-12 bg-muted/30 border border-border rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 tracking-[0.2em]">Promotion Details</label>
          <textarea 
            placeholder="E.G. Flat ₹100 Savings on your items today!"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[80px] bg-muted/30 border border-border rounded-3xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-inner"
          />
        </div>
      </div>
    </Modal>
  )
}
