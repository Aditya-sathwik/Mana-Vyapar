"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download,
  Calendar,
  IndianRupee
} from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"

export default function TransactionsPage() {
  const { t } = useLanguage()
  const [search, setSearch] = React.useState("")

  // Mock data for initial design (Real integration later)
  const transactions = [
    { id: 1, type: "sale", amount: 1250, customer: "Aditya S", date: "2024-01-26", status: "completed" },
    { id: 2, type: "khata", amount: 500, customer: "Raju Bhai", date: "2024-01-26", status: "pending" },
    { id: 3, type: "sale", amount: 80, customer: "Cash Sale", date: "2024-01-25", status: "completed" },
    { id: 4, type: "expense", amount: 2000, customer: "Vendor Payment", date: "2024-01-24", status: "completed" },
  ]

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-1">{t('transactions')}</h1>
          <p className="text-muted-foreground">{t('transactions_subtitle') || "Track every rupee in and out."}</p>
        </div>
        <Button variant="outline" className="gap-2 border-border bg-card hover:bg-accent text-foreground">
          <Download className="h-4 w-4" /> {t('export_report') || "Export Report"}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('search_transactions') || "Search by name, amount or date..."}
            className="pl-12 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-12 border-border bg-card text-muted-foreground hover:text-foreground">
            <Calendar className="h-4 w-4 mr-2" /> {t('date_range') || "Date Range"}
          </Button>
          <Button variant="outline" className="h-12 border-border bg-card text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4 mr-2" /> {t('filter') || "Filter"}
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">{t('recent_history') || "History"}</CardTitle>
          <CardDescription className="text-muted-foreground">Latest financial movements in your shop.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center border",
                    tx.type === 'sale' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                    tx.type === 'khata' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                    "bg-red-500/10 border-red-500/20 text-red-500"
                  )}>
                    {tx.type === 'sale' ? <ArrowDownLeft className="h-5 w-5" /> : 
                     tx.type === 'khata' ? <History className="h-5 w-5" /> :
                     <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{tx.customer}</p>
                    <p className="text-xs text-muted-foreground capitalize">{tx.type} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold font-display text-base",
                    tx.type === 'expense' ? "text-red-500" : "text-emerald-500"
                  )}>
                    {tx.type === 'expense' ? "-" : "+"}₹{tx.amount.toLocaleString()}
                  </p>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                    tx.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
