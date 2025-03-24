// E:\nauman\NowSpike\frontend\app\about\page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - NowSpike",
  description: "Learn more about NowSpike, your go-to source for daily trending news.",
  alternates: {
    canonical: "https://www.nowspike.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-bold text-[var(--navy-blue)] mb-8">About Us</h1>
      <p className="text-base sm:text-lg text-[var(--foreground)]">
        NowSpike delivers daily trending news across 24 categories sourced from Google. Stay ahead with the latest updates!
      </p>
    </div>
  );
}