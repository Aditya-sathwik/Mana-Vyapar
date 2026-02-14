"use client"

import {
  BarChart3,
  Store,
  CreditCard,
  ScanLine,
  Timer,
  TrendingUp,
  Bolt,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Health Overview</h1>
          <p className="text-slate-400 mt-1">Real-time insights into merchants, revenue, and system performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors">
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Active Merchants</p>
              <h3 className="text-3xl font-bold text-white mt-1">1,240</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-primary">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded mr-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              12%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Monthly Recurring Revenue</p>
              <h3 className="text-3xl font-bold text-white mt-1">$42,500</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded mr-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              8.5%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">AI Scans Processed</p>
              <h3 className="text-3xl font-bold text-white mt-1">84.2K</h3>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <ScanLine className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-indigo-400 font-medium bg-indigo-500/10 px-1.5 py-0.5 rounded mr-2">
              <Bolt className="h-3 w-3 mr-1" />
              High Load
            </span>
            <span className="text-slate-500">Last 24 hours</span>
          </div>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Avg. Response Time</p>
              <h3 className="text-3xl font-bold text-white mt-1">1h 45m</h3>
            </div>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Timer className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded mr-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              15m
            </span>
            <span className="text-slate-500">SLA Breach Risk</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Support Ticket Queue */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Support Ticket Queue</h2>
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">Live</span>
            </div>
            {/* Filters placeholder */}
            <div className="flex gap-2">
               {/* Simplified select */}
               <div className="bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300">All Status</div>
               <div className="bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300">Highest Priority</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#162032] text-xs uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="px-5 py-3 border-b border-slate-700">ID</th>
                  <th className="px-5 py-3 border-b border-slate-700">Merchant</th>
                  <th className="px-5 py-3 border-b border-slate-700">Issue</th>
                  <th className="px-5 py-3 border-b border-slate-700">Status</th>
                  <th className="px-5 py-3 border-b border-slate-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-500">#1024</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">Kirana Mart</div>
                    <div className="text-xs text-slate-500">Delhi, India</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-200">Ledger Sync Failure</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/20">Open</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">View</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-500">#1023</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">Sharma Textiles</div>
                    <div className="text-xs text-slate-500">Mumbai, India</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-200">AI Scanner Error</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/20">Pending</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">View</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-500">#1022</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">The Daily Needs</div>
                    <div className="text-xs text-slate-500">Bangalore, India</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-200">Invoice Download</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">Resolved</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Operational Stats & Alerts */}
        <div className="flex flex-col gap-6">
          {/* Map Placeholder */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700 shadow-sm p-5 h-64 flex flex-col relative overflow-hidden">
            <h3 className="font-bold text-white mb-4 relative z-10">Live Merchant Activity</h3>
            <div className="absolute inset-0 top-12 m-4 rounded-lg bg-[#0F172A] border border-slate-700/50 flex items-center justify-center group cursor-pointer">
               {/* Simplified Abstract Map */}
               <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
               <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-medium text-slate-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-black/70 transition-colors">View Interactive Map</span>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700 shadow-sm p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Recent Alerts</h3>
              <button className="text-primary text-xs font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Bolt className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Server Latency High</p>
                  <p className="text-xs text-slate-500">Asia-South-1 region &gt;300ms</p>
                  <p className="text-[10px] text-slate-600 mt-1">10 mins ago</p>
                </div>
              </div>
              <div className="flex gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Gateway Timeout</p>
                  <p className="text-xs text-slate-500">UPI failure spikes</p>
                  <p className="text-[10px] text-slate-600 mt-1">45 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
