"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Store, MapPin, Phone, Save, Camera } from "lucide-react"

export default function MerchantProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shop Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your store details and preferences.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shop Image */}
        <Card className="md:col-span-1 border-border bg-card">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-muted mb-4 flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                alt="Shop"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Change Photo</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-foreground">Sri Lakshmi General Stores</h2>
            <p className="text-muted-foreground text-sm">Since 2018</p>
          </CardContent>
        </Card>

        {/* Shop Details Form */}
        <Card className="md:col-span-2 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Business Information</CardTitle>
            <CardDescription className="text-muted-foreground">Visible to your customers on invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="Sri Lakshmi General Stores" className="pl-9 bg-muted border-border text-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="+91 98765 43210" className="pl-9 bg-muted border-border text-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="12-4-1, MG Road, Vijayawada, AP" className="pl-9 bg-muted border-border text-foreground" />
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-foreground/80">GSTIN (Optional)</label>
                 <Input placeholder="29ABCDE1234F1Z5" className="bg-muted border-border text-foreground" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-foreground/80">Category</label>
                 <select className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
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
