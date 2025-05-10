import './globals.css';
import { ReactNode } from 'react';
import { metadata } from './metadata';
import { PreloadResources } from './preload-resources';
import { Navbar } from '../components/Layout';
import Toaster from '@/src/utils/reactHotToast/Toaster';

// Base metadata for the app
export { metadata };

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <PreloadResources />

      <body>
        <Navbar />
        <main id="main-content">{children}</main>

        <Toaster />
      </body>
    </html>
  );
}
