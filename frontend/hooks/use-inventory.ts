"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api-client"

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
  sku?: string;
  brand?: string;
  images: { url: string; isPrimary: boolean }[];
  lowStockThreshold: number;
}

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      const url = search ? `/products?search=${search}` : "/products"
      const response = await apiFetch(url)
      if (response.success) {
        setProducts(response.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventory")
    } finally {
      setLoading(false)
    }
  }, [])

  const addProduct = async (formData: FormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when using FormData; the browser will set it with the boundary
        credentials: "include",
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add product");
      
      await fetchInventory();
      return result.data;
    } catch (err: any) {
      throw err;
    }
  };

  return { products, loading, error, refreshInventory: fetchInventory, addProduct }
}
