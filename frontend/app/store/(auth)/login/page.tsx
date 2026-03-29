'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import { Input } from '@/components/storefront/ui/Input';
import { Button } from '@/components/storefront/ui/Button';
import { SlideUp } from '@/components/storefront/ui/MotionComponents';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StoreLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      dispatch(loginSuccess({
        user: { id: 'usr_mock123', name: 'Premium Shopper', email: form.email, phone: '+919876543210' },
        token: 'mock-jwt-token',
      }));
      toast.success('Welcome back!');
      router.push('/store');
    }, 1000);
  };

  return (
    <SlideUp className="w-full">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-bold text-foreground">Sign in to your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">Enter your details to access your premium shopping experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="space-y-2">
           <label className="text-sm font-medium text-foreground">Email Address</label>
           <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
               type="email" 
               required 
               placeholder="you@example.com" 
               className="pl-10 h-12 rounded-xl"
               value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })}
             />
           </div>
         </div>
         
         <div className="space-y-2">
           <div className="flex justify-between">
             <label className="text-sm font-medium text-foreground">Password</label>
             <Link href="#" className="text-sm font-semibold text-primary hover:underline">Forgot password?</Link>
           </div>
           <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
               type="password" 
               required 
               placeholder="••••••••" 
               className="pl-10 h-12 rounded-xl"
               value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })}
             />
           </div>
         </div>
         
         <Button type="submit" size="lg" className="w-full shadow-xl shadow-primary/20 gap-2 h-12 text-base rounded-xl" disabled={loading}>
            <LogIn className="h-4 w-4" />
            Sign In
         </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/store/register" className="font-semibold text-primary hover:underline">
          Create one now
        </Link>
      </div>
    </SlideUp>
  );
}
