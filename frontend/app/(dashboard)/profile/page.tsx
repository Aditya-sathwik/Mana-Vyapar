"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Store, MapPin, Phone, Save, Camera } from "lucide-react"

export default function MerchantProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shop Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your store details and preferences.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shop Image */}
        <Card className="md:col-span-1 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeIJyysNXnJXd-ug5w42t5vjA61tUNjMoGio-Q2ov22mif2Frdq2B37DqUrtMCU_ICINlMlUNBnUT-3SCg0wL0PS6dtw5xxte0zjSgGkkVsidwnvJTrmluNeNsU_6g67TQeUVfl-TejORiEyGHwJmESIJAhk-SyfDX3JiJ0bQX0aeNE-yzBxaKsQWuFElSbenVB2WSZrmaEOs-S8PRNflkGm0Z_pnqDSJp-mwpJruPuT-uPIwITapcF_Nb-LaWiJodPJClRwZ7XI4"
                alt="Shop"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Change Photo</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sri Lakshmi General Stores</h2>
            <p className="text-slate-500 text-sm">Since 2018</p>
          </CardContent>
        </Card>

        {/* Shop Details Form */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Visible to your customers on invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input defaultValue="Sri Lakshmi General Stores" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input defaultValue="+91 98765 43210" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input defaultValue="12-4-1, MG Road, Vijayawada, AP" className="pl-9" />
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">GSTIN (Optional)</label>
                 <Input placeholder="29ABCDE1234F1Z5" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                 <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                   <option>Grocery & Kirana</option>
                   <option>Medical Store</option>
                   <option>Electronics</option>
                 </select>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
