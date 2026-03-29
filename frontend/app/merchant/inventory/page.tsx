"use client"

import { useState, useEffect, useCallback, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  Search, 
  ArrowLeft,
  ArrowRight,
  Plus, 
  Layers, 
  Database,
  RefreshCw,
  Box,
  Loader2,
  Trash2,
  Edit,
  AlertCircle,
  IndianRupee,
  ChevronDown,
  Upload,
  Link as LinkIcon,
  X,
  ImageIcon
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api-client"
import { Modal } from "@/components/ui/modal"
import toast from "react-hot-toast"

function InventoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCategory = searchParams.get("category")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({ page: 1, total: 0, pages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || "")
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  
  // Image handling
  const [imageType, setImageType] = useState<"upload" | "url">("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const initialFormState = {
    name: "",
    description: "",
    price: "",
    stock: "0",
    unit: "piece",
    imageUrl: "",
    categoryIds: initialCategory ? [initialCategory] : [] as string[]
  }

  const [productFormData, setProductFormData] = useState(initialFormState)

  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStock: 0,
  })

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiFetch("/stores/me")
      if (res.success && res.data) {
        const catRes = await apiFetch(`/categories/tree/${res.data._id}`)
        if (catRes.success) setCategories(catRes.data)
      }
    } catch (e) {}
  }, [])

  const fetchInventory = useCallback(async (pageValue: number = 1) => {
    try {
      setIsLoading(true)
      let endpoint = "/products"
      const params = new URLSearchParams()
      params.append("page", pageValue.toString())
      if (searchQuery) params.append("search", searchQuery)
      if (categoryFilter) params.append("category", categoryFilter)
      
      const res = await apiFetch(`${endpoint}?${params.toString()}`)
      if (res.success) {
        setProducts(res.data.products)
        setPagination(res.data.pagination)
        
        const totalValue = res.data.products.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0)
        const lowStock = res.data.products.filter((p: any) => p.stock <= (p.lowStockThreshold || 10)).length
        
        setStats({
          totalItems: res.data.pagination.total,
          totalValue: totalValue,
          lowStock: lowStock,
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load inventory")
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, categoryFilter])

  useEffect(() => {
    fetchInventory()
    fetchCategories()
  }, [fetchInventory, fetchCategories])

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product)
      setProductFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        unit: product.unit || "piece",
        imageUrl: product.images?.[0]?.url || "",
        categoryIds: product.category?.map((c: any) => c._id) || []
      })
      setPreviewUrl(product.images?.[0]?.url || null)
      setImageType(product.images?.[0]?.url ? "url" : "upload")
    } else {
      setEditingProduct(null)
      setProductFormData(initialFormState)
      setPreviewUrl(null)
      setSelectedFile(null)
      setImageType("upload")
    }
    setIsModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProduct = async () => {
    if (!productFormData.name || !productFormData.price || productFormData.categoryIds.length === 0) {
      toast.error("Required: Name, Price, and Category")
      return
    }

    try {
      setIsActionLoading(true)
      
      // Use FormData for BOTH Post and Patch now as both support multer
      const data = new FormData()
      data.append("name", productFormData.name)
      data.append("description", productFormData.description)
      data.append("price", productFormData.price)
      data.append("stock", productFormData.stock)
      data.append("unit", productFormData.unit)
      productFormData.categoryIds.forEach(id => data.append("category", id))

      if (imageType === "upload" && selectedFile) {
        data.append("images", selectedFile)
      } else if (imageType === "url" && productFormData.imageUrl) {
        data.append("imageUrl", productFormData.imageUrl)
      }

      let res;
      if (editingProduct) {
        res = await apiFetch(`/products/${editingProduct._id}`, {
          method: "PATCH",
          body: data,
          isMultipart: true
        })
      } else {
        res = await apiFetch("/products", {
          method: "POST",
          body: data,
          isMultipart: true
        })
      }

      if (res.success) {
        toast.success(editingProduct ? "Updated successfully" : "Added to inventory")
        setIsModalOpen(false)
        setProductFormData(initialFormState)
        setSelectedFile(null)
        setPreviewUrl(null)
        fetchInventory(pagination.page)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this product?")) return
    try {
      const res = await apiFetch(`/products/${id}`, { method: "DELETE" })
      if (res.success) {
        toast.success("Product deleted")
        fetchInventory(pagination.page)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12 text-center lg:text-left">
        <div className="space-y-2">
           <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-foreground tracking-tight uppercase leading-none">
             Catalog <span className="text-primary italic">Inventory</span>
           </h1>
           <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 mt-2">
              <span className="h-px w-6 md:w-16 bg-primary/30 hidden sm:block" />
              <p className="text-muted-foreground text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em]">
                Live Management • {stats.totalItems} Active SKU
              </p>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 h-fit px-2 sm:px-0">
           <button 
             onClick={() => router.push("/merchant/categories")}
             className="h-14 md:h-20 flex-1 flex items-center justify-center gap-4 px-6 md:px-8 bg-muted border border-border rounded-xl md:rounded-3xl font-black text-[10px] tracking-widest uppercase hover:bg-foreground hover:text-white transition-all active:scale-95 shadow-xl"
           >
              <div className="p-2 lg:p-3 bg-card rounded-xl border border-border transition-transform group-hover:rotate-12">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <span className="text-left font-bold tracking-widest leading-none">Catalog<br /><span className="text-[9px] text-muted-foreground">Categories</span></span>
           </button>
           <button 
             onClick={() => handleOpenModal()}
             className="h-16 md:h-20 flex-[1.5] flex items-center justify-center gap-4 md:gap-5 px-8 md:px-10 bg-primary hover:bg-emerald-600 text-white rounded-xl md:rounded-3xl font-black text-[11px] md:text-[12px] tracking-widest uppercase shadow-[0_0_30px_rgba(5,148,103,0.3)] transition-all active:scale-95 border-2 border-primary/20"
           >
              <Plus className="h-6 w-6 md:h-8 md:w-8 stroke-[4] animate-pulse" />
              <div className="text-left">
                <p className="text-[9px] opacity-70 leading-none mb-0.5 font-black uppercase">Quick Action</p>
                <p className="text-base md:text-lg font-black tracking-widest uppercase">Add Product</p>
              </div>
           </button>
        </div>
      </div>

      {/* --- STATS: 2-column on mobile --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
         {[
           { label: "Items", value: stats.totalItems, icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Stock Value", value: `₹${(stats.totalValue / 1000).toFixed(1)}K`, icon: Database, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Critical", value: stats.lowStock, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
           { label: "Auto-Sync", value: "Active", icon: RefreshCw, color: "text-primary", bg: "bg-primary/10" },
         ].map((item, i) => (
            <Card key={i} className="p-4 md:p-8 bg-card border-border hover:border-primary/40 transition-all rounded-[1.25rem] md:rounded-[2rem] shadow-lg">
               <div className="flex items-center gap-3 md:gap-5">
                  <div className={cn("h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                     <item.icon className="h-5 w-5 md:h-7 md:w-7" />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 truncate">{item.label}</p>
                     <p className="text-sm md:text-2xl font-black text-foreground uppercase tracking-tight leading-none truncate">{item.value}</p>
                  </div>
               </div>
            </Card>
         ))}
      </div>

      <Card className="bg-card border-border overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem]">
         {/* Search/Filter Bar: Proper inline sync for mobile */}
         <div className="p-4 md:p-8 border-b border-border flex items-center justify-between gap-3 text-left bg-muted/30">
            <div className="relative flex-1 group">
               <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input 
                type="text" 
                placeholder="Quick search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 md:pl-14 pr-6 h-11 md:h-14 bg-background/50 border border-border rounded-xl md:rounded-2xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner"
               />
            </div>
            <button 
              onClick={() => fetchInventory(1)}
              className="h-11 md:h-14 w-11 md:w-14 flex items-center justify-center bg-background border border-border rounded-xl md:rounded-2xl hover:text-primary transition-all shadow-sm shrink-0 active:scale-90"
            >
               <RefreshCw className={cn("h-4 md:h-5 w-4 md:w-5", isLoading && "animate-spin")} />
            </button>
         </div>

         {/* Product List */}
         <div className="divide-y divide-border/50 min-h-[400px]">
            {isLoading ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Updating Inventory...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="p-5 md:p-8 hover:bg-primary/5 transition-all group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                   <div className="flex items-center gap-4 w-full md:flex-1 min-w-0">
                      <div className="relative shrink-0">
                         <div className="h-20 w-20 md:h-24 md:w-24 rounded-[1.5rem] md:rounded-[2rem] bg-muted overflow-hidden border-2 border-border group-hover:border-primary/50 transition-all shadow-xl">
                            {product.images?.[0] ? (
                              <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                                <Box className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                            )}
                         </div>
                         <div className={cn(
                           "absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-background shadow-lg flex items-center justify-center",
                           product.stock > (product.lowStockThreshold || 10) ? "bg-emerald-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"
                         )}>
                            <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-base md:text-xl font-black text-foreground tracking-tighter uppercase truncate leading-none mb-2">{product.name}</h4>
                         <div className="flex flex-wrap items-center gap-1.5">
                            {product.category?.slice(0, 1).map((c: any) => (
                              <span key={c._id} className="text-[8px] md:text-[9px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/20 uppercase tracking-widest">
                                {c.name}
                              </span>
                            ))}
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">({product.unit || "piece"})</span>
                         </div>
                         {/* Mobile Stats Row */}
                         <div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t border-border/10">
                            <div>
                               <p className="text-[7px] font-black text-muted-foreground uppercase mb-0.5 tracking-widest">Price</p>
                               <span className="text-sm font-black text-primary leading-none">₹{product.price}</span>
                            </div>
                            <div>
                               <p className="text-[7px] font-black text-muted-foreground uppercase mb-0.5 tracking-widest">Stock</p>
                               <span className="text-sm font-black text-foreground leading-none">{product.stock}U</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Stats & Actions (Desktop & Tablet) */}
                   <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 md:gap-12 mt-2 md:mt-0 border-t md:border-t-0 border-border/10 pt-4 md:pt-0">
                      <div className="hidden md:flex flex-col items-center">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Stock</p>
                          <span className="text-lg font-black text-foreground tracking-tighter leading-none">{product.stock}U</span>
                      </div>
                      <div className="hidden md:flex flex-col items-center">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Mkt Price</p>
                          <span className="text-2xl font-black text-primary tracking-tighter leading-none">₹{product.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full md:w-auto">
                          <button 
                              onClick={() => handleOpenModal(product)}
                              className="flex-1 md:flex-none h-11 md:h-12 px-4 md:w-12 flex items-center justify-center bg-muted border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-sm gap-2"
                          >
                              <Edit className="h-4 w-4" />
                              <span className="md:hidden text-[9px] font-black uppercase">Edit</span>
                          </button>
                          <button 
                              onClick={() => handleDelete(product._id)}
                              className="flex-1 md:flex-none h-11 md:h-12 px-4 md:w-12 flex items-center justify-center bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm gap-2"
                          >
                              <Trash2 className="h-4 w-4" />
                              <span className="md:hidden text-[9px] font-black uppercase">Delete</span>
                          </button>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-center p-8">
                <Box className="h-16 w-16 text-muted-foreground/20" />
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">No Matches Found</h3>
              </div>
            )}
         </div>

         {/* Pagination - Mobile Friendly */}
         <div className="p-4 md:p-8 bg-muted/30 flex flex-col sm:flex-row items-center justify-between border-t border-border/50 gap-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">
              Page {pagination.page} <span className="text-border mx-2">OF</span> {pagination.pages}
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
               <button 
                 disabled={pagination.page <= 1 || isLoading}
                 onClick={() => fetchInventory(pagination.page - 1)}
                 className="flex-1 sm:flex-none px-6 md:px-8 h-12 md:h-14 border border-border bg-background rounded-xl md:rounded-full text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest disabled:opacity-20 active:scale-95 flex items-center justify-center gap-2"
               >
                 <ArrowLeft className="h-4 w-4" /> Previous
               </button>
               <button 
                 disabled={pagination.page >= pagination.pages || isLoading}
                 onClick={() => fetchInventory(pagination.page + 1)}
                 className="flex-1 sm:flex-none px-6 md:px-8 h-12 md:h-14 border border-border bg-background rounded-xl md:rounded-full text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest disabled:opacity-20 active:scale-95 flex items-center justify-center gap-2"
               >
                 Next <ArrowRight className="h-4 w-4" />
               </button>
            </div>
         </div>
      </Card>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Update ${editingProduct.name}` : "Product Registration"}
        description={editingProduct ? "Revise your catalog details below." : "Register a new item into your digital catalog."}
        confirmLabel={editingProduct ? "Update Changes" : "Register Product"}
        onConfirm={handleSaveProduct}
        isLoading={isActionLoading}
      >
        <div className="space-y-6 py-4 text-left">
          {/* Image Selection Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Product Visual</label>
            
            <div className="flex bg-muted/50 p-1.5 rounded-2xl gap-1.5 h-14">
                <button 
                    onClick={() => setImageType("upload")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        imageType === "upload" ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Upload className="h-4 w-4" />
                    File Upload
                </button>
                <button 
                    onClick={() => setImageType("url")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        imageType === "url" ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LinkIcon className="h-4 w-4" />
                    Image URL
                </button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="h-32 w-32 rounded-[2rem] bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden flex-shrink-0 group hover:border-primary/50 transition-all cursor-pointer relative"
                    onClick={() => imageType === "upload" && fileInputRef.current?.click()}
                >
                    {previewUrl ? (
                        <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                            <ImageIcon className="h-8 w-8 opacity-20" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">No Preview</span>
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
                             <p className="text-[9px] font-black text-muted-foreground uppercase opacity-50 tracking-widest">Selection Criteria: JPG/PNG, MAX 2MB</p>
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-12 bg-muted border border-border rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95"
                            >
                                <Upload className="h-4 w-4" />
                                Choose Local File
                             </button>
                             <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-muted-foreground uppercase opacity-50 tracking-widest">Public Web Link (CDN/HTTPS)</p>
                            <div className="relative group">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="https://images.com/product.jpg"
                                    value={productFormData.imageUrl}
                                    onChange={(e) => {
                                        setProductFormData({ ...productFormData, imageUrl: e.target.value })
                                        setPreviewUrl(e.target.value)
                                    }}
                                    className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-[10px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {/* Identity - Full width on grid */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Identity</label>
                <div className="relative group">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                </div>
            </div>

            {/* Description - Full width */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Context & Details (Optional)</label>
                <textarea
                    placeholder="Describe your product's unique selling points..."
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="w-full p-4 h-24 bg-muted/30 border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
            </div>

            {/* Classification - Full width on grid */}
            <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Classification</label>
                <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <select
                    value={productFormData.categoryIds[0] || ""}
                    onChange={(e) => setProductFormData({ ...productFormData, categoryIds: [e.target.value] })}
                    className="w-full pl-11 pr-10 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                >
                    <option value="" disabled>Select Department...</option>
                    {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mkt Price / {productFormData.unit}</label>
                <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                <input
                    type="number"
                    placeholder="0.00"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Measurement Unit</label>
                <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                    value={productFormData.unit}
                    onChange={(e) => setProductFormData({ ...productFormData, unit: e.target.value })}
                    className="w-full pl-11 pr-10 h-12 bg-muted/30 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer appearance-none"
                >
                    <option value="piece">piece</option>
                    <option value="kg">kg</option>
                    <option value="gm">gm</option>
                    <option value="litre">litre</option>
                    <option value="ml">ml</option>
                    <option value="packet">packet</option>
                    <option value="box">box</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Current Inventory ({productFormData.unit})</label>
                <div className="relative group">
                    <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                    <input
                        type="number"
                        placeholder="Current Stock Count"
                        value={productFormData.stock}
                        onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                        className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>}>
      <InventoryContent />
    </Suspense>
  )
}
