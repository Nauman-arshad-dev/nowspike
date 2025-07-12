
// components/AnalyticsScripts.tsx
"use client";

import Script from "next/script";

export default function AnalyticsScripts() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-XXXXXXXXXX"; // Update with your new GA4 ID

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            allow_ad_personalization_signals: false,
            cookie_flags: 'SameSite=None;Secure'
          });
          
          // Enhanced ecommerce tracking for content engagement
          gtag('config', '${GA_TRACKING_ID}', {
            custom_map: {
              'custom_parameter_1': 'trend_category',
              'custom_parameter_2': 'trending_score'
            }
          });
        `}
      </Script>

      {/* Google Search Console verification */}
      <meta name="google-site-verification" content="YOUR_SEARCH_CONSOLE_CODE" />
      
      {/* Additional tracking for trending content */}
      <Script id="trend-tracking" strategy="afterInteractive">
        {`
          function trackTrendView(trendTitle, category, spike) {
            gtag('event', 'trend_view', {
              'trend_title': trendTitle,
              'trend_category': category,
              'trending_score': spike,
              'page_location': window.location.href
            });
          }
          
          function trackTrendShare(trendTitle, platform) {
            gtag('event', 'trend_share', {
              'trend_title': trendTitle,
              'share_platform': platform,
              'page_location': window.location.href
            });
          }
          
          // Make functions globally available
          window.trackTrendView = trackTrendView;
          window.trackTrendShare = trackTrendShare;
        `}
      </Script>
    </>
  );
}
