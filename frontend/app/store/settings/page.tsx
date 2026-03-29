'use client';

import React from 'react';
import Image from 'next/image';
import { 
  User, Shield, Bell, CreditCard, Edit2, Lock, ShieldCheck, 
  MessageSquare, Smartphone, Mail, MoreHorizontal, Plus 
} from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';

export default function StoreSettingsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-7xl">
      {/* Hero Header */}
      <header className="mb-16 md:mb-20 relative">
        <SlideUp>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl shadow-2xl"></div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tighter leading-tight mb-4 text-foreground relative z-10">
            Account Settings
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed relative z-10 font-medium">
            Manage your Mana Vyapar profile, security preferences, and billing details in one centralized gallery.
          </p>
        </SlideUp>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Side Navigation (In-Page) */}
        <aside className="lg:col-span-3">
          <SlideUp delay={0.1}>
            <nav className="space-y-2 sticky top-[100px]">
              <a className="flex items-center gap-4 px-6 py-4 rounded-xl bg-card text-primary font-bold shadow-sm border border-primary/20 transition-all scale-[1.02]" href="#personal">
                <User className="w-5 h-5 shrink-0" />
                Personal Info
              </a>
              <a className="flex items-center gap-4 px-6 py-4 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm font-medium transition-all" href="#security">
                <Shield className="w-5 h-5 shrink-0" />
                Security
              </a>
              <a className="flex items-center gap-4 px-6 py-4 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm font-medium transition-all" href="#notifications">
                <Bell className="w-5 h-5 shrink-0" />
                Notifications
              </a>
              <a className="flex items-center gap-4 px-6 py-4 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm font-medium transition-all" href="#billing">
                <CreditCard className="w-5 h-5 shrink-0" />
                Billing
              </a>
            </nav>
          </SlideUp>
        </aside>

        {/* Settings Content */}
        <div className="lg:col-span-9 space-y-24">
          {/* Section: Personal Information */}
          <section className="scroll-mt-32" id="personal">
            <SlideUp delay={0.2}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-[1.75rem] font-bold tracking-tight text-foreground">Personal Information</h2>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border/50">Primary Identity</span>
              </div>
              <div className="bg-card p-6 md:p-10 rounded-[2rem] border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 flex-start relative z-10">
                  <div className="relative isolate self-start">
                    <div className="relative w-32 h-32 rounded-[2rem] border-2 border-primary/30 shadow-lg shadow-primary/10 overflow-hidden bg-muted">
                      <Image 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
                        alt="Profile Picture" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground p-3 rounded-xl shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all text-sm border-2 border-card z-20">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground ml-1">Full Name</label>
                      <input className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all outline-none font-medium text-foreground shadow-sm" type="text" defaultValue="Arjun Sharma" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground ml-1">Display Name</label>
                      <input className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all outline-none font-medium text-foreground shadow-sm" type="text" defaultValue="arj_sharma" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground ml-1">Email Address</label>
                      <input className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all outline-none font-medium text-foreground shadow-sm" type="email" defaultValue="arjun@manavyapar.com" />
                    </div>
                    <div className="sm:col-span-2 pt-6">
                      <button className="bg-primary text-primary-foreground h-14 px-10 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-sm border border-primary-foreground/10 uppercase w-full sm:w-auto">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SlideUp>
          </section>

          {/* Section: Security */}
          <section className="scroll-mt-32" id="security">
            <FadeIn>
              <h2 className="font-display text-[1.75rem] font-bold tracking-tight mb-8 text-foreground">Security & Protection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Password Card */}
                <div className="bg-card p-8 rounded-[2rem] border border-border/50 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                  <div>
                    <div className="w-14 h-14 bg-muted border border-border rounded-2xl flex items-center justify-center mb-6">
                      <Lock className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Password</h3>
                    <p className="text-muted-foreground text-sm mb-8 font-medium leading-relaxed">Last changed 3 months ago. We recommend a unique passphrase.</p>
                  </div>
                  <button className="w-full bg-muted border border-border text-foreground h-14 rounded-xl font-bold tracking-wide hover:bg-background hover:border-primary/50 transition-all text-sm uppercase">Change Password</button>
                </div>
                {/* 2FA Card */}
                <div className="bg-card p-8 rounded-[2rem] border border-l-[6px] border-primary flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px]"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                        <ShieldCheck className="w-7 h-7 text-primary" />
                      </div>
                      <span className="bg-primary hover:bg-primary border border-primary/20 text-primary-foreground text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-sm">Active</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Two-Factor Auth</h3>
                    <p className="text-muted-foreground text-sm mb-8 font-medium leading-relaxed">Securing your account with a secondary mobile verification layer.</p>
                  </div>
                  <button className="w-full bg-primary/10 border border-primary/20 text-primary h-14 rounded-xl font-bold tracking-wide hover:bg-primary hover:text-primary-foreground transition-all text-sm uppercase relative z-10">Manage 2FA</button>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Section: Notifications */}
          <section className="scroll-mt-32" id="notifications">
            <SlideUp>
              <h2 className="font-display text-[1.75rem] font-bold tracking-tight mb-8 text-foreground">Notification Preferences</h2>
              <div className="bg-muted/50 rounded-[2.5rem] p-2 md:p-3 border border-border">
                <div className="bg-card rounded-[2rem] p-6 md:p-10 space-y-8 shadow-sm">

                  {/* WhatsApp */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-4 md:gap-6 items-center">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20 shadow-inner">
                        <MessageSquare className="w-6 h-6 text-[#25D366]" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">WhatsApp Updates</p>
                        <p className="text-sm text-muted-foreground font-medium">Order tracking and merchant messages via WhatsApp</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner border border-border/50"></div>
                    </label>
                  </div>

                  {/* SMS Alerts */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-4 md:gap-6 items-center">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                        <Smartphone className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground font-medium">Critical security alerts and promotional codes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner border border-border/50"></div>
                    </label>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-4 md:gap-6 items-center">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
                        <Mail className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground font-medium">Weekly curation of top local picks and collections</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner border border-border/50"></div>
                    </label>
                  </div>

                </div>
              </div>
            </SlideUp>
          </section>

          {/* Section: Billing Details */}
          <section className="scroll-mt-32" id="billing">
            <SlideUp>
              <h2 className="font-display text-[1.75rem] font-bold tracking-tight mb-8 text-foreground">Billing & Payments</h2>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-card p-8 md:p-10 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                  <div className="flex justify-between items-center pb-6 border-b border-border/50">
                    <h3 className="font-display text-lg font-bold">Saved Payment Methods</h3>
                    <button className="text-primary font-bold text-sm hover:underline underline-offset-4 flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full"><Plus className="w-4 h-4"/> Add New</button>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-muted border border-border/50 hover:border-primary/30 transition-colors shadow-inner">
                    <div className="w-14 h-10 shrink-0 bg-[#000000] rounded-xl flex items-center justify-center border border-[#222222] shadow-sm">
                      <span className="text-white font-black text-[10px] italic tracking-tighter">VISA</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">Visa ending in 4242</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Expires 12/26</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground hover:bg-background p-2 rounded-xl transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="w-14 h-10 shrink-0 bg-background rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Plus className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground group-hover:text-primary font-bold transition-colors">Link a new card or UPI</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-[#004f36] p-8 md:p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">Current Plan</p>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight mb-8">Premium Merchant</h3>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <p className="font-display text-4xl lg:text-5xl font-bold tracking-tighter leading-none">₹2,499<span className="text-base lg:text-lg font-medium text-white/70">/mo</span></p>
                    <button className="w-full bg-white text-primary h-14 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all shadow-xl shadow-black/20 uppercase text-sm">Upgrade Plan</button>
                  </div>
                </div>
              </div>
            </SlideUp>
          </section>

          {/* Dangerous Zone */}
          <section className="pt-16 border-t border-border/50">
            <FadeIn>
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-red-600 dark:text-red-400 mb-2">Deactivate Account</h3>
                  <p className="text-red-600/70 dark:text-red-400/70 text-sm font-medium">Once you deactivate your account, there is no going back. Please be certain.</p>
                </div>
                <button className="w-full md:w-auto bg-background text-red-600 border border-red-500/30 px-8 py-4 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm tracking-wide uppercase text-sm shrink-0">
                  Deactivate Account
                </button>
              </div>
            </FadeIn>
          </section>

        </div>
      </div>
    </div>
  );
}
