import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
import type { AppDispatch } from '../store';
import MainLayout from '../layouts/MainLayout';
import SectionRenderer from '../components/SectionRenderer';
import { useStoreConfig } from '../hooks/useStoreConfig';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { config, loading: configLoading, error, slug } = useStoreConfig();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log(`🏠 [Home]: Detected Slug -> ${slug}`);
  console.log(`🏠 [Home]: Store Config ->`, config);
  console.log(`🏠 [Home]: Loading -> ${configLoading}, Error -> ${error}`);

  if (configLoading) {
    return (
      <MainLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <Loader2 className="h-12 w-12 text-sf-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sf-text-muted">Loading Storefront...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !config) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    return (
      <MainLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6 text-center p-8">
           <h2 className="text-4xl font-black uppercase tracking-tighter text-sf-text">Store Not Found</h2>
           <div className="space-y-4 max-w-md">
             <p className="text-sf-text-muted">We couldn't find the store you're looking for. Please check the URL or contact the merchant.</p>
             {isLocal && (
               <div className="p-4 bg-sf-surface border border-sf-outline/10 rounded-xl text-left">
                 <p className="text-[10px] font-black uppercase tracking-widest text-sf-primary mb-2 italic underline decoration-sf-primary/30 underline-offset-4">Local Development Note:</p>
                 <p className="text-[11px] leading-relaxed italic text-sf-text opacity-80">
                   To view a specific store locally, use a subdomain: <br/>
                   <code className="text-sf-primary bg-sf-primary/5 px-1 rounded">kirana.lvh.me:5173</code> <br/><br/>
                   Or use a query parameter: <br/>
                   <code className="text-sf-primary bg-sf-primary/5 px-1 rounded">localhost:5173?slug=kirana</code>
                 </p>
               </div>
             )}
           </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionRenderer sections={config.sections} theme={config.theme} />
    </MainLayout>
  );
};

export default Home;
