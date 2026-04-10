"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api-client"

export interface DashboardData {
  storeInfo: {
    name: string;
    storeId: string;
    marketRank: string;
    revenueGrowth: number;
  };
  totalSales: number;
  totalOrders: number;
  todayRevenue: number;
  khataSummary: {
    totalOutstanding: number;
    activeAccounts: number;
  };
  lowStockCount: number;
  topProducts: Array<{
    _id: string;
    name: string;
    unitsSold: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    _id: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/dashboard/summary")
      if (response.success) {
        setData(response.data)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to fetch dashboard summary")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, loading, error, refreshDashboard: fetchDashboard }
}
