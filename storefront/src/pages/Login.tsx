import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/userSlice';
import type { AppDispatch, RootState } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await dispatch(loginUser({ email }));
      navigate('/');
    }
  };

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-sf-primary/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Marketing Side */}
          <div className="flex flex-col justify-center relative z-10 hidden md:flex">
             <div className="max-w-md">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-6">Welcome Back —</span>
                <h1 className="text-6xl lg:text-8xl font-black text-sf-text tracking-tighter leading-[0.8] mb-12">
                   THE <br className="hidden lg:block"/> ATELIER <br /> CLUB.
                </h1>
                <p className="text-sf-text-muted text-lg leading-relaxed mb-16">
                   Join our community of artisanal enthusiasts. Access your orders, wishlist, and exclusive merchant collections with a single secure login.
                </p>

                <div className="flex flex-col gap-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sf-primary/10 flex items-center justify-center text-sf-primary"><ShieldCheck size={20} /></div>
                      <p className="text-[10px] font-black tracking-[0.2em] text-sf-text uppercase">Secure OTP Authentication</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-12 lg:p-20 rounded-[40px] shadow-2xl border border-sf-outline/5 relative z-10"
          >
             <div className="mb-16">
                <h2 className="text-3xl font-black tracking-tighter text-sf-text mb-4 uppercase">Sign In.</h2>
                <p className="text-sf-text-muted text-sm uppercase tracking-widest font-bold">MANA VYAPAR CUSTOMER PORTAL</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-12">
                <div className="flex flex-col gap-4">
                   <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">EMAIL ADDRESS</label>
                   <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-sf-text-muted" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="NAME@EXAMPLE.COM" 
                        required
                        className="w-full h-18 pl-16 pr-8 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text"
                      />
                   </div>
                </div>

                {otpMode && (
                   <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">VERIFICATION CODE</label>
                      <div className="flex gap-4">
                         {[1, 2, 3, 4].map(i => (
                            <input key={i} type="text" maxLength={1} className="w-full h-18 text-center bg-sf-surface border border-sf-outline/10 rounded-2xl text-xl font-black text-sf-text focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all" />
                         ))}
                      </div>
                   </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-18 bg-sf-primary text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/25 hover:bg-sf-primary/90 transition-all uppercase"
                >
                   {loading ? 'AUTHENTICATING...' : (otpMode ? 'CONFIRM VERIFICATION' : 'SEND OTP')} 
                   <ArrowRight size={18} />
                </button>
             </form>

             <div className="mt-16 pt-8 border-t border-sf-outline/10">
                <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-4 text-center">New to Mana Vyapar?</p>
                <Link to="/signup" className="flex items-center justify-center gap-4 h-18 w-full border border-sf-outline/20 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-sf-surface-low transition-colors">
                   <UserPlus size={18} /> CREATE AN ACCOUNT
                </Link>
             </div>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
