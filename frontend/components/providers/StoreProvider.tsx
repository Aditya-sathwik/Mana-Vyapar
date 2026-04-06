'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { storefrontStore } from '../../redux/store';
import { usePathname } from 'next/navigation';
import { makeStore } from '../../lib/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStorefront = pathname.startsWith('/store/');
  
  const merchantStoreRef = useRef<any>(null);

  if (!isStorefront && !merchantStoreRef.current) {
    merchantStoreRef.current = makeStore();
  }

  // Use storefrontStore singleton for /store paths, else per-request merchantStore
  const store = isStorefront ? storefrontStore : merchantStoreRef.current;

  if (!store) return <>{children}</>;

  return <Provider store={store}>{children}</Provider>;
}
