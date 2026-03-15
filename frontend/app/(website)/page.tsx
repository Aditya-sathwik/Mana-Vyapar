import Link from "next/link"
import {
  ScanLine,
  Wallet,
  Package,
  Store,
  User,
  Lock,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Users
} from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white dark:bg-[#09090b]">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-widest mb-8 shadow-2xl">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                Live: Vision AI 2.0 Deployment
              </div>
              <h1 className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase mb-8">
                The Future <br /> of Your <span className="text-primary italic">Dukaan</span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium max-w-xl">
                Bridge the physical-digital divide. Use <span className="text-primary font-black uppercase tracking-widest">Chitti AI</span> to orchestrate your shop with neural precision. No tech expertise needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                 <Link href="/dashboard" className="h-16 flex items-center justify-center gap-3 px-10 bg-primary hover:bg-primary-dark text-black rounded-[2rem] font-black text-sm shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest">
                    Launch Mission Control
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <div className="flex items-center gap-4 px-8 border border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <div className="flex -space-x-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-[#09090b] bg-slate-200 dark:bg-slate-800" />
                       ))}
                    </div>
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">4.8k+ Trusted Merchants</p>
                 </div>
              </div>

              {/* Trust Grid */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100 dark:border-slate-800">
                 <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">99.2%</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AI Accuracy</p>
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">124ms</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cloud Latency</p>
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">No-Code</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Integration</p>
                 </div>
              </div>
            </div>

            {/* Right Registration Hub */}
            <div className="relative group">
               <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
               <div className="relative bg-white dark:bg-[#09090b] border border-primary/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                  <div className="h-56 relative group/img overflow-hidden">
                     <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeIJyysNXnJXd-ug5w42t5vjA61tUNjMoGio-Q2ov22mif2Frdq2B37DqUrtMCU_ICINlMlUNBnUT-3SCg0wL0PS6dtw5xxte0zjSgGkkVsidwnvJTrmluNeNsU_6g67TQeUVfl-TejORiEyGHwJmESIJAhk-SyfDX3JiJ0bQX0aeNE-yzBxaKsQWuFElSbenVB2WSZrmaEOs-S8PRNflkGm0Z_pnqDSJp-mwpJruPuT-uPIwITapcF_Nb-LaWiJodPJClRwZ7XI4" 
                      alt="Digital Duukan" 
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 grayscale-[0.2]"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
                     <div className="absolute bottom-8 left-8">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Merchant Hub</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-widest">Onboarding Protocol Active</p>
                     </div>
                  </div>

                  <div className="p-10 space-y-6">
                     <div className="space-y-4">
                        <div className="group/field relative">
                           <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/field:text-primary transition-colors" />
                           <input type="text" placeholder="Full Merchant Shop Name" className="w-full h-14 pl-14 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-500 uppercase tracking-tighter" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <input type="text" placeholder="Owner" className="w-full h-14 pl-14 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-500" />
                           </div>
                           <select className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                              <option>Grocery</option>
                              <option>Medical</option>
                              <option>Hardware</option>
                           </select>
                        </div>
                        <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <span className="text-[10px] font-black text-slate-400">IN</span>
                             <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                           </div>
                           <input type="tel" placeholder="Mobile 98765-43210" className="w-full h-14 pl-16 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-500 uppercase tracking-tighter" />
                        </div>
                     </div>

                     <button className="w-full h-16 bg-primary hover:bg-primary-dark text-black rounded-3xl font-black text-sm shadow-xl shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] uppercase tracking-widest flex items-center justify-center gap-3">
                        <Zap className="h-5 w-5" />
                        Initialize Free Trial
                     </button>

                     <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Lock className="h-3 w-3 text-emerald-500" /> End-to-End Encryption Sharded
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 relative bg-slate-50 dark:bg-slate-950/20">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-24">
               <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">Neural Shop <span className="text-primary not-italic">Capabilites</span></h2>
               <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">Advanced infrastructure for the local duukan. Orchestrated for hyper-local growth.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { title: "AI Core Scanning", icon: ScanLine, desc: "Scan physical bills with neural accuracy. Auto-updates and inventory parity." },
                 { title: "Credit Orchestration", icon: Wallet, desc: "Digitalize your khata with automated WhatsApp recovery protocols." },
                 { title: "Smart Inventory", icon: Package, desc: "Predictive restock alerts powered by real-time market throughput sync." },
               ].map((feature, i) => (
                  <div key={i} className="group p-10 bg-white dark:bg-[#09090b] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-2xl">
                     <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                        <feature.icon className="h-8 w-8" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">{feature.title}</h3>
                     <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">{feature.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-20 border-t border-slate-100 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg">
                  <Store className="h-6 w-6" />
               </div>
               <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mana Vyapar</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <a href="#" className="hover:text-primary transition-colors">Privacy Paradigm</a>
               <a href="#" className="hover:text-primary transition-colors">Protocol Terms</a>
               <a href="#" className="hover:text-primary transition-colors">Global Support</a>
            </div>
            <p className="text-[10px] font-bold text-slate-400 italic">© 2023 Mana Vyapar Solutions Hub. All nodes active.</p>
         </div>
      </footer>
    </main>
  )
}
