// E:\nauman\NowSpike\frontend\app\page.tsx
import { Trend } from "@/types/trend";
import TrendCard from "@/components/TrendCard";
import TrendingNow from "@/components/TrendingNow";
import Link from "next/link";
import Image from "next/image";
import { FaFire, FaClock, FaGlobe, FaSearch, FaArrowRight, FaNewspaper } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { FaArrowTrendUp } from "react-icons/fa6";

interface TrendsResponse {
  data: Trend[];
}

async function fetchTrends(): Promise<Trend[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    }
    const res = await fetch(`${baseUrl}/api/trends`, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch trends: ${res.status} ${res.statusText}`);
    }
    const trendsData: TrendsResponse = await res.json();
    return trendsData.data || [];
  } catch (error) {
    console.error("Error fetching trends:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const trends = await fetchTrends();
  const topTrends = trends.slice(0, 5).map((t: Trend) => t.title).join(", ");
  const heroTrend = trends.find(t => t.isHero);

  return {
    metadataBase: new URL("https://www.nowspike.com"),
    title: "NowSpike - Today's Trending Topics & Breaking News",
    description: `Discover what's trending now: ${topTrends}. Real-time trending news, viral stories, and breaking updates from around the world. Updated hourly from Google Trends.`,
    keywords: `trending news, viral stories, breaking news, google trends, ${topTrends}, real-time updates, trending topics, news analysis`,
    authors: [{ name: "NowSpike Editorial Team" }],
    creator: "NowSpike",
    publisher: "NowSpike",
    alternates: {
      canonical: "https://www.nowspike.com",
    },
    openGraph: {
      title: "NowSpike - Today's Trending Topics & Breaking News",
      description: `Stay ahead of the curve with trending stories: ${topTrends}. Real-time updates from Google Trends.`,
      url: "https://www.nowspike.com",
      siteName: "NowSpike",
      images: heroTrend?.image ? [
        {
          url: heroTrend.image,
          width: 1200,
          height: 630,
          alt: heroTrend.title,
        }
      ] : [
        {
          url: "/logo.svg",
          width: 1200,
          height: 630,
          alt: "NowSpike - Trending News",
        }
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "NowSpike - Today's Trending Topics",
      description: `Real-time trending news: ${topTrends}`,
      images: heroTrend?.image ? [heroTrend.image] : ["/logo.svg"],
      creator: "@nowspike",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "a7b2c3d4e5f6g7h8",
    },
  };
}

export default async function HomePage() {
  const trends = await fetchTrends();
  const hero = trends.find((trend) => trend.isHero) || trends[0];
  const featuredTrends = trends.filter((trend) => !trend.isHero).slice(0, 8);
  const categories = ["sports", "entertainment", "technology", "politics", "health", "business"];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "NowSpike",
    "url": "https://www.nowspike.com",
    "logo": "https://www.nowspike.com/logo.svg",
    "description": "Real-time trending news and viral stories updated from Google Trends",
    "sameAs": [
      "https://twitter.com/nowspike",
      "https://facebook.com/nowspike"
    ],
    "mainEntity": trends.slice(0, 5).map(trend => ({
      "@type": "NewsArticle",
      "headline": trend.title,
      "description": trend.teaser,
      "url": `https://www.nowspike.com/trends/${trend.slug}`,
      "datePublished": trend.createdAt,
      "dateModified": trend.updatedAt,
      "author": {
        "@type": "Organization",
        "name": "NowSpike Editorial Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "NowSpike",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.nowspike.com/logo.svg"
        }
      }
    }))
  };

  return (
    <>
      <StructuredData data={structuredData} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Breaking News Ticker */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                <FaFire className="text-yellow-300 animate-pulse" />
                TRENDING NOW
              </div>
              <div className="overflow-hidden flex-1">
                <div className="animate-marquee whitespace-nowrap text-sm">
                  {trends.slice(0, 5).map((trend, index) => (
                    <span key={trend.slug} className="mr-8">
                      <Link href={`/trends/${trend.slug}`} className="hover:text-yellow-200 transition-colors">
                        {trend.title} ({trend.spike})
                      </Link>
                      {index < 4 && " • "}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {hero && (
          <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      🔥 TRENDING
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {hero.spike}
                    </span>
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    {hero.title}
                  </h1>

                  <p className="text-xl text-blue-100 leading-relaxed">
                    {hero.teaser}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-300" />
                      {formatDistanceToNow(new Date(hero.timestamp), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-blue-300" />
                      {hero.category.toUpperCase()}
                    </div>
                  </div>

                  <Link
                    href={`/trends/${hero.slug}`}
                    className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Read Full Story
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-1">
                    <Image
                      src={hero.image || "/images/placeholder.jpg"}
                      alt={hero.title}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover rounded-xl shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
          </section>
        )}

        {/* Categories Navigation */}
        <section className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaNewspaper className="text-blue-600" />
                Explore Categories
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/?category=${category}`}
                  className="group flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                >
                  <span className="capitalize">{category}</span>
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          {/* Featured Stories */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaArrowTrendUp className="text-white text-sm" />
                </div>
                Featured Stories
              </h2>
              <Link
                href="/trends"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
              >
                View All
                <FaArrowRight className="text-sm" />
              </Link>
            </div>

            {featuredTrends.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredTrends.map((trend) => (
                  <TrendCard key={trend.slug} trend={trend} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <FaNewspaper className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Featured Stories Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Check back soon for the latest trending stories
                </p>
              </div>
            )}
          </section>

          {/* Trending Now Sidebar Component */}
          <TrendingNow trends={trends.slice(0, 10)} />

          {/* Stats Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <FaArrowTrendUp className="text-4xl mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold">{trends.length}</div>
                <div className="text-blue-200">Active Trends</div>
              </div>
              <div>
                <FaGlobe className="text-4xl mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-200">Real-time Updates</div>
              </div>
              <div>
                <FaFire className="text-4xl mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-blue-200">Monthly Readers</div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Ahead of the Trends
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Get real-time updates on what&apos;s trending across sports, entertainment, technology, and more. 
                Be the first to know what&apos;s spiking globally.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/trends"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore All Trends
                </Link>
                <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <FaSearch />
                  Search Trends
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}