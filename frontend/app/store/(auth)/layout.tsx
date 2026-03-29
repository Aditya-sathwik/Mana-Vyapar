import React from 'react';

export default function StoreAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Visual / Branding side */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center flex-col text-primary-foreground p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-[#022c1e] pointer-events-none z-0" />
        {/* Subtle decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-black/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center max-w-lg text-center gap-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
              <span className="font-display text-4xl font-bold">M</span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight">Join Mana Vyapar&apos;s Premium Network</h1>
            <p className="text-lg text-primary-foreground/80">Experience next-generation eCommerce with unparalleled speed, security, and elegance.</p>
        </div>
      </div>
      
      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
         <div className="w-full max-w-md">
            {children}
         </div>
      </div>
    </div>
  );
}
