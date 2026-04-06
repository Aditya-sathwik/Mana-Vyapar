import StorefrontWrapper from './StorefrontWrapper';
import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';

export default function StoreLayoutWrapper({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = React.use(params);
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="storefront-theme"
    >
      <StorefrontWrapper params={unwrappedParams}>
        {children}
      </StorefrontWrapper>
    </ThemeProvider>
  );
}
