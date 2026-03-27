"use client"

import Link from "next/link"
import {
  ScanLine,
  Wallet,
  Package,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Eye,
  Database,
  Smartphone,
  CheckCircle2
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { ThreeBackground } from "@/components/visuals/ThreeBackground"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const s1 = useRef<HTMLDivElement>(null)
  const s2 = useRef<HTMLDivElement>(null)
  const s3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on client
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // MASTER TIMELINE - Consolidates pinning and animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000", // Extra long scroll for 3 sentences
          scrub: 1, 
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        }
      })

      // STAGE 1: S1 visible initially. (0% - 25%)
      // Start push at 25%
      tl.to(s1.current, { y: -250, opacity: 0, scale: 0.9, duration: 1 }, 1)
      tl.to(s2.current, { y: 0, opacity: 1, duration: 1 }, 1)

      // STAGE 2: S2 visible. (25% - 50%)
      // Start push at 50%
      tl.to(s2.current, { y: -250, opacity: 0, scale: 0.9, duration: 1 }, 2.5)
      tl.to(s3.current, { y: 0, opacity: 1, duration: 1 }, 2.5)

      // STAGE 3: S3 visible (50% - end)
    })

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  return (
    <main className="relative selection:bg-primary/20 selection:text-primary">
      {/* 3D Background - Fixed */}
      <ThreeBackground />

      {/* Hero Orchestration - Stickiness is handled by GSAP Pinning */}
      <div ref={containerRef} className="relative w-full overflow-hidden flex items-center justify-center min-h-screen">
        <div className="h-full w-full flex items-center justify-center relative">
          
          {/* Sentence 1: Start at y: 0, opacity: 1 */}
          <div ref={s1} className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 w-full">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.35em] mb-14 border border-primary/20 backdrop-blur-md">
              <Zap className="h-3 w-3 fill-primary" />
              Vision AI 2.0 Now Live
            </div>
            <h1 className="text-[clamp(4rem,15vw,14rem)] font-black text-slate-900 dark:text-white leading-[0.82] tracking-tighter uppercase select-none text-center">
              Digitize <br />
              <span className="text-primary italic">Dukaan.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mt-12 leading-relaxed italic text-center">
              Modernize your retail workflow with neural-grade scanning and smart automation.
            </p>
          </div>

          {/* Sentence 2: Start at y: 250, opacity: 0 */}
          <div ref={s2} className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0 translate-y-[250px] z-10 w-full pointer-events-none">
            <h1 className="text-[clamp(4rem,11vw,11rem)] font-black text-slate-900 dark:text-white leading-[0.82] tracking-tighter uppercase select-none text-center">
              Automate <br />
              <span className="text-primary italic">Khata.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mt-12 leading-relaxed italic text-center">
              Automated credit recovery, real-time ledger updates, and zero manual entry.
            </p>
          </div>

          {/* Sentence 3: Start at y: 250, opacity: 0 */}
          <div ref={s3} className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0 translate-y-[250px] z-10 w-full pointer-events-none">
            <h1 className="text-[clamp(4rem,14vw,14rem)] font-black text-slate-900 dark:text-white leading-[0.82] tracking-tighter uppercase select-none text-center">
              Precision <br />
              <span className="text-primary italic">Scale.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mt-12 mb-16 leading-relaxed italic text-center">
              Neural demand forecasting and predictive inventory workflows for every duukandaar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pointer-events-auto">
              <Link
                href="/auth/register"
                className="group relative h-20 px-12 bg-primary hover:bg-primary-dark text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-4 transition-all duration-500 shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95"
              >
                <span>Initialize Protocol</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="h-20 px-12 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-sm flex items-center"
              >
                Watch Demo
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Grid */}
      <section className="py-60 relative z-20 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-3xl border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32"
          >
            <div className="max-w-3xl">
              <h2 className="text-[12px] font-black text-primary uppercase tracking-[0.5em] mb-8">Capabilities</h2>
              <h3 className="text-6xl lg:text-9xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
                Neural Shop <br/><span className="not-italic text-primary">Operations.</span>
              </h3>
            </div>
            <p className="text-2xl text-slate-500 font-medium max-w-sm italic leading-relaxed">
              Advanced infrastructure built for the hyper-local duukandaar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "Vision Scanning", 
                icon: ScanLine, 
                desc: "High-fidelity OCR engine with automated SKU mapping for physical receipts." 
              },
              { 
                title: "Liquid Assets", 
                icon: Wallet, 
                desc: "Dynamic credit scoring and automated repayment protocols integrated with UPI 2.0." 
              },
              { 
                title: "Flow Inventory", 
                icon: Package, 
                desc: "Neural network demand forecasting with real-time supplier restock automation." 
              },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="group p-14 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[4rem] shadow-xl hover:shadow-primary/10 transition-all duration-700"
              >
                <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-12 group-hover:rotate-12 transition-transform">
                  <feature.icon className="h-10 w-10" />
                </div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">{feature.title}</h4>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic opacity-80">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-60 overflow-hidden relative z-20 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-10"
            >
              <div className="absolute -inset-20 bg-primary/5 rounded-[6rem] blur-[120px]" />
              <div className="relative aspect-square bg-slate-100/30 dark:bg-slate-800/20 backdrop-blur-3xl rounded-[5rem] overflow-hidden border border-white/20 dark:border-slate-700/50 group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-56 h-56 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20"
                  >
                    <Lock className="h-24 w-24 text-primary" />
                  </motion.div>
                </div>
                <div className="absolute top-12 left-12 p-8 glass dark:glass-dark rounded-[2rem] border border-white/30 whitespace-nowrap shadow-2xl">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">AES-256 Encrypted</span>
                  </div>
                </div>
                <div className="absolute bottom-12 right-12 p-8 glass dark:glass-dark rounded-[2rem] border border-white/30 whitespace-nowrap shadow-2xl">
                  <div className="flex items-center gap-4">
                    <Eye className="h-6 w-6 text-primary" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Privacy Protocol</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-[12px] font-black text-primary uppercase tracking-[0.5em] mb-10">Infrastructure</h2>
              <h3 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9] mb-12 italic">
                The Security <br/> of a <span className="text-primary not-italic">Fortress.</span>
              </h3>
              <p className="text-2xl text-slate-500 dark:text-slate-400 font-medium mb-16 italic leading-relaxed">
                We handle your merchant data with military precision and banking compliance. Decentralized, sharded, and impenetrable.
              </p>
              
              <div className="space-y-10">
                {[
                  { icon: Database, title: "Sharded Nodes", desc: "Data is sharded across regional protocols to eliminate single points of failure." },
                  { icon: Smartphone, title: "Biometric Auth", desc: "Native FaceID and Fingerprint integration for all high-value transactions." },
                  { icon: ShieldCheck, title: "Global Vault", desc: "Cold-storage encryption for master shop ledgers and private merchant IDs." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-8 group"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:bg-primary transition-colors">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h5 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{item.title}</h5>
                      <p className="text-lg text-slate-500 font-medium italic opacity-80">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 px-6 relative z-20">
        <div className="max-w-6xl mx-auto relative group">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 rounded-[5rem] blur opacity-25" 
          />
          <div className="relative bg-slate-950 rounded-[5rem] p-16 md:p-32 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/30 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -ml-40 -mb-40" />
            
            <div className="relative text-center">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-12 leading-none italic">
                Ready to Upgrade <br /> <span className="text-primary not-italic">Commerce?</span>
              </h2>
              <p className="text-slate-400 font-medium text-2xl max-w-2xl mx-auto mb-16 italic opacity-80 leading-relaxed">
                Join 50k+ merchants scaling local commerce with neural precision. Initialize your protocol today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/auth/register" className="w-full sm:w-auto px-16 py-8 bg-primary hover:bg-primary-dark text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-2xl shadow-primary/30">
                  Launch Platform
                </Link>
                <Link href="#" className="w-full sm:w-auto px-16 py-8 bg-white/5 hover:bg-white/10 backdrop-blur-2xl text-white border border-white/10 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all">
                  Contact Protocol
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 border-t border-slate-100 dark:border-slate-800 relative z-20 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">
            © 2024 Mana Vyapar Solutions. Mission Controlled.
          </p>
        </div>
      </footer>
    </main>
  )
}

