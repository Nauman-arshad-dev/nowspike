// app/components/AnalyticsScripts.tsx
"use client";

import Script from "next/script";

export default function AnalyticsScripts() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "YOUR-GA-ID"; // Replace with your GA ID or use an env variable

  return (
    <>
      {/* Load the GTag script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      {/* Inline script to initialize Google Analytics */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}