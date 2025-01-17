import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import StoreProvider from '../providers/store-provider';
import SessionProvider from '../providers/session-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <StoreProvider>
          <SessionProvider>{children}</SessionProvider>
        </StoreProvider>
      </ThemeProvider>
    </>
  );
}
