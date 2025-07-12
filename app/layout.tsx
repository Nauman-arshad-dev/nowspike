
// E:\nauman\NowSpike\frontend\app\layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import Link from "next/link";
import { FaSearch, FaTwitter, FaFacebook, FaHome, FaNewspaper } from "react-icons/fa";
import Image from "next/image";
import { Trend } from "@/types/trend";
import AnalyticsScripts from "@/components/AnalyticsScripts";

interface TrendsResponse {
  data: Trend[];
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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

export async function generateMetadata(): Promise<Metadata> {
  const trends = await fetchTrends();
  const topTrends = trends.map((t: Trend) => t.title).join(", ");

  const baseMetadata: Metadata = {
    metadataBase: new URL("https://www.nowspike.com"),
    title: {
      template: "%s | NowSpike",
      default: "NowSpike - Today's Trending Topics",
    },
    description: "Discover what's spiking now. Updated daily from Google.",
    keywords: "trends, nowspike, daily news, google, sports, entertainment",
    alternates: {
      canonical: "https://www.nowspike.com",
    },
    openGraph: {
      title: "NowSpike - Today's Trending Topics",
      description: "Check out the latest trends spiking across the U.S.!",
      url: "/",
      type: "website",
    },
  };

  if (trends.length === 0) {
    return baseMetadata;
  }

  return {
    ...baseMetadata,
    description: `Discover what's spiking now: ${topTrends}. Updated daily from Google.`,
    keywords: `${topTrends}, trends, nowspike, daily news, google, sports, entertainment`,
    openGraph: {
      ...baseMetadata.openGraph,
      description: `Check out the latest trends spiking across the U.S.: ${topTrends}!`,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trends = await fetchTrends();

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <AnalyticsScripts />
        
        {/* Header */}
        <header className="header fixed top-0 left-0 w-full z-50">
          <div className="container">
            <div className="header-content">
              <Link href="/" className="header-logo" title="NowSpike - Home">
                <Image
                  src="/logo.svg"
                  alt="NowSpike Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <span className="text-2xl font-black tracking-tight">NowSpike</span>
                  <p className="text-sm opacity-90 hidden sm:block font-medium">What&apos;s spiking now</p>
                </div>
              </Link>
              
              <nav className="header-nav">
                <div className="header-search">
                  <input
                    type="text"
                    placeholder="Search trends..."
                    className="w-full"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    <FaHome className="text-sm" />
                    <span className="text-sm font-medium">Home</span>
                  </Link>
                  
                  {trends.length > 0 && (
                    <div className="relative group">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                        <FaNewspaper className="text-sm" />
                        <span className="text-sm font-medium">Top Trends</span>
                      </button>
                      <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg mt-2 p-3 w-72 right-0 border border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          {trends.slice(0, 5).map((trend) => (
                            <Link
                              key={trend.slug}
                              href={`/trends/${trend.slug}`}
                              className="block px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                            >
                              <div className="font-medium line-clamp-1">{trend.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {trend.category} • {trend.spike}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow pt-20 lg:pt-24">
          <div className="container">
            <ClientProvider>{children}</ClientProvider>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer mt-auto">
          <div className="container">
            <div className="footer-content">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="NowSpike Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div>
                  <p className="font-semibold">NowSpike</p>
                  <p className="text-sm opacity-80">© 2025 All rights reserved</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <a 
                  href="https://twitter.com" 
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={20} />
                </a>
                <a 
                  href="https://facebook.com" 
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
              </div>
              
              <div className="footer-links">
                <Link href="/about">About</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
