// app/components/SchemaScripts.tsx
"use client";

import Script from "next/script";

export default function SchemaScripts({ schemaData }: { schemaData: any }) {
  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}