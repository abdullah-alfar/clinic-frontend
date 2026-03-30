import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider as TenantThemeProvider } from '@/providers/ThemeProvider';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Clinic Management System',
  description: 'Multi-tenant Clinic SaaS Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <QueryProvider>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TenantThemeProvider>
              {children}
              <Toaster position="top-right" />
            </TenantThemeProvider>
          </NextThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
