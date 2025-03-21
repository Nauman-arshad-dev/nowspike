// E:\nauman\NowSpike\frontend\app\layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import Link from "next/link";
import { FaSearch, FaTwitter, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import Script from "next/script";
import { Trend } from "@/types/trend";

interface TrendsResponse {
  data: Trend[];
}

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

async function fetchTrends(): Promise<Trend[]> {
  try {
    const res = await fetch("/api/trends", { next: { revalidate: 60 } }); // Cache for 60 seconds
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
  const topTrends = trends.map((t: Trend) => t.title).join(", ");

  if (trends.length === 0) {
    return {
      title: "NowSpike - Today’s Trending Topics",
      description: "Discover what’s spiking now. Updated daily from Google.",
      keywords: "trends, nowspike, daily news, google, sports, entertainment",
      openGraph: {
        title: "NowSpike - Today’s Trending Topics",
        description: "Check out the latest trends spiking across the U.S.!",
        url: "https://nowspike.com",
        type: "website",
      },
    };
  }

  return {
    title: "NowSpike - Today’s Trending Topics",
    description: `Discover what’s spiking now: ${topTrends}. Updated daily from Google.`,
    keywords: `${topTrends}, trends, nowspike, daily news, google, sports, entertainment`,
    openGraph: {
      title: "NowSpike - Today’s Trending Topics",
      description: `Check out the latest trends spiking across the U.S.: ${topTrends}!`,
      url: "https://nowspike.com",
      type: "website",
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
    <html lang="en">
      <head>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4CGXYV02DR"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4CGXYV02DR');
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <header className="bg-[var(--navy-blue)] text-white py-4 px-4 fixed top-0 left-0 w-full z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <Link href="/" className="hover:text-[var(--soft-blue)] transition flex items-center gap-2" title="Home">
              <Image
                src="/logo.svg"
                alt="NowSpike Logo"
                width={40}
                height={40}
                className="hover:opacity-90 transition-opacity w-8 sm:w-10"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold">NowSpike</h1>
                <p className="text-xs sm:text-sm opacity-80">What’s spiking now</p>
              </div>
            </Link>
            <nav className="w-full sm:w-auto hidden sm:block">
              <div className="flex items-center gap-4 justify-center">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search trends..."
                    className="px-3 py-2 rounded-lg bg-[var(--white)] text-[var(--navy-blue)] placeholder-[var(--gray)] w-full focus:outline-none focus:ring-2 focus:ring-[var(--soft-blue)] text-sm sm:text-base"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--gray)]" />
                </div>
                {trends.length > 0 && (
                  <div className="relative group">
                    <button className="text-sm sm:text-base hover:text-[var(--soft-blue)] transition">
                      Top Trends
                    </button>
                    <div className="absolute hidden group-hover:block bg-white text-[var(--navy-blue)] rounded-lg shadow-md mt-2 p-2">
                      {trends.slice(0, 5).map((trend) => (
                        <Link
                          key={trend.slug}
                          href={`/trends/${trend.slug}`}
                          className="block px-2 py-1 hover:bg-[var(--soft-blue)] hover:text-white rounded text-sm"
                        >
                          {trend.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-10 sm:py-20 px-2 sm:px-4">
          <ClientProvider>{children}</ClientProvider>
        </main>

        <footer className="bg-[var(--navy-blue)] text-white py-4 sm:py-6 text-center text-xs sm:text-sm">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 sm:gap-6 lg:gap-1">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Image
                src="/logo.svg"
                alt="NowSpike Logo"
                width={24}
                height={24}
                className="w-5 sm:w-10"
              />
              <p>© 2025 NowSpike. All rights reserved.</p>
            </div>
            <div className="flex flex-row gap-3 sm:gap-8 justify-center">
              <a href="https://twitter.com" className="hover:text-[var(--soft-blue)] p-2 sm:p-3 transition-colors">
                <FaTwitter size={20} className="sm:size-28 lg:size-8 " />
              </a>
              <a href="https://facebook.com" className="hover:text-[var(--soft-blue)] p-2 sm:p-3 transition-colors">
                <FaFacebook size={20} className="sm:size-28 lg:size-8 " />
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 sm:flex-row">
              <a href="/about" className="hover:text-[var(--soft-blue)] transition px-2 py-1 text-xs sm:text-lg sm:px-4 sm:py-2 whitespace-nowrap">
                About
              </a>
              <a href="/privacy" className="hover:text-[var(--soft-blue)] transition px-2 py-1 text-xs sm:text-lg sm:px-4 sm:py-2 whitespace-nowrap">
                Privacy
              </a>
              <a href="/contact" className="hover:text-[var(--soft-blue)] transition px-2 py-1 text-xs sm:text-lg sm:px-4 sm:py-2 whitespace-nowrap">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}