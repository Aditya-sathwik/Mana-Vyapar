import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/auth-context";
import { LanguageProvider } from "../context/language-context";
import StoreProvider from "../components/providers/StoreProvider";
import { COLORS } from "@/lib/colors";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mana Vyapar | Merchant Dashboard",
  description: "Digitalizing the Indian Retail Heartland.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${inter.variable} antialiased font-body font-normal overflow-x-hidden`}
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="merchant-theme"
          >
            <LanguageProvider>
              <AuthProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: COLORS.slate[900],
                      color: COLORS.text.primary,
                      border: `1px solid ${COLORS.slate[800]}`,
                      borderRadius: '16px',
                      padding: '16px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backdropFilter: 'blur(10px)',
                    },
                    success: {
                      iconTheme: {
                        primary: COLORS.primary.vibrant,
                        secondary: '#fff',
                      },
                      style: {
                        boxShadow: `0 10px 30px -5px ${COLORS.primary.vibrant}20`,
                      }
                    },
                    error: {
                      iconTheme: {
                        primary: COLORS.error,
                        secondary: '#fff',
                      },
                      style: {
                        boxShadow: `0 10px 30px -5px ${COLORS.error}20`,
                      }
                    }
                  }}
                />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
