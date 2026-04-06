import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/userSlice';
import type { AppDispatch, RootState } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { User, Mail, ArrowRight, CheckCircle2, LogIn } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name) {
      // Simulate registration + initial login
      await dispatch(loginUser({ email: formData.email }));
      navigate('/');
    }
  };

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-sf-primary/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-12 lg:p-20 rounded-[40px] shadow-2xl border border-sf-outline/5 relative z-10"
          >
             <div className="mb-16">
                <h2 className="text-3xl font-black tracking-tighter text-sf-text mb-4 uppercase">Create Account.</h2>
                <p className="text-sf-text-muted text-sm uppercase tracking-widest font-bold">JOIN THE MANA VYAPAR COMMUNITY</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col gap-4">
                   <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">FULL NAME</label>
                   <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-sf-text-muted" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="YOUR FULL NAME" 
                        required
                        className="w-full h-18 pl-16 pr-8 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text"
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">EMAIL ADDRESS</label>
                   <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-sf-text-muted" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="NAME@EXAMPLE.COM" 
                        required
                        className="w-full h-18 pl-16 pr-8 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text"
                      />
                   </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-sf-primary/5 rounded-2xl border border-sf-primary/10 mb-8">
                   <CheckCircle2 className="text-sf-primary shrink-0" size={20} />
                   <p className="text-[9px] font-bold text-sf-text leading-relaxed tracking-wider uppercase">
                      By registering, you agree to our curation standards and merchant community policies.
                   </p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-18 bg-sf-primary text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/25 hover:bg-sf-primary/90 transition-all uppercase"
                >
                   {loading ? 'CREATING ACCOUNT...' : 'REGISTER JOIN CLUB'} 
                   <ArrowRight size={18} />
                </button>
             </form>

             <div className="mt-16 pt-8 border-t border-sf-outline/10 text-center">
                <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-4">ALREADY HAVE AN ACCOUNT?</p>
                <Link to="/login" className="flex items-center justify-center gap-4 text-sf-primary font-black text-[10px] tracking-widest uppercase hover:underline">
                   <LogIn size={18} /> BACK TO SIGN IN
                </Link>
             </div>
          </motion.div>

          {/* Marketing Side */}
          <div className="flex flex-col justify-center relative z-10 hidden md:flex">
             <div className="max-w-md">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-6">The Journey Begins —</span>
                <h1 className="text-6xl lg:text-8xl font-black text-sf-text tracking-tighter leading-[0.8] mb-12">
                   BEYOND <br /> THE <br /> GRID.
                </h1>
                <p className="text-sf-text-muted text-lg leading-relaxed mb-16">
                   Mana Vyapar is more than a marketplace. It's a digital atelier where technology meets tradition. Start your premium shopping journey today.
                </p>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;
