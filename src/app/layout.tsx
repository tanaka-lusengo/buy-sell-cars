import { ReactNode } from 'react';

// import Head from 'next/head';
import './globals.css';

import { metadata } from './metadata';
import { PreloadResources } from './preload-resources';

// Base metadata for the app
export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <PreloadResources />

      <body>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
