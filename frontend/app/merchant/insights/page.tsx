"use client"

import { useState, useEffect } from "react"
import { 
    TrendingUp, 
    Users, 
    ArrowUpRight, 
    ArrowDownRight, 
    Target, 
    Zap, 
    Calendar,
    Filter,
    Download,
    PieChart,
    BarChart3,
    Activity,
    ShieldCheck,
    AlertCircle,
    ShoppingBag
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"

// 🎨 Premium Theme Colors
const COLORS = {
    primary: "#10b981",    // Emerald
    secondary: "#6366f1",  // Indigo
    accent: "#f43f5e",     // Rose
    warning: "#f59e0b",    // Amber
    info: "#3b82f6",       // Blue
}

export default function InsightsPage() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [timeframe, setTimeframe] = useState('weekly')

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await apiFetch("/insights/merchant")
                if (response.success) {
                    setData(response.data)
                }
            } catch (error: any) {
                toast.error("Failed to sync intelligence stream")
            } finally {
                setLoading(false)
            }
        }
        fetchInsights()
    }, [])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Activity className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Synchronizing Advanced Intelligence</p>
            </div>
        )
    }

    // 🧬 Process Chart Data
    const trendData = data?.revenueTrend?.[timeframe] || []
    const customerSegments = [
        { name: 'Loyal', value: data?.customerSegments?.loyal || 0, color: COLORS.primary },
        { name: 'High Value', value: data?.customerSegments?.highValue || 0, color: COLORS.secondary },
        { name: 'At Risk', value: data?.customerSegments?.atRisk || 0, color: COLORS.accent },
        { name: 'New', value: data?.customerSegments?.new || 0, color: COLORS.info },
    ].filter(s => s.value > 0)

    const predictions = data?.demandPredictions || []

    return (
        <div className="space-y-12 pb-24">
            {/* 🛸 Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck className="h-3 w-3" />
                        Intelligence Grade: Enterprise
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
                        Business <span className="text-primary italic">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">Predictive Analytics & Real-time Trends</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-muted p-1 rounded-2xl border border-border">
                        {['daily', 'weekly', 'monthly'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    timeframe === t ? "bg-card text-primary shadow-xl border border-border" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="h-12 w-12 flex items-center justify-center bg-muted border border-border rounded-xl text-muted-foreground hover:text-primary transition-all">
                        <Download className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* 📊 Core KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Gross Revenue", val: `₹${(data?.totalRevenue || 0).toLocaleString()}`, trend: "+12.4%", icon: TrendingUp, color: "emerald" },
                    { label: "Active Customers", val: (data?.totalCustomers || 0).toString(), trend: "+5.2%", icon: Users, color: "indigo" },
                    { label: "Average Order", val: `₹${(data?.avgOrderValue || 0).toLocaleString()}`, trend: "-2.1%", icon: Target, color: "blue" },
                    { label: "Growth Velocity", val: "84%", trend: "Optimal", icon: Zap, color: "rose" },
                ].map((kpi, i) => (
                    <Card key={i} className="p-8 border-border bg-card/30 backdrop-blur-xl group hover:border-primary/30 transition-all overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", `bg-${kpi.color}-500/10 text-${kpi.color}-500`)}>
                                    <kpi.icon className="h-6 w-6" />
                                </div>
                                <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg", kpi.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                                    {kpi.trend}
                                </span>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                            <h3 className="text-3xl font-black tabular-nums tracking-tighter">{kpi.val}</h3>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <kpi.icon className="h-24 w-24" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* 📈 Main Performance Curve */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 p-8 border-border bg-card group min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Activity className="h-5 w-5 text-primary" />
                                Revenue Performance Curve
                            </h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Financial trajectory based on transaction nodes</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest mr-4">
                                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Current</div>
                                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-indigo-500 opacity-30" /> Forecast</div>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.1} vertical={false} />
                                <XAxis 
                                    dataKey="_id" 
                                    stroke="#888888" 
                                    fontSize={10} 
                                    fontWeight="bold"
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => val.toString().slice(-5)}
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={10} 
                                    fontWeight="bold"
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#18181b', 
                                        border: '1px solid #27272a',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        color: '#ffffff'
                                    }}
                                    itemStyle={{ color: COLORS.primary }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke={COLORS.primary} 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#revenueGradient)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 🎯 Customer Segmentation */}
                <Card className="lg:col-span-4 p-8 border-border bg-card relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-8">
                            <PieChart className="h-5 w-5 text-indigo-500" />
                            Client Segments
                        </h3>

                        <div className="space-y-10">
                            {customerSegments.map((segment, index) => {
                                const total = customerSegments.reduce((acc, curr) => acc + curr.value, 0)
                                const percentage = total > 0 ? Math.round((segment.value / total) * 100) : 0

                                return (
                                    <div key={segment.name} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{segment.name}</p>
                                                <h4 className="text-2xl font-black">{segment.value} <span className="text-[10px] text-muted-foreground">profiles</span></h4>
                                            </div>
                                            <div className={cn("px-2 py-1 rounded-lg text-[10px] font-black", `bg-${segment.color}/10`)} style={{ color: segment.color }}>
                                                {percentage}%
                                            </div>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: index * 0.2 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: segment.color }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <button className="w-full mt-12 py-4 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10">
                            Launch CRM Campaign
                        </button>
                    </div>
                </Card>
            </div>

            {/* 🔮 Predictive Demand & Stock Alerts */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-warning" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">Demand Predictions</h3>
                    <div className="h-px flex-1 bg-border/50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {predictions.length > 0 ? (
                        predictions.slice(0, 6).map((item: any, i: number) => (
                            <Card key={i} className="p-6 border-border bg-card/50 hover:border-warning/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:border-warning/30 transition-colors">
                                        <ShoppingBag className="h-6 w-6 text-muted-foreground group-hover:text-warning transition-colors" />
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        item.stockStatus === 'CRITICAL' ? "bg-rose-500/10 text-rose-500 animate-pulse" : "bg-warning/10 text-warning"
                                    )}>
                                        {item.stockStatus}
                                    </div>
                                </div>
                                <h4 className="text-lg font-black tracking-tight mb-1 truncate">{item.name}</h4>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
                                    Velocity: {item.velocity.toFixed(2)} units / day
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground">Projected Depletion</span>
                                        <span className="text-foreground">{new Date(item.projectedRunOutDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className={cn("h-full rounded-full", item.stockStatus === 'CRITICAL' ? "bg-rose-500" : "bg-warning")}
                                            style={{ width: `${Math.min(100, (item.currentStock / 50) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                                        <span>Current: {item.currentStock}</span>
                                        <span>Buffer: {Math.ceil(item.velocity * 7)} units</span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full p-20 flex flex-col items-center justify-center border-dashed border-border/50 bg-muted/5 opacity-50 space-y-4">
                            <AlertCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Not enough data for predictions</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
