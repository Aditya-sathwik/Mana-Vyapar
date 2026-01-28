"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { useKhata, type KhataAccount } from "@/hooks/use-khata"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Users, 
  Phone,
  IndianRupee,
  History,
  MoreVertical,
  UserPlus,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

export default function KhataPage() {
  const { khataAccounts, loading, addCustomer } = useKhata()
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [search, setSearch] = React.useState("")
  
  // Form State
  const [formData, setFormData] = React.useState({
    customerName: "",
    customerPhoneNumber: "",
    customerEmail: "",
    creditLimit: "0",
    notes: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await addCustomer({
        ...formData,
        creditLimit: Number(formData.creditLimit)
      })
      setIsModalOpen(false)
      setFormData({
        customerName: "",
        customerPhoneNumber: "",
        customerEmail: "",
        creditLimit: "0",
        notes: ""
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredAccounts = khataAccounts.filter(acc => 
    acc.customerName.toLowerCase().includes(search.toLowerCase()) || 
    acc.customerPhoneNumber.includes(search)
  )

  const totalDues = khataAccounts.reduce((acc, k) => acc + (k.balance > 0 ? k.balance : 0), 0)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-1">{t('khata')}</h1>
          <p className="text-muted-foreground">{t('khata_subtitle')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-emerald-500/20">
          <UserPlus className="h-4 w-4" /> {t('add_new_customer')}
        </Button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-500/70 uppercase tracking-wider">{t('khata_customers')}</p>
                <p className="text-2xl font-bold text-foreground">{khataAccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-500">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-red-500/70 uppercase tracking-wider">{t('total_outstanding')}</p>
                <p className="text-2xl font-bold text-foreground">₹{totalDues.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500">
                <History className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-500/70 uppercase tracking-wider">{t('recent_activity')}</p>
                <p className="text-2xl font-bold text-foreground">12 today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder={t('search_placeholder')} 
          className="pl-12 h-14 bg-card border-border text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-[32px] bg-muted/20 animate-pulse" />
          ))
        ) : filteredAccounts.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t('no_customers_found')}</p>
          </div>
        ) : (
          filteredAccounts.map((account) => (
            <Card key={account._id} className="group hover:border-emerald-500/50 transition-all duration-300 bg-card border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-xl font-bold text-emerald-500 border border-border">
                      {account.customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-none mb-1">{account.customerName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {account.customerPhoneNumber}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{t('current_balance')}</p>
                    <p className={cn(
                      "text-2xl font-display font-black",
                      account.balance > 0 ? "text-red-500" : "text-emerald-500"
                    )}>
                      ₹{Math.abs(account.balance).toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm" className="rounded-xl px-4 h-9 gap-2">
                    {t('record')} <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={t('register_new_customer')}
        className="bg-card border-border"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('customer_name')} *</label>
              <Input 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleInputChange} 
                placeholder="Full Name" 
                required 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('phone_number')} *</label>
              <Input 
                name="customerPhoneNumber" 
                value={formData.customerPhoneNumber} 
                onChange={handleInputChange} 
                placeholder="+91 XXXXX XXXXX" 
                required 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('email_optional')}</label>
              <Input 
                name="customerEmail" 
                type="email"
                value={formData.customerEmail} 
                onChange={handleInputChange} 
                placeholder="customer@example.com" 
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">{t('credit_limit')} (₹)</label>
              <Input 
                name="creditLimit" 
                type="number" 
                value={formData.creditLimit} 
                onChange={handleInputChange} 
                placeholder="0.00" 
                className="bg-muted border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              {isSubmitting ? t('saving') : t('add_customer')}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  )
}
