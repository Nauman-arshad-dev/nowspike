// app/components/SchemaScripts.tsx
"use client";

import Script from "next/script";

// Define the types for the schema data
interface SchemaArticle {
  "@type": string;
  headline: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: {
    "@type": string;
    name: string;
  };
  publisher: {
    "@type": string;
    name: string;
    logo: {
      "@type": string;
      url: string;
    };
  };
  description: string;
  url: string;
}

interface SchemaData {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
  article: SchemaArticle[];
}

export default function SchemaScripts({ schemaData }: { schemaData: SchemaData }) {
  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}