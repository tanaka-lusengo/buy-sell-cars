import './globals.css';
import { ReactNode } from 'react';
import { metadata } from './metadata';
import { PreloadResources } from './preload-resources';
import { Navbar } from '../components/Layout';

// Base metadata for the app
export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <PreloadResources />

      <body>
        <Navbar />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
