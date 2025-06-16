import Script from "next/script";

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

    <Script
      src="https://kit.fontawesome.com/2864ff55c1.js"
      crossOrigin="anonymous"
    ></Script>
  </>
);
