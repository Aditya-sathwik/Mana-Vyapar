import Link from "next/link"
import {
  ScanLine,
  Wallet,
  Package,
  Store,
  User,
  Phone,
  Lock,
  Star
} from "lucide-react"

export default function LandingPage() {
  return (
    <main className="pt-20 lg:pt-28 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 pt-10 lg:pt-0 mb-12 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              New: AI Chitti Scanning 2.0
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Digitalize Your <span className="text-primary">Dukaan</span> in Seconds
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Say goodbye to paper clutter. Use <strong>AI Chitti</strong> to scan paper bills and instantly update your digital ledger. Manage inventory, track credits, and grow your business without typing a single word.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-8 items-center border-t border-slate-200 dark:border-slate-700 pt-8 mt-8">
              <div>
                <div className="flex -space-x-2 mb-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0f172a] bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <img src={`https://lh3.googleusercontent.com/aida-public/AB6AXuAA8hdb5PlGGldJq5Os1zqxfGGFgSXs2xRloqS7VQtdw_GKUuWgK9k6u6_5qs_AOaRhP-cyknTBX93BrNjJxj-5lZrfEvYV9QeN6EBkzMO4GThF3SJ2nF1A4qh5fcahZXZNrdmzODdCr-_mx4iEt5h8aWJ--5a_q-iN1Q0jM9-TRcMLybCZiuAjuW1V4qOYzfN4Rjkfri1KfpDY7ys-vAziiBaVO8O25SVJg_3LA0E6JAAr79HODybN3gFdfvl68GiCPyZCksK0Otc`} alt="User" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0f172a] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">+2k</div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Happy Merchants</p>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div>
                <div className="flex items-center gap-1 mb-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current opacity-50" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">4.8/5 App Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
              <div className="relative h-48 bg-slate-50 dark:bg-slate-900 overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5"></div>
                <img alt="Digital Shop" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeIJyysNXnJXd-ug5w42t5vjA61tUNjMoGio-Q2ov22mif2Frdq2B37DqUrtMCU_ICINlMlUNBnUT-3SCg0wL0PS6dtw5xxte0zjSgGkkVsidwnvJTrmluNeNsU_6g67TQeUVfl-TejORiEyGHwJmESIJAhk-SyfDX3JiJ0bQX0aeNE-yzBxaKsQWuFElSbenVB2WSZrmaEOs-S8PRNflkGm0Z_pnqDSJp-mwpJruPuT-uPIwITapcF_Nb-LaWiJodPJClRwZ7XI4"/>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/80 to-transparent">
                  <h3 className="text-white font-bold text-xl">Merchant Registration</h3>
                  <p className="text-slate-200 text-sm">Join Mana Vyapar Today</p>
                </div>
              </div>
              <div className="p-6 lg:p-8">
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shop Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-slate-400" />
                      </div>
                      <input className="pl-10 block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11" placeholder="e.g. Sri Lakshmi General Stores" type="text"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Owner Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input className="pl-10 block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11" placeholder="Your Name" type="text"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                      <select className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11">
                        <option>Grocery</option>
                        <option>Medical</option>
                        <option>Textiles</option>
                        <option>Hardware</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                    <div className="flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sm:text-sm font-medium">
                        +91
                      </span>
                      <input className="flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-11" placeholder="98765 43210" type="tel"/>
                    </div>
                  </div>
                  <Link href="/dashboard" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-2">
                    Start My Free Trial
                  </Link>
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3 text-primary" />
                    Your data is 100% Secure & Encrypted
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScanLine className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">AI Smart Scan</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Instantly convert handwritten lists into digital inventory. 99% accuracy on Telugu & English text.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Digital Ledger</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Track every rupee. Send automatic WhatsApp reminders for payments and manage Udhaar easily.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Inventory Alert</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Never run out of stock. Get smart alerts when your essential items are running low.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
