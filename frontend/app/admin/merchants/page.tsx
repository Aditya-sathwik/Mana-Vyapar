"use client"

import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Store, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MapPin,
  ExternalLink,
  Download
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const merchants = [
  { id: "M-9283", name: "Kirana Mart", owner: "Ramesh Sharma", location: "HSR Layout, Bangalore", status: "Active", joined: "Oct 12, 2023", revenue: "₹84,200", plan: "Business Pro" },
  { id: "M-9284", name: "Modern Electronics", owner: "Sita Devi", location: "Gachibowli, Hyderabad", status: "Pending", joined: "Oct 22, 2023", revenue: "₹0", plan: "Starter" },
  { id: "M-9285", name: "The Daily Needs", owner: "Vikram Singh", location: "Indiranagar, Bangalore", status: "Active", joined: "Sep 05, 2023", revenue: "₹1,24,500", plan: "Enterprise" },
  { id: "M-9286", name: "Sharma Textiles", owner: "Anjali Patel", location: "Chandni Chowk, Delhi", status: "Suspended", joined: "Aug 14, 2023", revenue: "₹2,10,000", plan: "Business Pro" },
  { id: "M-9287", name: "Fresh Fruits Co.", owner: "Mohan Lal", location: "Salt Lake, Kolkata", status: "Active", joined: "Nov 01, 2023", revenue: "₹12,400", plan: "Starter" },
]

export default function MerchantManagementPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Merchant Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Onboard, monitor, and manage all business entities across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
              <Download className="h-4 w-4" />
              Export List
           </button>
           <button className="bg-primary hover:bg-primary-dark text-black px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
              <Plus className="h-5 w-5" />
              Add New Merchant
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white dark:bg-[#09090b] border-primary/10 flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, store name, or owner..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50">
               <Filter className="h-4 w-4" />
               Filters
            </button>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="flex-1 md:flex-none flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 gap-1">
               <button className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white shadow-sm">All</button>
               <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700">Active</button>
               <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700">Pending</button>
            </div>
         </div>
      </Card>

      {/* Merchants Table */}
      <Card className="bg-white dark:bg-[#09090b] border-primary/10 overflow-hidden shadow-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-8 py-5">Merchant / Store</th>
                     <th className="px-6 py-5">Location</th>
                     <th className="px-6 py-5">Status</th>
                     <th className="px-6 py-5">Plan</th>
                     <th className="px-6 py-5">Revenue (MTD)</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {merchants.map((m) => (
                     <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                 <Store className="h-6 w-6" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-base">{m.name}</h4>
                                 <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="font-mono text-primary/80">{m.id}</span>
                                    <span>•</span>
                                    <span>{m.owner}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {m.location}
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className={cn(
                             "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                             m.status === 'Active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" :
                             m.status === 'Pending' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" :
                             "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                           )}>
                              {m.status === 'Active' ? <CheckCircle2 className="h-3 w-3" /> : 
                               m.status === 'Pending' ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {m.status}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{m.plan}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="text-sm font-extrabold text-slate-900 dark:text-white">{m.revenue}</div>
                           <p className="text-[10px] text-slate-400 font-medium">Joined {m.joined}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                 <ExternalLink className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-slate-300 hover:text-slate-600">
                                 <MoreVertical className="h-4 w-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-6 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Showing <span className="text-slate-900 dark:text-white font-bold">5</span> of <span className="text-slate-900 dark:text-white font-bold">1,240</span> merchants</p>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-50 dark:bg-slate-950">Previous</button>
               <button className="px-4 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 border border-primary/20">Next</button>
            </div>
         </div>
      </Card>
    </div>
  )
}
