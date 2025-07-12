
// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - NowSpike",
  description: "Read NowSpike's comprehensive privacy policy to understand how we handle your data and protect your privacy.",
  alternates: {
    canonical: "https://www.nowspike.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-bold text-[var(--navy-blue)] mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none text-[var(--foreground)]">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            At NowSpike, we collect minimal data to provide you with the best trending news experience:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Website usage analytics (via Google Analytics)</li>
            <li>Browser and device information</li>
            <li>IP address and location data</li>
            <li>Pages visited and time spent on site</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use collected information to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Improve our content and user experience</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Ensure website security and prevent abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share anonymized data with:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Google Analytics for website analytics</li>
            <li>Law enforcement when legally required</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights (GDPR)</h2>
          <p className="mb-4">If you're in the EU, you have the right to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            For privacy-related questions or to exercise your rights, contact us at privacy@nowspike.com or contact@nowspike.com.
          </p>
        </section>

        <p className="text-sm text-gray-600 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
