"use client"

import {
  Search,
  Bell,
  CloudUpload,
  Plus,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data
const products = [
  { id: 1, name: "Royal Basmati Rice", sku: "GR-1024", weight: "5kg", category: "Grains & Pulses", stock: 142, status: "Healthy", price: 640, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT-2-_PzQlwMqMvQx2PvTu41Tuo-cizZNUjS069GsRwUFYBaah-O2WurGZRpnTd3dZLGx5BS7m73qojO6ZhFDrKTNd1pj8KN9hyoNPFuHk7lKHGcF92nla4RpKpP6Y6Bjv6Sh82FLBDPJkIYoBH4bLbVYYowZfF6jVDiIHXy6v407dqiAlb3bEJJMxgd4-qgvWTzTodZQv3VtLnvH5mdwhnMBE7yIIJj2HVKl7tqX5E2Ss4A8TL05PgaiBU5aidAF4pnkp0xgul94" },
  { id: 2, name: "Fortune Sunflower Oil", sku: "OL-2901", weight: "1L", category: "Oils & Ghee", stock: 8, status: "Low Stock", price: 165, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwkEO9qbIAAppDZYKyJQoZFIlHWbvQUqCBzDpqh8YBa__mLi6Ln6Ze5mB5_mMPNLMK5-YiTGoLokZSuNVwXhRDpyT2zQX_gI2-VcJTYh7JSNPW2wfnzkdsCO3I71V2hbLtXOWbnpRXApqD2iDypPCqCTGtoYQVxPjKqZDBxR8XCf3rDK7jQWcJSlFwQ8XpF1xwC13mmng8woWxyHybqKQP9icYA-V2tPEdo277iXo2_Z7sZTi_Z24KLDgard38bbKA1gWLIdF__04" },
  { id: 3, name: "Cadbury Dairy Milk Silk", sku: "SN-5005", weight: "150g", category: "Snacks", stock: 0, status: "Out of Stock", price: 175, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL9dduvKcr6Frf5GFX9bHwF8PlwhnzGf9t5zXsN91PqfvWZ79U7z0z1RvUErpGVATfhzJ_bkgvpr-aTvlLB0xQDBef7FGW2x8rh9iD462p0ijcJJi1cDMXJj6pKI4O7OpcvikWG1cay9nQR44J_aRW-RKxUYcOb_3xDndhuPbgELKNkMIbpsAHHy3KEDpHod0TFdCV0ppJoi8ZJaXB31s0kCT9SXohYkQUD9VYJrzikDMaoN8TTAy0Q1imAMdX2kMxQrJU0L6SR4s" },
]

export default function InventoryPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Product Catalog</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden sm:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-slate-800 dark:text-white placeholder-slate-400 transition-colors"
              placeholder="Search by name, SKU..."
              type="text"
            />
          </div>
          <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-surface-dark"></span>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="bg-surface-light dark:bg-surface-dark p-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex shadow-sm overflow-x-auto max-w-full">
          <button className="px-4 py-1.5 rounded text-sm font-medium bg-primary/10 text-primary shadow-sm whitespace-nowrap">All Items</button>
          <button className="px-4 py-1.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap">
            Low Stock <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold">4</span>
          </button>
          <button className="px-4 py-1.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap">
            Out of Stock <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">2</span>
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-primary/50 text-slate-700 dark:text-slate-200 hover:text-primary rounded-lg text-sm font-medium transition-colors shadow-sm">
            <CloudUpload className="h-4 w-4" />
            Bulk Import
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/20">
            <Plus className="h-4 w-4" />
            Manual Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col flex-1">

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-auto flex-1 custom-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background-light dark:bg-background-dark text-slate-500 dark:text-slate-400 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider w-16 text-center border-b border-slate-200 dark:border-slate-700">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white dark:bg-slate-800" type="checkbox" />
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider w-24 border-b border-slate-200 dark:border-slate-700">Image</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Product Name</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Category</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider w-1/4 border-b border-slate-200 dark:border-slate-700">Stock Level</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-right border-b border-slate-200 dark:border-slate-700">Price</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-right border-b border-slate-200 dark:border-slate-700 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((product) => (
                <tr key={product.id} className={cn("group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors", product.status === "Out of Stock" && "bg-red-50/50 dark:bg-red-900/10")}>
                  <td className="py-4 px-6 text-center">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white dark:bg-slate-800" type="checkbox" />
                  </td>
                  <td className="py-4 px-4">
                    <div className={cn("h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600", product.status === "Out of Stock" && "opacity-70 grayscale")}>
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className={cn("py-4 px-4", product.status === "Out of Stock" && "opacity-70")}>
                    <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                    <div className="text-xs text-slate-500">SKU: {product.sku} • {product.weight}</div>
                  </td>
                  <td className={cn("py-4 px-4", product.status === "Out of Stock" && "opacity-70")}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5 max-w-xs">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{product.stock} units</span>
                        <span className={cn(
                          product.status === "Healthy" ? "text-primary" :
                          product.status === "Low Stock" ? "text-orange-500" : "text-red-500 font-bold"
                        )}>
                          {product.status}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full",
                            product.status === "Healthy" ? "bg-primary" :
                            product.status === "Low Stock" ? "bg-orange-500" : "bg-red-500"
                          )}
                          style={{ width: product.status === "Healthy" ? "85%" : product.status === "Low Stock" ? "15%" : "0%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className={cn("py-4 px-4 text-right font-medium text-slate-900 dark:text-white", product.status === "Out of Stock" && "opacity-70")}>
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {products.map((product) => (
            <div key={product.id} className={cn("bg-white dark:bg-surface-dark rounded-lg border p-4 shadow-sm", product.status === "Out of Stock" ? "border-red-200 dark:border-red-900/30" : "border-slate-200 dark:border-slate-700")}>
              <div className="flex gap-4">
                <div className={cn("h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0", product.status === "Out of Stock" && "opacity-70 grayscale")}>
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate pr-2">{product.name}</h3>
                    <button className="text-slate-400">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">SKU: {product.sku} • {product.weight}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        product.status === "Healthy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        product.status === "Low Stock" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Stock: {product.stock}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={cn("h-1.5 rounded-full",
                          product.status === "Healthy" ? "bg-primary" :
                          product.status === "Low Stock" ? "bg-orange-500" : "bg-red-500"
                        )}
                        style={{ width: product.status === "Healthy" ? "85%" : product.status === "Low Stock" ? "15%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-xs font-medium transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Pagination */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark px-6 py-4 flex items-center justify-between shrink-0 safe-area-bottom">
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
            Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">3</span> of <span className="font-medium text-slate-900 dark:text-white">48</span> results
          </span>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
