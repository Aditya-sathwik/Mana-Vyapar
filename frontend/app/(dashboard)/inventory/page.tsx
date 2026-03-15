"use client"

import { 
  Search, 
  Plus, 
  MoreVertical, 
  Download, 
  Filter, 
  LayoutGrid, 
  ArrowUpRight, 
  Package, 
  Layers, 
  Smartphone,
  ScanLine,
  Database,
  RefreshCw,
  Box
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const products = [
  { id: 1, name: "Royal Basmati Rice", sku: "GR-1024", weight: "5kg", category: "Grains & Pulses", stock: 142, status: "Healthy", price: 640, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT-2-_PzQlwMqMvQx2PvTu41Tuo-cizZNUjS069GsRwUFYBaah-O2WurGZRpnTd3dZLGx5BS7m73qojO6ZhFDrKTNd1pj8KN9hyoNPFuHk7lKHGcF92nla4RpKpP6Y6Bjv6Sh82FLBDPJkIYoBH4bLbVYYowZfF6jVDiIHXy6v407dqiAlb3bEJJMxgd4-qgvWTzTodZQv3VtLnvH5mdwhnMBE7yIIJj2HVKl7tqX5E2Ss4A8TL05PgaiBU5aidAF4pnkp0xgul94", turn: "High" },
  { id: 2, name: "Fortune Sunflower Oil", sku: "OL-2901", weight: "1L", category: "Oils & Ghee", stock: 8, status: "Low Stock", price: 165, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwkEO9qbIAAppDZYKyJQoZFIlHWbvQUqCBzDpqh8YBa__mLi6Ln6Ze5mB5_mMPNLMK5-YiTGoLokZSuNVwXhRDpyT2zQX_gI2-VcJTYh7JSNPW2wfnzkdsCO3I71V2hbLtXOWbnpRXApqD2iDypPCqCTGtoYQVxPjKqZDBxR8XCf3rDK7jQWcJSlFwQ8XpF1xwC13mmng8woWxyHybqKQP9icYA-V2tPEdo277iXo2_Z7sZTi_Z24KLDgard38bbKA1gWLIdF__04", turn: "Medium" },
  { id: 3, name: "Cadbury Dairy Milk Silk", sku: "SN-5005", weight: "150g", category: "Snacks", stock: 0, status: "Out of Stock", price: 175, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL9dduvKcr6Frf5GFX9bHwF8PlwhnzGf9t5zXsN91PqfvWZ79U7z0z1RvUErpGVATfhzJ_bkgvpr-aTvlLB0xQDBef7FGW2x8rh9iD462p0ijcJJi1cDMXJj6pKI4O7OpcvikWG1cay9nQR44J_aRW-RKxUYcOb_3xDndhuPbgELKNkMIbpsAHHy3KEDpHod0TFdCV0ppJoi8ZJaXB31s0kCT9SXohYkQUD9VYJrzikDMaoN8TTAy0Q1imAMdX2kMxQrJU0L6SR4s", turn: "V. High" },
]

export default function InventoryPage() {
  return (
    <div className="space-y-10 pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
             Smart <span className="text-primary tracking-normal">Inventory</span> Catalog
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">
             Tracking 3,240 unique SKUs across 12 product categories.
           </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-12 flex items-center gap-3 px-6 bg-slate-900 text-white dark:bg-slate-100 dark:text-black rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 group">
              <Download className="h-4 w-4" />
              BULK REPORT
           </button>
           <button className="h-12 flex items-center gap-3 px-6 bg-primary hover:bg-primary-dark text-black rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
              <Plus className="h-5 w-5" />
              ADD NEW SKU
           </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Critical Stock", value: "12 Items", icon: Box, color: "text-red-500", bg: "bg-red-500/10" },
           { label: "Category Count", value: "18 Types", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Inventory Value", value: "₹2.4M", icon: Database, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Optimization", value: "92%", icon: RefreshCw, color: "text-primary", bg: "bg-primary/10" },
         ].map((item, i) => (
            <Card key={i} className="p-6 bg-white dark:bg-[#09090b] border-primary/10 hover:border-primary/40 transition-all">
               <div className="flex items-center gap-4 mb-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                     <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                     <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.value}</p>
                  </div>
               </div>
            </Card>
         ))}
      </div>

      <Card className="bg-white dark:bg-[#09090b] border-primary/10 overflow-hidden shadow-2xl">
         {/* Search/Filter Bar */}
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
               <input 
                type="text" 
                placeholder="Search catalog by SKU, Vendor, or Product Name..." 
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
               />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-500 hover:text-primary transition-all uppercase tracking-widest">
                  <Filter className="h-4 w-4" />
                  Smart Filters
               </button>
               <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
               <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <button className="p-2 bg-white dark:bg-slate-800 text-primary rounded-lg shadow-sm"><LayoutGrid className="h-4 w-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-primary"><Plus className="h-4 w-4" /></button>
               </div>
            </div>
         </div>

         {/* Product Grid/List Hybrid */}
         <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-900">
            {products.map((product) => (
               <div key={product.id} className="p-8 hover:bg-primary/5 transition-all group flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 flex items-center gap-6">
                     <div className="relative">
                        <div className="h-24 w-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-slate-100 dark:border-slate-800 group-hover:border-primary/50 transition-all shadow-xl">
                           <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className={cn(
                          "absolute -top-2 -right-2 h-6 w-6 rounded-full border-2 border-white dark:border-[#09090b] shadow-lg flex items-center justify-center",
                          product.status === 'Healthy' ? "bg-emerald-500" : product.status === 'Low Stock' ? "bg-orange-500" : "bg-red-500"
                        )}>
                           <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{product.name}</h4>
                           <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase tracking-widest">{product.sku}</span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2">
                           <Layers className="h-3.5 w-3.5" /> {product.category} • {product.weight}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-10">
                     <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Stock Level</p>
                        <div className="flex items-center gap-3">
                           <div className="w-24 h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-1000", 
                                product.status === 'Healthy' ? "bg-emerald-500" : product.status === 'Low Stock' ? "bg-orange-500" : "bg-red-500"
                              )} style={{ width: product.status === 'Healthy' ? '85%' : product.status === 'Low Stock' ? '15%' : '0%' }} />
                           </div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{product.stock}U</span>
                        </div>
                     </div>
                     <div className="text-center min-w-[100px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mkt Price</p>
                        <p className="text-2xl font-black text-primary tracking-tighter">₹{product.price}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Turn Rate</p>
                        <span className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">{product.turn}</span>
                     </div>
                     <button className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/50 transition-all">
                        <MoreVertical className="h-6 w-6" />
                     </button>
                  </div>
               </div>
            ))}
         </div>

         {/* Pagination Footer */}
         <div className="p-8 bg-slate-50/30 dark:bg-slate-950/30 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page 01 <span className="text-slate-300">/</span> 12</p>
            <div className="flex gap-4">
               <button className="px-6 py-2 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest disabled:opacity-20" disabled>Previous</button>
               <button className="px-6 py-2 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 hover:text-primary transition-all uppercase tracking-widest">Next Entry</button>
            </div>
         </div>
      </Card>
    </div>
  )
}
