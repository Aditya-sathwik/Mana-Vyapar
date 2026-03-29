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
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.15] z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[100px] opacity-60" />
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
