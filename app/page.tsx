// app/page.tsx
import TrendCard from "@/components/TrendCard";
import { Trend } from "@/types/trend";
import Image from "next/image";
import Link from "next/link";
import { FaFire, FaChartLine, FaClock, FaArrowRight } from "react-icons/fa";

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

export default async function HomePage() {
  const trends = await fetchTrends();
  const heroTrend = trends.find((trend) => trend.isHero) || trends[0];
  const regularTrends = trends.filter((trend) => !trend.isHero);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaFire className="text-orange-400 animate-pulse" />
                <span className="text-sm font-semibold">TRENDING NOW</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaChartLine className="text-green-400" />
                <span className="text-sm font-semibold">LIVE</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover What&apos;s <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Spiking</span> Now
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl">
              Stay ahead of the curve with real-time trending topics from across the United States. Updated every hour from Google Trends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/trends"
                className="btn-primary bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Explore All Trends
                <FaArrowRight />
              </Link>
              <Link
                href="/about"
                className="btn-secondary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Trend */}
      {heroTrend && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Featured Story</h2>
            <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
              <FaFire className="animate-pulse" />
              HOT
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
            <div className="lg:flex">
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                    {heroTrend.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaClock />
                    <span className="text-sm">
                      {new Date(heroTrend.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {heroTrend.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  {heroTrend.teaser}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold">
                      {heroTrend.spike} spike
                    </div>
                  </div>

                  <Link
                    href={`/trends/${heroTrend.slug}`}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                  >
                    Read More
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {heroTrend.image && (
                <div className="lg:w-1/3 relative min-h-[300px] lg:min-h-[400px]">
                  <Image
                    src={heroTrend.image}
                    alt={heroTrend.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Trending Now Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
          <Link
            href="/trends"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
          >
            View All
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {regularTrends.slice(0, 6).map((trend) => (
            <TrendCard key={trend.slug} trend={trend} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real-Time Trend Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Our platform processes millions of search queries to bring you the most accurate trending data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">Live monitoring of trending topics</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaFire className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Trending topics analyzed daily</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Real-time</h3>
              <p className="text-gray-600 dark:text-gray-300">Updates every hour from Google</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Explore by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            "Entertainment", "Sports", "Technology", "Health", 
            "Business", "Politics", "Science", "Gaming",
            "Music", "Movies", "Fashion", "Food"
          ].map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center group"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                {category}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}