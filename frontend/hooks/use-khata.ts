"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api-client"

export interface KhataAccount {
  _id: string;
  customerName: string;
  customerPhoneNumber: string;
  balance: number;
  isActive: boolean;
  updatedAt: string;
}

export function useKhata() {
  const [khataAccounts, setKhataAccounts] = useState<KhataAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKhata = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      const url = search ? `/khata?search=${search}` : "/khata"
      const response = await apiFetch(url)
      if (response.success) {
        setKhataAccounts(response.data)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to fetch Khata list")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKhata()
  }, [fetchKhata])

  const addCustomer = async (customerData: Record<string, unknown>) => {
    try {
      const response = await apiFetch("/khata", {
        method: "POST",
        body: JSON.stringify(customerData),
      });
      
      if (response.success) {
        await fetchKhata();
        return response.data;
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  return { khataAccounts, loading, error, refreshKhata: fetchKhata, addCustomer }
}
