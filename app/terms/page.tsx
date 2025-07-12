
// app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - NowSpike",
  description: "Read NowSpike's terms of service for using our trending news platform.",
  alternates: {
    canonical: "https://www.nowspike.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-bold text-[var(--navy-blue)] mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none text-[var(--foreground)]">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using NowSpike ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            NowSpike provides daily trending news and topics sourced from Google Trends across 24 categories including Arts & Entertainment, Technology, Sports, Health, and more.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Content and Intellectual Property</h2>
          <p className="mb-4">
            All content on NowSpike is curated from publicly available trending data. Users may share and reference our content with proper attribution to NowSpike.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
          <p className="mb-4">
            Users agree not to use the Service for any unlawful purpose or in any way that might harm, damage, or disparage NowSpike.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
          <p className="mb-4">
            The information on NowSpike is provided on an "as is" basis. We make no representations or warranties of any kind, express or implied.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="mb-4">
            For questions about these Terms of Service, please contact us at contact@nowspike.com.
          </p>
        </section>

        <p className="text-sm text-gray-600 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
