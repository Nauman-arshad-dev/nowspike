// E:\nauman\NowSpike\frontend\app\privacy\page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - NowSpike",
  description: "Read NowSpike's privacy policy to understand how we handle your data.",
  alternates: {
    canonical: "https://www.nowspike.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-bold text-[var(--navy-blue)] mb-8">Privacy Policy</h1>
      <p className="text-base sm:text-lg text-[var(--foreground)]">
        At NowSpike, we value your privacy. This policy outlines how we collect, use, and protect your data.
      </p>
    </div>
  );
}