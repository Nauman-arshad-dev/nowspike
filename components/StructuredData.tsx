
// components/StructuredData.tsx
import { Trend } from "@/types/trend";

interface StructuredDataProps {
  trend?: Trend;
  isHomePage?: boolean;
}

export default function StructuredData({ trend, isHomePage }: StructuredDataProps) {
  const baseUrl = "https://www.nowspike.com";
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NowSpike",
    "description": "Your premier source for daily trending news and topics from Google Trends",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.svg`,
    "sameAs": [
      "https://twitter.com/nowspike",
      "https://facebook.com/nowspike"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@nowspike.com",
      "contactType": "Customer Service"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NowSpike",
    "description": "Daily trending news and topics from Google Trends across 24 categories",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const articleSchema = trend ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": trend.title,
    "description": trend.teaser,
    "image": trend.image ? `${baseUrl}${trend.image}` : `${baseUrl}/images/placeholder.jpg`,
    "author": {
      "@type": "Organization",
      "name": "NowSpike"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NowSpike",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.svg`
      }
    },
    "datePublished": trend.createdAt,
    "dateModified": trend.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/trends/${trend.slug}`
    },
    "articleSection": trend.category,
    "keywords": trend.relatedTopics?.join(", ") || ""
  } : null;

  const breadcrumbSchema = trend ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Trends",
        "item": `${baseUrl}/trends`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": trend.title,
        "item": `${baseUrl}/trends/${trend.slug}`
      }
    ]
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      
      {isHomePage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      )}
      
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
    </>
  );
}
