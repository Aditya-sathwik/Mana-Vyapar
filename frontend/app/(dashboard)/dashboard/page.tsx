"use client"

import {
  Card
} from "@/components/ui/card"
import {
  ScanLine,
  TrendingUp,
  Receipt,
  Users,
  Clock,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Good Morning, Rajesh!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Here&apos;s what&apos;s happening at Mana Vyapar Store #102 today.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Card A: Quick Action (Hero) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-2 row-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 relative overflow-hidden shadow-lg shadow-primary/20 flex flex-col justify-center min-h-[300px] group cursor-pointer transition-transform hover:scale-[1.01]">
          {/* Abstract Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium mb-4">
              <ScanLine className="h-3 w-3" />
              <span>AI Powered</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Digitalize your invoices instantly
            </h3>
            <p className="text-white/80 mb-8 text-lg">
              Scan any paper bill or invoice. Our AI will automatically update your Khata ledger and inventory.
            </p>
            <Link href="/scanner" className="bg-white text-primary hover:bg-slate-50 font-bold py-4 px-8 rounded-lg shadow-xl inline-flex items-center gap-3 transition-all transform group-hover:translate-x-1 w-fit">
              <ScanLine className="h-5 w-5" />
              <span>New AI Scan</span>
            </Link>
          </div>
        </div>

        {/* Card B: Real-time Sales Graph */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-2 p-6 flex flex-col h-full bg-white dark:bg-[#132a23] border-primary/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Sales Overview</h3>
              <p className="text-xs text-slate-400 mt-1">Real-time performance</p>
            </div>
            <select className="text-xs border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1.5 px-3 focus:ring-primary focus:border-primary">
              <option>Last 24 Hours</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">₹12,450</span>
            <span className="text-sm font-medium text-green-500 flex items-center bg-green-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </span>
          </div>
          {/* Chart Representation */}
          <div className="flex-1 flex items-end gap-2 h-40 mt-auto pt-4 border-b border-l border-slate-100 dark:border-slate-800 relative">
             {/* Simple bars */}
             {['10am', '12pm', '2pm', '4pm', '6pm'].map((time, i) => (
                <div key={time} className="flex-1 flex flex-col justify-end group relative">
                   <div
                    className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm hover:bg-primary/30 transition-all"
                    style={{ height: `${[40, 65, 30, 85, 50][i]}%` }}
                   ></div>
                   <span className="text-[10px] text-slate-400 text-center mt-2">{time}</span>
                </div>
             ))}
             <div className="flex-1 flex flex-col justify-end group relative">
               <div className="w-full bg-primary rounded-t-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 relative" style={{ height: '70%' }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">Now</div>
               </div>
               <span className="text-[10px] text-slate-400 text-center mt-2">Now</span>
             </div>
          </div>
        </Card>

        {/* Card C: Top Debtors (Khata) */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 p-6 flex flex-col h-full min-h-[300px] bg-white dark:bg-[#132a23] border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-orange-400 rounded-full"></span>
              Top Debtors
            </h3>
            <Link href="/khata" className="text-xs text-primary font-medium hover:underline">View All</Link>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Pending collections from loyal customers.</p>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
            {[
              { name: "Vijay Singh", initial: "VJ", due: "2 days ago", amount: "4,200" },
              { name: "Anita Roy", initial: "AR", due: "Today", amount: "1,850" },
              { name: "Mohan K.", initial: "MK", due: "Tomorrow", amount: "920" },
            ].map((debtor, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-orange-100 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold">
                    {debtor.initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{debtor.name}</p>
                    <p className="text-[10px] text-slate-400">Due: {debtor.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">₹{debtor.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card D: Inventory Alerts */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-1 p-6 flex flex-col h-full min-h-[300px] bg-white dark:bg-[#132a23] border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-red-500 rounded-full"></span>
              Low Stock
            </h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">3 Items</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Urgent reorders needed.</p>
          <div className="flex-1 space-y-3">
            {[
              { name: "Basmati Rice (5kg)", left: 2, percent: 10 },
              { name: "Sunflower Oil (1L)", left: 5, percent: 25 },
            ].map((item, i) => (
              <div key={i} className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:border-red-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                  <span className="text-xs font-bold text-red-500">{item.left} Left</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mb-2">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
                <button className="w-full py-1 text-xs text-center border border-slate-200 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Reorder Now</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Card E: Quick Stats (Bottom Row filler) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#132a23] p-4 rounded-xl border border-primary/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Invoices</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">1,204</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#132a23] p-4 rounded-xl border border-primary/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">New Customers</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">+24 <span className="text-xs font-normal text-green-500">this week</span></p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#132a23] p-4 rounded-xl border border-primary/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending Khata</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">₹15,400</p>
            </div>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-dashed border-primary/30 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors text-primary group">
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" />
            <span className="font-medium">Add Widget</span>
          </div>
        </div>
      </div>
    </div>
  )
}
