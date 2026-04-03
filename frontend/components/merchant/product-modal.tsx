"use client"

import React, { useState, useRef, useEffect } from "react"
import { 
  Box, 
  Layers, 
  IndianRupee, 
  ChevronDown, 
  Upload, 
  Link as LinkIcon, 
  X, 
  ImageIcon, 
  RefreshCw,
  Tag,
  Percent
} from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { apiFetch } from "@/lib/api-client"

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingProduct?: any;
  categories: any[];
  initialCategoryId?: string;
}

export function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  editingProduct,
  categories,
  initialCategoryId
}: ProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [imageType, setImageType] = useState<"upload" | "url">("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const initialFormState = {
    name: "",
    description: "",
    originalPrice: "", // Strikethrough price
    sellingPrice: "", // Actual price
    costPrice: "",    // Merchant cost
    discount: "",     // Percentage or manual
    stock: "0",
    unit: "piece",
    imageUrl: "",
    categoryIds: initialCategoryId ? [initialCategoryId] : [] as string[]
  }

  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        originalPrice: editingProduct.originalPrice?.toString() || "",
        sellingPrice: editingProduct.sellingPrice?.toString() || "",
        costPrice: editingProduct.costPrice?.toString() || "",
        discount: editingProduct.discount?.toString() || "",
        stock: editingProduct.stock?.toString() || "0",
        unit: editingProduct.unit || "piece",
        imageUrl: editingProduct.images?.[0]?.url || "",
        categoryIds: editingProduct.category?.map((c: any) => c._id) || (initialCategoryId ? [initialCategoryId] : [])
      })
      setPreviewUrl(editingProduct.images?.[0]?.url || null)
      setImageType(editingProduct.images?.[0]?.url ? "url" : "upload")
    } else {
      setFormData({
        ...initialFormState,
        categoryIds: initialCategoryId ? [initialCategoryId] : []
      })
      setPreviewUrl(null)
      setSelectedFile(null)
      setImageType("upload")
    }
  }, [editingProduct, isOpen, initialCategoryId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.sellingPrice || formData.categoryIds.length === 0) {
      toast.error("Required: Name, Selling Price, and Category")
      return
    }

    try {
      setIsActionLoading(true)
      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      data.append("sellingPrice", formData.sellingPrice)
      if (formData.originalPrice) data.append("originalPrice", formData.originalPrice)
      if (formData.costPrice) data.append("costPrice", formData.costPrice)
      if (formData.discount) data.append("discount", formData.discount)
      data.append("stock", formData.stock)
      data.append("unit", formData.unit)
      formData.categoryIds.forEach(id => data.append("category", id))

      if (imageType === "upload" && selectedFile) {
        data.append("images", selectedFile)
      } else if (imageType === "url" && formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl)
      }

      const res = await apiFetch(editingProduct ? `/products/${editingProduct._id}` : "/products", {
        method: editingProduct ? "PATCH" : "POST",
        body: data,
        isMultipart: true
      })

      if (res.success) {
        toast.success(editingProduct ? "Product updated" : "Product registered")
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || "Operation failed")
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? `Modify ${editingProduct.name}` : "Product Registration"}
      description={editingProduct ? "Update your catalog details." : "Register a new item into your digital inventory."}
      confirmLabel={editingProduct ? "Update Catalog" : "Add to Inventory"}
      onConfirm={handleSave}
      isLoading={isActionLoading}
    >
      <div className="space-y-6 py-4 text-left">
        {/* --- Visual Identity Section --- */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
            <ImageIcon className="h-3 w-3" /> Product Visual
          </label>
          
          <div className="flex bg-muted/50 p-1 rounded-2xl gap-1 h-12">
            {["upload", "url"].map((type) => (
              <button 
                key={type}
                onClick={() => setImageType(type as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  imageType === type ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type === "upload" ? <Upload className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
                {type === "upload" ? "Local File" : "Image Link"}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <div 
              className="h-28 w-28 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden shrink-0 group hover:border-primary/50 transition-all cursor-pointer relative shadow-inner"
              onClick={() => imageType === "upload" && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <ImageIcon className="h-6 w-6 opacity-20" />
                  <span className="text-[7px] font-black uppercase tracking-tighter">No Preview</span>
                </div>
              )}
              {previewUrl && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                  className="absolute top-2 right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {imageType === "upload" ? (
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">Max 2MB • JPG/PNG</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-11 bg-muted border border-border rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95"
                  >
                    <Upload className="h-3.5 w-3.5" /> Select Local
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">Public CDN/HTTPS Link</p>
                  <div className="relative group">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value })
                        if (e.target.value.startsWith('http')) setPreviewUrl(e.target.value)
                      }}
                      className="w-full pl-10 pr-4 h-11 bg-muted/30 border border-border rounded-xl text-[10px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Identity & Classification --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Identity</label>
            <div className="relative group">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Unique Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Classification Department</label>
            <div className="relative group">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <select
                value={formData.categoryIds[0] || ""}
                onChange={(e) => setFormData({ ...formData, categoryIds: [e.target.value] })}
                className="w-full pl-11 pr-10 h-12 bg-muted/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Department...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none opacity-40" />
            </div>
          </div>
        </div>

        {/* --- Pricing Protocol (Shopify Style) --- */}
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
          <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <Tag className="h-3 w-3" /> Pricing Protocol
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Selling Price (Final)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:scale-110 transition-transform" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  className="w-full pl-11 pr-4 h-12 bg-card border border-border rounded-2xl text-sm font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 opacity-80 group hover:opacity-100 transition-opacity">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>Original Price</span>
                <span className="text-[8px] italic lowercase opacity-50 px-2 py-0.5 bg-muted rounded">Strikethrough</span>
              </label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Retail / MSRP"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full pl-11 pr-4 h-12 bg-muted/20 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cost Per Item</label>
              <div className="relative group">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Your Buy Price"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full pl-11 pr-4 h-12 bg-muted/20 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Discount (%)</label>
              <div className="relative group">
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <input
                  type="number"
                  placeholder="Optional Tag"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full pl-11 pr-4 h-12 bg-muted/20 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex items-center justify-between">
             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                Profit Margin: {formData.sellingPrice && formData.costPrice ? `${(((Number(formData.sellingPrice) - Number(formData.costPrice)) / Number(formData.sellingPrice)) * 100).toFixed(1)}%` : '--'}
             </p>
             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                Savings: {formData.originalPrice && formData.sellingPrice ? `${(Number(formData.originalPrice) - Number(formData.sellingPrice)).toFixed(0)} INR` : '--'}
             </p>
          </div>
        </div>

        {/* --- Inventory & Logistics --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Stock Level ({formData.unit})</label>
                <div className="relative group">
                    <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:animate-spin" />
                    <input
                        type="number"
                        placeholder="Qty"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Standard Unit</label>
                <div className="relative group">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full pl-11 pr-10 h-12 bg-muted/30 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    >
                        {["piece", "kg", "gm", "litre", "ml", "packet", "box", "sqft", "inch"].map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Catalog Description (Optional)</label>
            <textarea
                placeholder="Product attributes, warranty, and special details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-5 h-28 bg-muted/30 border border-border rounded-3xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none shadow-inner"
            />
        </div>
      </div>
    </Modal>
  )
}
