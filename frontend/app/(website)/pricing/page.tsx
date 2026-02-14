"use client"

import { useState } from "react"
import { Check, X, Shield, CreditCard, QrCode, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 flex flex-col pt-20">

      {/* Header Section */}
      <header className="w-full py-12 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          Upgrade your <span className="text-primary">Vyapar</span> Today
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Select the perfect plan to digitize your shop, automate ledgers with AI, and grow your business effortlessly.
        </p>
      </header>

      {/* Pricing Toggle Section */}
      <div className="flex justify-center items-center gap-4 mb-16">
        <span className={cn("text-sm font-medium", billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>Monthly</span>
        <button
          onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
          className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="sr-only">Toggle billing cycle</span>
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
              billingCycle === "yearly" ? "translate-x-8 bg-primary" : "translate-x-1"
            )}
          />
        </button>
        <span className={cn("text-sm font-medium flex items-center gap-2", billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
          Yearly
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">Save 20%</span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">

          {/* Chhota Vyapar (Free) */}
          <div className="relative flex flex-col p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Chhota Vyapar</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Perfect for getting started with digital khata.</p>
            </div>
            <div className="mb-5 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">₹0</span>
              <span className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <ul className="mb-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300 flex-1">
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Digital Ledger (Khata)</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Basic PDF Reports</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Single User Access</li>
              <li className="flex gap-x-3 text-slate-400"><X className="h-5 w-5" /> No AI Scanning</li>
            </ul>
            <button className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-white transition-colors">
              Current Plan
            </button>
          </div>

          {/* Bada Vyapar (Pro) */}
          <div className="relative flex flex-col p-6 bg-white dark:bg-surface-dark rounded-xl border-2 border-primary shadow-lg scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white uppercase tracking-wide shadow-sm">
              Most Popular
            </div>
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-primary">Bada Vyapar</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Everything you need to automate your shop.</p>
            </div>
            <div className="mb-5 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">₹499</span>
              <span className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <ul className="mb-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300 flex-1">
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Everything in Chhota</li>
              <li className="flex gap-x-3 font-medium text-slate-900 dark:text-white"><Check className="h-5 w-5 text-primary" /> AI Bill Scanning</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> WhatsApp Payment Alerts</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Inventory Management</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> GST Reporting</li>
            </ul>
            <button className="w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
              Upgrade to Pro
            </button>
          </div>

          {/* Maha Vyapar (Enterprise) */}
          <div className="relative flex flex-col p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Maha Vyapar</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">For multi-outlet chains and franchises.</p>
            </div>
            <div className="mb-5 flex items-baseline">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Custom</span>
            </div>
            <ul className="mb-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300 flex-1">
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Everything in Bada</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Multi-outlet Management</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> Dedicated Account Manager</li>
              <li className="flex gap-x-3"><Check className="h-5 w-5 text-primary" /> API Access</li>
            </ul>
            <button className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Checkout Section (Simplified Visualization) */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Order Summary */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Order Summary</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Bada Vyapar Plan</h4>
                  <p className="text-sm text-slate-500">Monthly Billing</p>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">₹499.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tax (18% GST)</span>
                  <span className="font-medium text-slate-900 dark:text-white">₹89.82</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-primary">₹588.82</span>
                </div>
              </div>
            </div>

            {/* Payment Details Form */}
            <div className="lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Details</h3>
                <div className="flex space-x-2">
                  <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex space-x-4">
                  <button className="bg-primary/10 text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ring-1 ring-primary/20">
                    <CreditCard className="h-4 w-4" /> Card
                  </button>
                  <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                    <QrCode className="h-4 w-4" /> UPI
                  </button>
                  <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                    <Landmark className="h-4 w-4" /> Netbanking
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="card-number" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Card number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="card-number"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-slate-300 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white py-2.5"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="name-on-card" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name on card</label>
                    <div className="mt-1">
                      <input type="text" id="name-on-card" className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-slate-300 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white py-2.5" placeholder="John Doe" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Expiration date</label>
                    <div className="mt-1">
                      <input type="text" id="expiration-date" className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-slate-300 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white py-2.5" placeholder="MM / YY" />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 dark:text-slate-300">CVC</label>
                    <div className="mt-1">
                      <input type="text" id="cvc" className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-slate-300 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white py-2.5" placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Shield className="h-4 w-4 text-green-500 mr-1" />
                    Secured by SSL
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto transition-all">
                    Pay ₹588.82
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
