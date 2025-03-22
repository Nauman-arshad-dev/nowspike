// app/components/AnalyticsScripts.tsx
"use client";

import Script from "next/script";

export default function AnalyticsScripts() {
  return (
    <>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-4CGXYV02DR"
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4CGXYV02DR');
          `,
        }}
      />
    </>
  );
}