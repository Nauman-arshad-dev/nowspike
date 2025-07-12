// E:\nauman\NowSpike\frontend\app\page.tsx
import type { Metadata } from "next";
import TrendCard from "@/components/TrendCard";
import TrendImage from "@/components/TrendImage";
import { Trend } from "@/types/trend";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import TrendingNow from "@/components/TrendingNow";
import StructuredData from "@/components/StructuredData";

async function getTrends(): Promise<Trend[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }
  const res = await fetch(`${baseUrl}/api/trends`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trends");
  const { data } = await res.json();
  return data || [];
}

export async function generateMetadata(): Promise<Metadata> {
  const trends = await getTrends();
  const hero = trends.find((trend) => trend.isHero) || trends[0];

  return {
    title: hero ? `${hero.title}` : "NowSpike - Trending News & Daily Updates from Google",
    description: hero
      ? hero.teaser
      : "Explore the latest trending topics updated daily on NowSpike—your go-to source for Arts, Tech, Health, Sports, Autos, Beauty, and more from Google.",
    alternates: {
      canonical: "https://www.nowspike.com",
    },
    keywords: [
      "trending news",
      "daily updates",
      "Google",
      "Arts & Entertainment",
      "Autos & Vehicles",
      "Beauty & Fitness",
      "Books & Literature",
      "Business & Industrial",
      "Computers & Electronics",
      "Finance",
      "Food & Drink",
      "Games",
      "Health",
      "Hobbies & Leisure",
      "Home & Garden",
      "Internet & Telecom",
      "Jobs & Education",
      "Law & Government",
      "News",
      "Online Communities",
      "People & Society",
      "Pets & Animals",
      "Real Estate",
      "Science",
      "Shopping",
      "Sports",
      "Travel",
    ].join(", "),
    openGraph: {
      title: hero ? `${hero.title} | NowSpike Trending News` : "NowSpike - Trending News & Daily Updates",
      description: hero
        ? hero.teaser
        : "Stay ahead with daily trending topics from Google on NowSpike—Arts, Tech, Health, and more!",
      url: "https://www.nowspike.com",
      type: "website",
      images: [
        {
          url: hero?.image || "/images/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: hero?.title || "NowSpike Trending News",
        },
      ],
    },
  };
}

export default async function Home() {
  const trends = await getTrends();
  const hero = trends.find((trend) => trend.isHero) || trends[0];
  const nonHeroTrends = trends.filter((trend) => trend !== hero);

  const categories = nonHeroTrends.reduce((acc, trend) => {
    acc[trend.category] = acc[trend.category] || [];
    acc[trend.category].push(trend);
    return acc;
  }, {} as Record<string, Trend[]>);

  const uniqueCategories = Object.keys(categories).sort();
  const tickerTrends = nonHeroTrends.slice(0, 5).map((t) => `${t.title} - ${t.spike}`);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "NowSpike",
    url: "https://www.nowspike.com",
    description: "NowSpike delivers daily trending news across 24 categories sourced from Google.",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.nowspike.com",
    },
    article: [
      {
        "@type": "NewsArticle",
        headline: hero.title,
        image: [hero.image || "https://www.nowspike.com/images/default-og-image.jpg"],
        datePublished: hero.timestamp,
        dateModified: hero.updatedAt,
        author: {
          "@type": "Organization",
          name: "NowSpike",
        },
        publisher: {
          "@type": "Organization",
          name: "NowSpike",
          logo: {
            "@type": "ImageObject",
            url: "https://www.nowspike.com/logo.svg",
          },
        },
        description: hero.teaser,
        url: `https://www.nowspike.com/trends/${hero.slug}`,
      },
      ...nonHeroTrends.slice(0, 4).map((trend) => ({
        "@type": "NewsArticle",
        headline: trend.title,
        image: [trend.image || "https://www.nowspike.com/images/default-og-image.jpg"],
        datePublished: trend.timestamp,
        dateModified: trend.updatedAt,
        author: {
          "@type": "Organization",
          name: "NowSpike",
        },
        publisher: {
          "@type": "Organization",
          name: "NowSpike",
          logo: {
            "@type": "ImageObject",
            url: "https://www.nowspike.com/logo.svg",
          },
        },
        description: trend.teaser,
        url: `https://www.nowspike.com/trends/${trend.slug}`,
      })),
    ],
  };

  return (
    <div className="min-h-screen text-[var(--foreground)] bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className="bg-gradient-to-r from-[var(--navy-blue)] to-[#1A3A6D] text-[var(--white)] py-2 sm:py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center px-2 sm:px-4">
          <span className="bg-[var(--breaking-red)] text-[var(--white)] font-bold text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full shrink-0">
            BREAKING
          </span>
          <div className="flex-1 overflow-hidden ml-2 sm:ml-3">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-3 sm:gap-6">
              {tickerTrends.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs sm:text-sm font-medium text-[var(--white)] hover:text-[var(--soft-blue)] transition-colors duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hero && (
        <section className="relative bg-[var(--navy-blue)] text-[var(--white)] py-6 sm:py-8 lg:py-12 px-2 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="w-full lg:w-1/2">
                <TrendImage
                  src={hero.image || "/images/placeholder.jpg"}
                  alt={hero.title}
                  width={1200}
                  height={600}
                  priority
                  className="w-full h-56 sm:h-72 lg:h-96 object-cover rounded-xl shadow-2xl"
                />
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <span className="inline-block bg-[var(--soft-blue)] text-[var(--white)] text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 lg:mb-4">
                  {hero.spike}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[--font-poppins] mb-2 sm:mb-3 lg:mb-4 leading-tight">
                  {hero.title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-xl mx-auto lg:mx-0 line-clamp-3">
                  {hero.teaser}
                </p>
                <div className="mt-3 sm:mt-4 lg:mt-6 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 sm:gap-4">
                  <Link
                    href={`/trends/${hero.slug}`}
                    className="inline-block bg-[var(--soft-blue)] text-[var(--white)] font-bold text-sm sm:text-base px-4 sm:px-5 py-2 rounded-lg hover:bg-[var(--white)] hover:text-[var(--navy-blue)] transition-all duration-300 shadow-md"
                  >
                    Read More
                  </Link>
                  <span className="text-xs sm:text-sm text-[var(--white)] font-medium bg-white/10 px-2 sm:px-3 py-1 rounded-lg">
                    Updated {formatDistanceToNow(new Date(hero.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-blue)]/80 via-transparent to-transparent opacity-70" />
        </section>
      )}

      <section className="max-w-7xl mx-auto py-2 sm:py-3 px-2 sm:px-4 sticky top-16 sm:top-20 bg-gradient-to-b from-[var(--white)] to-gray-50 z-40 shadow-md">
        <div className="flex items-center overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[var(--soft-blue)] scrollbar-track-gray-200 pb-2">
          {uniqueCategories.map((cat) => (
            <Link
              key={cat}
              href={`#${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[var(--navy-blue)] text-[var(--white)] rounded-full hover:bg-[var(--soft-blue)] transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap mx-1 sm:mx-1.5 shadow-sm hover:shadow-md"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <TrendingNow initialTrends={nonHeroTrends} />

      <section className="max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4 lg:py-12">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-[--font-poppins] text-[var(--navy-blue)] mb-3 sm:mb-4 lg:mb-6">
          Explore by Category
        </h2>
        {Object.entries(categories).map(([category, items]) => (
          <div
            key={category}
            className="mb-6 sm:mb-8 lg:mb-12"
            id={category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}
          >
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-[--font-poppins] text-[var(--navy-blue)] capitalize mb-2 sm:mb-3 lg:mb-4">
              {category}
            </h3>
            <div className="flex overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[var(--soft-blue)] scrollbar-track-gray-200 gap-3 sm:gap-4 pb-4">
              {items.map((trend) => (
                <div key={trend.slug} className="flex-shrink-0 w-60 sm:w-64 lg:w-72">
                  <TrendCard {...trend} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4 lg:py-12">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-[--font-poppins] text-[var(--navy-blue)] mb-3 sm:mb-4 lg:mb-6">
          Related Categories
        </h2>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {uniqueCategories.slice(0, 5).map((cat) => (
            <Link
              key={cat}
              href={`#${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
              className="text-[var(--soft-blue)] hover:underline text-sm sm:text-base"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4 lg:py-12 lg:flex lg:flex-row lg:gap-6">
        <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-[--font-poppins] text-[var(--navy-blue)] mb-3 sm:mb-4 lg:mb-6">
            Featured Stories
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {nonHeroTrends.slice(0, 2).map((trend) => (
              <div
                key={trend.slug}
                className="bg-[var(--white)] p-3 sm:p-4 lg:p-6 rounded-xl shadow-md flex flex-col sm:flex-row gap-3 sm:gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-full sm:w-1/3">
                  <TrendImage
                    src={trend.image || "/images/placeholder.jpg"}
                    alt={trend.title}
                    width={300}
                    height={150}
                    className="w-full h-20 sm:h-24 lg:h-28 object-cover rounded-lg"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[var(--navy-blue)] line-clamp-2">
                    {trend.title}
                  </h3>
                  <p className="text-[var(--gray)] text-xs sm:text-sm line-clamp-2">{trend.teaser}</p>
                  <Link
                    href={`/trends/${trend.slug}`}
                    className="text-[var(--soft-blue)] hover:underline text-xs sm:text-sm inline-block mt-2"
                  >
                    Read Full Story
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-[--font-poppins] text-[var(--navy-blue)] mb-3 sm:mb-4 lg:mb-6">
            Latest Updates
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {nonHeroTrends.slice(0, 5).map((trend) => (
              <li
                key={trend.slug}
                className="text-xs sm:text-sm flex flex-row gap-1 sm:gap-2"
              >
                <Link
                  href={`/trends/${trend.slug}`}
                  className="text-[var(--soft-blue)] hover:underline hover:text-[var(--navy-blue)] flex flex-row items-center gap-1 sm:gap-2 w-full"
                >
                  <span className="flex-1 truncate">{trend.title}</span>
                  <span className="flex-shrink-0 whitespace-nowrap text-[var(--muted-blue)]">
                    Updated {formatDistanceToNow(new Date(trend.timestamp), { addSuffix: true })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 sm:mt-6 bg-[var(--white)] p-3 sm:p-4 rounded-xl shadow-md">
            <p className="text-xs sm:text-sm text-[var(--gray)]">
              Join <strong>10K+ readers</strong> getting daily trend updates!
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4 lg:py-12 bg-[var(--navy-blue)] text-[var(--white)] rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-[--font-poppins] mb-2 sm:mb-3 lg:mb-4">
            Stay Ahead of the Trends
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 lg:mb-6 opacity-90">
            Subscribe for daily updates on what’s spiking now.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 sm:px-4 py-2 rounded-lg bg-[var(--white)] text-[var(--navy-blue)] placeholder-[var(--gray)] w-full focus:outline-none focus:ring-2 focus:ring-[var(--soft-blue)] text-sm sm:text-base"
            />
            <button className="bg-[var(--soft-blue)] px-4 sm:px-5 py-2 rounded-lg hover:bg-[var(--white)] hover:text-[var(--navy-blue)] transition font-semibold text-sm sm:text-base">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}