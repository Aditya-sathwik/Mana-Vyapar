"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Shield, Save } from "lucide-react"

export default function AdminProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Super Admin Profile</h1>
        <Button className="bg-primary hover:bg-primary-dark">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-[#1E293B] border-slate-700">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-slate-700 overflow-hidden mb-4 ring-4 ring-primary/20">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5QGtyS46ffXJmtiUOY-Mq-cEmOc7FePMAok4tf6sm3G4X7oW97TivKVxOLQ0NsUlEoQN7-oYfr5cpdKMJrOd6mD19rgvD6Z1yTasNnlhUUAu47Jw6vXSJ40yql6yHWPvUFNA3qE9kwyQA0B_TOvtUhEgBDXKwxCi9bsIJMP5rRhX15jNJr35xjlrXSycBVedLuDD4lJ0Swodp1ogo0-Sbnysa4H65Ujorz0BV-0X3HiLMw-Kf_TMQjxRGw9xjO1WkdjtItytNu-A" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-white">Super Admin</h2>
            <p className="text-slate-400 text-sm">System Administrator</p>
            <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
              <Shield className="h-3 w-3" />
              Super User Access
            </div>
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card className="md:col-span-2 bg-[#1E293B] border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input defaultValue="Super Admin" className="pl-9 bg-[#0F172A] border-slate-600 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input defaultValue="admin@manavyapar.com" className="pl-9 bg-[#0F172A] border-slate-600 text-white" />
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Security</h3>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
