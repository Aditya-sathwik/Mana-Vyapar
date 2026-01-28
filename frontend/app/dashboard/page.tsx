"use client"

import { DashboardShell } from "@/components/layout/dashboard-shell"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Plus,
  ArrowRight,
  LogOut,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

import { useInventory, type Product } from "@/hooks/use-inventory"
import { useKhata, type KhataAccount } from "@/hooks/use-khata"

const stats = [
  {
    title: "Total Inventory",
    value: "1,248",
    description: "+12.5% from last month",
    icon: Package,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Khata Customers",
    value: "84",
    description: "5 new this week",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Total Credit",
    value: "₹42,390",
    description: "₹2,400 collected today",
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Low Stock Items",
    value: "12",
    description: "Requires urgent restock",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
]

import { useLanguage } from "@/context/language-context"

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const { products, loading: invLoading } = useInventory()
  const { khataAccounts, loading: khataLoading } = useKhata()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Calculate dynamic stats
  const totalStock = products.reduce((acc: number, p: Product) => acc + p.stock, 0)
  const lowStockCount = products.filter((p: Product) => p.stock <= p.lowStockThreshold).length
  const totalCredit = khataAccounts.reduce((acc: number, k: KhataAccount) => acc + (k.balance > 0 ? k.balance : 0), 0)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">
            {t('welcome')}, {user.fullname.split(' ')[0]}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('tagline')}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={logout} className="gap-2 rounded-xl border-slate-200 dark:border-slate-800">
            <LogOut className="h-4 w-4" /> {t('logout')}
          </Button>
          <Button asChild className="gap-2 shadow-lg shadow-emerald-500/20 rounded-xl">
            <Link href="/inventory">
              <Plus className="h-4 w-4" /> {t('add_item')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: t('total_inventory'),
            value: totalStock.toLocaleString(),
            description: "Current total stock pieces",
            icon: Package,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            title: t('khata_customers'),
            value: khataAccounts.length.toLocaleString(),
            description: "Total active ledger accounts",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            title: t('total_credit'),
            value: `₹${totalCredit.toLocaleString()}`,
            description: "Total outstanding payments",
            icon: TrendingUp,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
          {
            title: t('low_stock'),
            value: lowStockCount.toLocaleString(),
            description: "Requires urgent restock",
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group hover:border-emerald-500/50 transition-colors cursor-pointer overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-16 -mt-16 rounded-full transition-opacity group-hover:opacity-40 ${stat.bg}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900 dark:text-white">
        {/* Recent Inventory */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('inventory')} Quick View</CardTitle>
              <CardDescription>Manage your stock levels efficiently.</CardDescription>
            </div>
            <Button asChild variant="ghost" className="text-emerald-500 hover:text-emerald-400">
              <Link href="/inventory">
                {t('view_all')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {invLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                <Package className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No products found. Add your first item!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 4).map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-700 overflow-hidden flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-slate-500">
                          {product.category} • SKU: {product.sku || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{product.price.toLocaleString()}</p>
                      <p className={cn(
                        "text-xs font-semibold",
                        product.stock <= product.lowStockThreshold ? "text-red-400" : "text-emerald-500"
                      )}>
                        {product.stock} {product.unit}s in stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Khata</CardTitle>
              <CardDescription>Latest customer credit updates.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400">
              <Link href="/khata">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {khataLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : khataAccounts.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No customers in Khata.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {khataAccounts.slice(0, 5).map((account: KhataAccount) => (
                  <div key={account._id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500 font-bold">
                      {account.customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{account.customerName}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(account.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-bold",
                        account.balance > 0 ? "text-red-400" : "text-emerald-500"
                      )}>
                        ₹{Math.abs(account.balance).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {account.balance > 0 ? "Due" : "Balance"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button className="w-full mt-8" variant="outline">
              New Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
