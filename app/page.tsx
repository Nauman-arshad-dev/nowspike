// app/page.tsx
import Link from "next/link";
import { FaFire, FaChartLine, FaGlobe, FaArrowRight } from "react-icons/fa";
import TrendCard from "@/components/TrendCard";
import { Trend } from "@/types/trend";

interface TrendsResponse {
  data: Trend[];
}

async function fetchTrends(): Promise<Trend[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
    }
    const res = await fetch(`${baseUrl}/api/trends`, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch trends: ${res.status} ${res.statusText}`);
    }
    const trendsData: TrendsResponse = await res.json();
    return trendsData.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const trends = await fetchTrends();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Discover What&apos;s{" "}
            <span className="text-gradient">Spiking Now</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay ahead of the curve with real-time trending topics from across the web. 
            Updated daily from Google Trends.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="#trends" className="btn btn-primary btn-lg">
            <FaFire />
            Explore Trends
          </Link>
          <Link href="/about" className="btn btn-secondary btn-lg">
            <FaChartLine />
            Learn More
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {trends.length}+
          </div>
          <h3 className="text-xl font-semibold mb-2">Active Trends</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Live trending topics updated daily
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
          <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Continuous monitoring of trending topics
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
          <h3 className="text-xl font-semibold mb-2">Authentic Data</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Direct from Google Trends API
          </p>
        </div>
      </section>

      {/* Trending Now Section */}
      <section id="trends" className="section">
        <div className="text-center mb-12">
          <h2 className="section-title">
            <FaFire className="inline-block mr-3 text-orange-500" />
            Trending Now
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The hottest topics everyone is talking about right now
          </p>
        </div>

        {trends.length > 0 ? (
          <div className="grid-responsive">
            {trends.slice(0, 9).map((trend) => (
              <TrendCard key={trend.slug} trend={trend} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold mb-4">No Trends Available</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We&apos;re working hard to bring you the latest trends. Check back soon!
            </p>
          </div>
        )}

        {trends.length > 9 && (
          <div className="text-center mt-12">
            <Link href="/trends" className="btn btn-primary">
              View All Trends
              <FaArrowRight />
            </Link>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="text-center mb-12">
          <h2 className="section-title">
            <FaGlobe className="inline-block mr-3 text-blue-500" />
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover trends across different topics and interests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: "Entertainment", icon: "🎬", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
            { name: "Sports", icon: "⚽", color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
            { name: "Technology", icon: "💻", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
            { name: "Health", icon: "🏥", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
            { name: "Business", icon: "📈", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
            { name: "Politics", icon: "🏛️", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400" },
            { name: "Science", icon: "🔬", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400" },
            { name: "Gaming", icon: "🎮", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400" },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="card card-interactive group hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mx-auto`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Never Miss a Trend Again
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of users who stay updated with the latest trending topics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Link>
              <Link href="/about" className="btn bg-white/10 text-white border-white/20 hover:bg-white/20">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}