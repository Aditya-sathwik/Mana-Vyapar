"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api-client"

export interface KhataTransaction {
  _id: string;
  transactionId: string;
  date: string;
  type: "Credit" | "Debit" | "Payment Received" | "Payment Made";
  amount: number;
  description: string;
  balanceAfter: number;
}

export interface KhataAccount {
  _id: string;
  name: string;
  phone: string;
  customerEmail?: string;
  balance: number;
  isActive: boolean;
  updatedAt: string;
  transactions?: KhataTransaction[];
}

export function useKhata() {
  const [khataAccounts, setKhataAccounts] = useState<KhataAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  const [page, setPage] = useState(1)

  const fetchKhata = useCallback(async (search?: string, pageNum: number = 1) => {
    try {
      setLoading(true)
      let url = `/khata?page=${pageNum}&limit=15`
      if (search) url += `&search=${search}`
      
      const response = await apiFetch(url)
      if (response && response.success) {
        setKhataAccounts(response.data?.customers || [])
        setPagination(response.data?.pagination)
        setPage(pageNum)
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
      
      if (response && response.success) {
        await fetchKhata(undefined, 1);
        return response.data;
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  const getCustomerDetails = async (khataId: string) => {
     try {
        const response = await apiFetch(`/khata/${khataId}`);
        if (response && response.success) {
           return response.data;
        }
     } catch (err: unknown) {
        throw err;
     }
  }

  const performTransaction = async (khataId: string, transactionData: { 
     amount: number, 
     type: string, 
     description?: string,
     paymentMethod?: string
  }) => {
     try {
        const response = await apiFetch(`/khata/${khataId}/transaction`, {
           method: "POST",
           body: JSON.stringify(transactionData)
        });
        if (response && response.success) {
           await fetchKhata(undefined, page);
           return response.data;
        }
     } catch (err: unknown) {
        throw err;
     }
  }

  return { 
    khataAccounts, 
    loading, 
    error, 
    pagination,
    page,
    setPage,
    refreshKhata: fetchKhata, 
    addCustomer,
    getCustomerDetails,
    performTransaction
  }
}
