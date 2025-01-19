import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { cookies } from 'next/headers';
import { PageTracker } from 'react-page-tracker';

import './globals.css';

import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import defaultMetadata from '@/constants/metadata';
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ConfirmationReminder from '@/components/layout/confirmation-reminder';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Главная | MyFilmList'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <html lang='ru' className={`${lato.className}`} suppressHydrationWarning>
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <PageTracker />
        <NuqsAdapter>
          <Providers>
            <Toaster />
            <KBar>
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                  <Header />
                  <ConfirmationReminder />
                  {/* page main content */}
                  {children}
                  {/* page main content ends */}
                </SidebarInset>
              </SidebarProvider>
            </KBar>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
