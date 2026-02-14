"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "24.5K", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { title: "Revenue", value: "$1.2M", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Active Now", value: "3,400", icon: Activity, color: "text-rose-400", bg: "bg-rose-500/10" },
          { title: "Growth", value: "+18%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1E293B] border-slate-700">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1E293B] border-slate-700 h-80 flex items-center justify-center">
          <p className="text-slate-500">Revenue Chart Placeholder</p>
        </Card>
        <Card className="bg-[#1E293B] border-slate-700 h-80 flex items-center justify-center">
          <p className="text-slate-500">User Growth Chart Placeholder</p>
        </Card>
      </div>
    </div>
  )
}
