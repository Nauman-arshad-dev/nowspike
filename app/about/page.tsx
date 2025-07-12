
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NowSpike - Your Source for Daily Trending News",
  description: "Learn about NowSpike, the premier platform for discovering daily trending topics across 24 categories from Google Trends. Stay ahead of the news cycle.",
  alternates: {
    canonical: "https://www.nowspike.com/about",
  },
  keywords: "about nowspike, trending news platform, google trends, daily news, viral topics",
  openGraph: {
    title: "About NowSpike - Your Source for Daily Trending News",
    description: "Discover how NowSpike delivers the most current trending topics from Google Trends across 24 categories.",
    url: "https://www.nowspike.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-bold text-[var(--navy-blue)] mb-8">About NowSpike</h1>
      
      <div className="prose prose-lg max-w-none text-[var(--foreground)]">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mb-4">
            NowSpike is your premier destination for discovering what&apos;s trending right now. We deliver real-time insights into the most talked-about topics across the United States, sourced directly from Google Trends data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">24 Categories of Trending Content</h2>
          <p className="mb-4">
            Our comprehensive coverage spans across diverse categories to keep you informed about everything that matters:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 p-3 rounded">Arts & Entertainment</div>
            <div className="bg-gray-50 p-3 rounded">Autos & Vehicles</div>
            <div className="bg-gray-50 p-3 rounded">Beauty & Fitness</div>
            <div className="bg-gray-50 p-3 rounded">Books & Literature</div>
            <div className="bg-gray-50 p-3 rounded">Business & Industrial</div>
            <div className="bg-gray-50 p-3 rounded">Computers & Electronics</div>
            <div className="bg-gray-50 p-3 rounded">Finance</div>
            <div className="bg-gray-50 p-3 rounded">Food & Drink</div>
            <div className="bg-gray-50 p-3 rounded">Games</div>
            <div className="bg-gray-50 p-3 rounded">Health</div>
            <div className="bg-gray-50 p-3 rounded">Sports</div>
            <div className="bg-gray-50 p-3 rounded">Technology</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose NowSpike?</h2>
          <ul className="list-disc ml-6 mb-4">
            <li><strong>Real-time Updates:</strong> Our content is refreshed daily with the latest trending topics</li>
            <li><strong>Data-Driven:</strong> All trends are sourced from Google&apos;s comprehensive search data</li>
            <li><strong>Comprehensive Coverage:</strong> From entertainment to technology, we cover what matters to you</li>
            <li><strong>Easy to Navigate:</strong> Clean, intuitive design that gets you to the news fast</li>
            <li><strong>Mobile Optimized:</strong> Perfect reading experience on any device</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            In today&apos;s fast-paced digital world, staying informed about trending topics can be overwhelming. NowSpike simplifies this by curating the most relevant, trending content and presenting it in an easily digestible format. Whether you&apos;re a content creator, marketer, journalist, or simply someone who wants to stay current, NowSpike is your trusted source for what&apos;s happening now.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Stay Connected</h2>
          <p className="mb-4">
            Have questions, suggestions, or feedback? We&apos;d love to hear from you. Reach out to us at <a href="mailto:contact@nowspike.com" className="text-blue-600 hover:underline">contact@nowspike.com</a> and join thousands of users who rely on NowSpike for their daily dose of trending news.
          </p>
        </section>
      </div>
    </div>
  );
}
