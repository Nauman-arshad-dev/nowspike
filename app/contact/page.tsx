// E:\nauman\NowSpike\frontend\app\contact\page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - NowSpike",
  description: "Get in touch with the NowSpike team for inquiries or feedback.",
  alternates: {
    canonical: "https://www.nowspike.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-bold text-[var(--navy-blue)] mb-8">Contact Us</h1>
      <p className="text-base sm:text-lg text-[var(--foreground)]">
        Have questions? Reach out to us at contact@nowspike.com.
      </p>
    </div>
  );
}