import { StoreProvider } from '@/components/storefront/StoreProvider';
import { StoreNavbar } from '@/components/storefront/StoreNavbar';
import { StoreFooter } from '@/components/storefront/StoreFooter';

export const metadata = {
  title: 'Mana Store | Premium Shopping Experience',
  description: 'Shop the best products powered by Mana Vyapar.',
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen flex bg-background text-foreground font-body relative overflow-hidden">
        {/* Ambient background glow effects */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.2] z-0">
          <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-primary rounded-full blur-[160px] animate-pulse-slow active" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2cd08b] rounded-full blur-[140px] opacity-40 hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <StoreNavbar /> {/* This now contains both Mobile Topbar & Desktop Sidebar */}
        <div className="flex-1 flex flex-col h-screen pt-20 md:pt-0 w-full overflow-y-auto relative z-10 max-w-full">
          <main className="flex-1 w-full flex flex-col relative">{children}</main>
          <StoreFooter />
        </div>
      </div>
    </StoreProvider>
  );
}
