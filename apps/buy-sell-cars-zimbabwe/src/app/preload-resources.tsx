import Script from "next/script";
import { GA_TRACKING_ID } from "lib/googleAnalytics/gtag";
const isProduction = process.env.NODE_ENV === "production";
export const PreloadResources = () => (
  <>
    <head key="preload-resources">
      {/* Preload fonts for faster rendering */}
      <link
        rel="preload"
        as="style"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap"
      />

      <link
        rel="preload"
        as="style"
        href="https://api.fontshare.com/v2/css?f[]=erode@400,500&display=swap"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://api.fontshare.com/v2/css?f[]=erode@400,500&display=swap"
      />
    </head>

    {/* FontAwesome */}
    <Script
      src="https://kit.fontawesome.com/2864ff55c1.js"
      crossOrigin="anonymous"
    />

    {/* Google Analytics */}
    {isProduction && (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}');
      `}
        </Script>
      </>
    )}
  </>
);
