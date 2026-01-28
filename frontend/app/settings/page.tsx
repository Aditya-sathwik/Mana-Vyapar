"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Store, 
  User, 
  ShieldCheck, 
  Bell, 
  Globe, 
  LogOut,
  Save
} from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = React.useState("profile")

  const tabs = [
    { id: "profile", label: t('profile') || "Profile", icon: User },
    { id: "store", label: t('store_settings') || "Store", icon: Store },
    { id: "notifications", label: t('notifications') || "Notifications", icon: Bell },
    { id: "security", label: t('security') || "Security", icon: ShieldCheck },
  ]

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-1">{t('settings')}</h1>
          <p className="text-muted-foreground">{t('settings_subtitle') || "Manage your account and preferences."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <Card className="h-fit bg-card border-border">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeTab === tab.id 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                {activeTab === "profile" && (t('profile_details') || "Profile Details")}
                {activeTab === "store" && (t('store_information') || "Store Information")}
                {activeTab === "notifications" && (t('notification_preferences') || "Notification Preferences")}
                {activeTab === "security" && (t('security_settings') || "Security Settings")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeTab === "profile" && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Full Name</Label>
                      <Input defaultValue={user?.fullname} className="bg-muted border-border text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Email Address</Label>
                      <Input defaultValue={user?.email} disabled className="bg-muted/50 border-border text-muted-foreground cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Username</Label>
                      <Input defaultValue={user?.username} className="bg-muted border-border text-foreground" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="gap-2">
                      <Save className="h-4 w-4" /> Save Changes
                    </Button>
                  </div>
                </>
              )}

              {activeTab === "store" && (
                <div className="text-center py-10">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Store settings coming soon...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-red-500 font-bold">Log Out</h3>
                <p className="text-red-500/70 text-sm">End your current session safely.</p>
              </div>
              <Button variant="destructive" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
