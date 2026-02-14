"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"

const merchants = [
  { id: 1, name: "Kirana Mart", location: "Delhi", status: "Active", joined: "2 days ago", revenue: "₹45,000" },
  { id: 2, name: "Sharma Textiles", location: "Mumbai", status: "Pending", joined: "5 hours ago", revenue: "₹0" },
  { id: 3, name: "Green Fresh", location: "Pune", status: "Active", joined: "1 week ago", revenue: "₹12,500" },
]

export default function MerchantManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Merchant Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input className="w-full bg-[#1E293B] border border-slate-700 rounded-lg pl-9 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="Search merchants..." />
        </div>
      </div>

      <Card className="bg-[#1E293B] border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-500 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/50">
                  <td className="py-4 px-4 font-medium text-white">{m.name}</td>
                  <td className="py-4 px-4">{m.location}</td>
                  <td className="py-4 px-4">
                    {m.status === "Active" ? (
                      <span className="flex items-center text-emerald-400 gap-1"><CheckCircle className="h-3 w-3" /> Active</span>
                    ) : (
                      <span className="flex items-center text-amber-400 gap-1"><XCircle className="h-3 w-3" /> Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-4">{m.joined}</td>
                  <td className="py-4 px-4 text-right">{m.revenue}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-slate-400 hover:text-white"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
