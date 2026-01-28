"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { useInventory, type Product } from "@/hooks/use-inventory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Package, 
  Filter,
  Loader2,
  Trash2,
  Edit,
  ImagePlus
} from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"

export default function InventoryPage() {
  const { products, loading, error, addProduct, refreshInventory } = useInventory()
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [search, setSearch] = React.useState("")
  
  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    unit: "piece",
    sku: "",
    description: ""
  })
  const [selectedImages, setSelectedImages] = React.useState<FileList | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      if (selectedImages) {
        Array.from(selectedImages).forEach(file => data.append("images", file))
      }

      await addProduct(data)
      setIsModalOpen(false)
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        unit: "piece",
        sku: "",
        description: ""
      })
      setSelectedImages(null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-1">{t('inventory_management')}</h1>
          <p className="text-muted-foreground">{t('inventory_subtitle')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-emerald-500/20">
          <Plus className="h-4 w-4" /> {t('add_new_product')}
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('search_placeholder')} 
            className="pl-12 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 gap-2 border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground">
          <Filter className="h-4 w-4" /> {t('filters')}
        </Button>
      </div>

      {/* Products Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('product')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('category')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('stock_status')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('price')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8 h-20 bg-muted/50" />
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-medium">{t('no_products')}</p>
                        <Button variant="link" onClick={() => setIsModalOpen(true)} className="text-emerald-500">
                          {t('add_first_item')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="group hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border">
                            {product.images?.[0] ? (
                              <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground leading-tight">{product.name}</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">SKU: {product.sku || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground border border-border">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-bold leading-none",
                            product.stock <= product.lowStockThreshold ? "text-red-500" : "text-emerald-500"
                          )}>
                            {product.stock} {product.unit}s
                          </span>
                          <span className="text-[10px] text-muted-foreground tracking-tight">
                            {product.stock <= product.lowStockThreshold ? "Low Stock" : "Healthy"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-foreground">
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={t('add_product_title')}
        className="max-w-2xl bg-card border-border"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('product_name')} *</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="e.g. Steel Nail 2-inch" 
                required 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('category')} *</label>
              <Input 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                placeholder="e.g. Hardware" 
                required 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('price')} (₹) *</label>
              <Input 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleInputChange} 
                placeholder="0.00" 
                required 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('initial_stock')} *</label>
              <Input 
                name="stock" 
                type="number" 
                value={formData.stock} 
                onChange={handleInputChange} 
                placeholder="0" 
                required 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('unit')}</label>
              <Input 
                name="unit" 
                value={formData.unit} 
                onChange={handleInputChange} 
                placeholder="piece, kg, bundle..." 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('sku_code')}</label>
              <Input 
                name="sku" 
                value={formData.sku} 
                onChange={handleInputChange} 
                placeholder="Unique Identifier" 
                className="bg-muted border-border text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">{t('product_images')}</label>
            <div className="relative group cursor-pointer">
              <Input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => setSelectedImages(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border bg-muted group-hover:border-primary/50 group-hover:bg-muted/80 transition-all">
                <ImagePlus className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  {selectedImages ? `${selectedImages.length} ${t('files_selected')}` : t('drop_images')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              className="min-w-[140px] shadow-lg shadow-emerald-500/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isSubmitting ? t('adding') : t('add_new_product')}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  )
}
