import { Toaster } from 'react-hot-toast';
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
      <div className="min-h-screen flex flex-col pt-24 bg-background">
        <StoreNavbar />
        <main className="flex-1 w-full flex flex-col relative">{children}</main>
        <StoreFooter />
        <Toaster position="top-center" />
      </div>
    </StoreProvider>
  );
}
