'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import { Input } from '@/components/storefront/ui/Input';
import { Button } from '@/components/storefront/ui/Button';
import { SlideUp } from '@/components/storefront/ui/MotionComponents';
import { Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StoreRegister() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      dispatch(loginSuccess({
        user: { id: `usr_${Date.now()}`, name: form.name, email: form.email, phone: form.phone },
        token: 'mock-jwt-token-new',
      }));
      toast.success('Account created successfully!');
      router.push('/store');
    }, 1500);
  };

  return (
    <SlideUp className="w-full">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-bold text-foreground">Create an account</h2>
        <p className="mt-2 text-sm text-muted-foreground">Join us to shop the finest premium products securely.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
         <div className="space-y-2">
           <label className="text-sm font-medium text-foreground">Full Name</label>
           <div className="relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
               required 
               placeholder="John Doe" 
               className="pl-10 h-12 rounded-xl"
               value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })}
             />
           </div>
         </div>
         
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
           <label className="text-sm font-medium text-foreground">Phone Number</label>
           <div className="relative">
             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
               type="tel" 
               required 
               placeholder="+91 9876543210" 
               className="pl-10 h-12 rounded-xl"
               value={form.phone}
               onChange={(e) => setForm({ ...form, phone: e.target.value })}
             />
           </div>
         </div>
         
         <div className="space-y-2">
           <label className="text-sm font-medium text-foreground">Password</label>
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
         
         <Button type="submit" size="lg" className="w-full shadow-xl shadow-primary/20 mt-4 h-12 text-base rounded-xl" disabled={loading}>
            Create Account
         </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/store/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </SlideUp>
  );
}
