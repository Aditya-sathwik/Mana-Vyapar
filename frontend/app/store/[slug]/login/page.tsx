'use client';

import { useStorefrontDispatch, useStorefrontSelector } from '@/redux/hooks';
import { useState } from 'react';
import { login, setAuth, setError as setAuthError } from '@/redux/slices/authSlice';
import storefrontApi from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Github, Chrome, Star, ShieldCheck, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function LoginPage({ params }: { params: { slug: string } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useStorefrontDispatch();
  const router = useRouter();
  const { metadata } = useStorefrontSelector(state => state.store);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await storefrontApi.login({ email, password });
      if (response.data) {
        dispatch(setAuth({ user: response.data.user, token: response.data.accessToken }));
        toast.success(`Welcome back to ${metadata?.name}!`, {
            style: {
                background: 'var(--primary, #6366f1)',
                color: '#fff',
            }
        });
        router.push(`/store/${params.slug}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950 relative selection:bg-primary/30">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/10 blur-[200px] rounded-full pointer-events-none skew-x-[-20deg]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/5 blur-[200px] rounded-full pointer-events-none skew-x-[20deg]" />
        
        {/* Visual Side (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center p-20 overflow-hidden group">
            <div className="absolute inset-0 z-0">
                <Image 
                    src="https://images.unsplash.com/photo-1534452286304-a814d493688b?auto=format&fit=crop&q=80" 
                    alt="Shopping"
                    fill
                    className="object-cover opacity-30 grayscale scale-110 group-hover:scale-100 transition-transform duration-[3s] ease-out select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="relative z-10 max-w-lg"
            >
                <div className="mb-12 flex items-center gap-6 group/logo transition-transform hover:scale-[1.02]">
                    <div className="w-20 h-20 rounded-[32px] bg-white p-4 shadow-premium ring-1 ring-white/10 group-hover/logo:rotate-12 transition-transform">
                        <Image src={metadata?.logo || ''} alt={metadata?.name || ''} width={100} height={100} className="w-full h-full object-contain" />
                    </div>
                </div>
                
                <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-10 overflow-hidden">
                    Join the <br /> <span style={{ color: 'var(--primary, #6366f1)' }} className="italic font-black text-primary">Retail Heartbeat</span>
                </h2>
                
                <div className="flex flex-col gap-10">
                    <div className="flex items-center gap-6 group/item">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover/item:scale-110 transition-all shadow-xl shadow-black/20">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-tight mb-1">Premium Curation</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Only the best products from {metadata?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group/item">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 group-hover/item:scale-110 transition-all shadow-xl shadow-black/20">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-tight mb-1">Secured Ecosystem</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Identity protection powered by Mana-Vyapar Central</p>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 flex gap-10">
                    <div className="flex -space-x-4">
                        {[1,2,3].map(n => (
                            <div key={n} className="w-12 h-12 rounded-full border-2 border-slate-950 bg-slate-800 shadow-xl overflow-hidden ring-1 ring-white/10 grayscale-[0.5] hover:grayscale-0 transition-all" />
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight">Trusted by over 100k <br /> shoppers across {metadata?.name}</p>
                </div>
            </motion.div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-7 flex flex-col p-10 md:p-20 items-center justify-center relative">
            <Link href={`/store/${params.slug}`} className="absolute top-10 right-10 lg:left-20 group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all active:scale-95">
               <ChevronLeft size={20} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
               BACK TO SHOP
            </Link>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: 'circOut' }}
               className="w-full max-w-md"
            >
                <div className="mb-14">
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">Customer Login</h3>
                    <p className="text-slate-500 font-bold text-sm">Welcome back to {metadata?.name}. Sign in to continue your premium shopping experience.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                            <Mail size={22} strokeWidth={2.5} />
                        </div>
                        <input 
                            type="email" 
                            placeholder="EMAIL IDENTIFIER" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-20 bg-slate-900 border border-white/5 rounded-[28px] pl-16 pr-8 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-slate-900 transition-all shadow-premium"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                            <Lock size={22} strokeWidth={2.5} />
                        </div>
                        <input 
                            type="password" 
                            placeholder="ACCESS KEY" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-20 bg-slate-900 border border-white/5 rounded-[28px] pl-16 pr-8 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-slate-900 transition-all shadow-premium"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Recover Access Key?</button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="h-20 bg-white text-slate-950 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-premium hover:scale-102 active:scale-95 transition-all group overflow-hidden relative border border-white/20 disabled:opacity-50 mt-4"
                    >
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-4">
                            {isLoading ? 'VERIFYING IDENTITY...' : 'SECURE SIGN IN'}
                            <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </span>
                    </button>
                    
                    <div className="relative flex items-center gap-6 my-6">
                        <div className="h-px bg-white/5 flex-grow" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Digital Auth Provider</span>
                        <div className="h-px bg-white/5 flex-grow" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95">
                            <Chrome size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Google Identity</span>
                        </button>
                        <button type="button" className="h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95">
                            <Github size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Github Auth</span>
                        </button>
                    </div>

                    <p className="text-center mt-12 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        New Shopper? 
                        <Link href={`/store/${params.slug}/register`} className="ml-2 text-primary hover:text-white underline decoration-primary/30 transition-colors">Request Account</Link>
                    </p>
                </form>
            </motion.div>
            
            <div className="mt-20 flex flex-col items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all transition-all duration-700 cursor-default">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Digital Infrastructure Powered By</p>
                <div className="flex gap-4">
                    <div className="h-8 w-20 bg-slate-800 rounded-lg" />
                    <div className="h-8 w-20 bg-slate-800 rounded-lg" />
                </div>
            </div>
        </div>
    </div>
  );
}
