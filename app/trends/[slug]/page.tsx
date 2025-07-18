// E:\nauman\NowSpike\frontend\app\trends\[slug]\page.tsx
import { notFound } from "next/navigation";
import TrendImage from "@/components/TrendImage";
import { Trend, ContentBlock } from "@/types/trend";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaShareAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

async function getTrend(slug: string): Promise<Trend> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }

  const res = await fetch(`${baseUrl}/api/trends/${slug}`, { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch trend");
  }

  const trend: Trend = await res.json();
  if (!trend) notFound();

  return trend;
}

async function getRelatedTrends(category: string | undefined, currentSlug: string): Promise<Trend[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }

  const url = category && category !== "undefined"
    ? `${baseUrl}/api/trends?category=${category}`
    : `${baseUrl}/api/trends`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch related trends");
  }

  const { data } = await res.json();
  return (data || []).filter((trend: Trend) => trend.slug !== currentSlug).slice(0, 3);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const trend = await getTrend(resolvedParams.slug);
    return {
      title: `${trend.title} - NowSpike`,
      description: trend.teaser,
      alternates: {
        canonical: `https://www.nowspike.com/trends/${resolvedParams.slug}`,
      },
      openGraph: {
        title: trend.title,
        description: trend.teaser,
        url: `https://www.nowspike.com/trends/${resolvedParams.slug}`,
        images: trend.image ? [{ url: `https://www.nowspike.com${trend.image}` }] : [],
      },
    };
  } catch {
    return {
      title: "Not Found - NowSpike",
      description: "This trend could not be found on NowSpike.",
      alternates: {
        canonical: "https://www.nowspike.com",
      },
    };
  }
}

export default async function TrendPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const trend = await getTrend(resolvedParams.slug);
  const relatedTrends = await getRelatedTrends(trend.category, trend.slug);

  let formattedTimestamp = "Unknown Date";
  try {
    formattedTimestamp = formatDistanceToNow(new Date(trend.timestamp), { addSuffix: true });
  } catch {
    console.warn(`Invalid timestamp for trend ${trend.slug}: ${trend.timestamp}`);
  }

  return (
    <article className="max-w-6xl mx-auto py-6 sm:py-8 px-2 sm:px-4 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
      <section className="mb-8 sm:mb-12 bg-[var(--navy-blue)] text-[var(--white)] rounded-2xl shadow-xl p-3 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-gray-100 to-gray-200"></div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[--font-poppins] mb-3 sm:mb-4 leading-tight z-10 relative">
          {trend.title}
        </h1>
        <div className="w-full h-56 sm:h-72 lg:h-96 mb-3 sm:mb-4 rounded-xl shadow-lg overflow-hidden z-10 relative">
          <TrendImage
            src={trend.image || "/images/placeholder.jpg"}
            alt={trend.title}
            width={1400}
            height={700}
            priority
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <p className="text-base sm:text-lg lg:text-xl italic mb-3 sm:mb-4 leading-relaxed z-10 relative">{trend.teaser}</p>
        <div className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm z-10 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-[var(--white)]">
              <span className="font-medium bg-white/10 px-2 py-1 rounded">Trending at: {trend.spike}</span>
              <span className="hidden sm:inline">|</span>
              <span className="font-medium bg-white/10 px-2 py-1 rounded">Updated: {formattedTimestamp}</span>
            </div>
            <div className="flex gap-2 sm:gap-3 items-center">
              <button className="flex items-center gap-1 sm:gap-2 bg-[var(--white)] text-[var(--navy-blue)] px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-[var(--soft-blue)] hover:text-[var(--white)] transition text-xs sm:text-sm">
                <FaShareAlt /> Share
              </button>
              <a href={`https://twitter.com/intent/tweet?url=https://www.nowspike.com/trends/${trend.slug}`} className="text-[var(--white)] hover:text-[var(--soft-blue)]">
                <FaTwitter size={16} className="sm:size-5" />
              </a>
              <a href={`https://facebook.com/sharer/sharer.php?u=https://www.nowspike.com/trends/${trend.slug}`} className="text-[var(--white)] hover:text-[var(--soft-blue)]">
                <FaFacebook size={16} className="sm:size-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-12 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {Array.isArray(trend.content) && trend.content.length > 0 ? (
            trend.content.map((block: ContentBlock, index: number) => (
              <div
                key={index}
                className="mb-4 sm:mb-6 bg-[var(--white)] rounded-2xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg"
              >
                {block.title && (
                  <h3 className="text-xl sm:text-2xl font-semibold text-[var(--navy-blue)] mb-2 sm:mb-3 leading-tight">
                    {block.title}
                  </h3>
                )}
                {block.type === "paragraph" && (
                  <div>
                    {block.image && (
                      <TrendImage
                        src={block.image}
                        alt={block.title || "Paragraph Image"}
                        width={1000}
                        height={500}
                        loading="lazy"
                        className="w-full h-auto rounded-xl mb-3 sm:mb-4 shadow-md transition-transform duration-300 hover:scale-102"
                      />
                    )}
                    <p className="text-[var(--foreground)] text-base sm:text-lg leading-relaxed">{block.value}</p>
                  </div>
                )}
                {block.type === "image" && (
                  <figure>
                    <TrendImage
                      src={block.value}
                      alt={block.caption || trend.title}
                      width={1000}
                      height={500}
                      loading="lazy"
                      className="w-full h-auto rounded-xl shadow-md transition-transform duration-300 hover:scale-102"
                    />
                    {block.caption && (
                      <figcaption className="text-xs sm:text-sm text-[var(--muted-blue)] mt-2 italic">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
                {block.type === "video" && (
                  <div className="video-wrapper">
                    <iframe
                      src={block.value}
                      title={block.caption || "Video"}
                      className="w-full h-64 sm:h-72 lg:h-96 rounded-xl shadow-md"
                      allowFullScreen
                    />
                    {block.caption && (
                      <p className="text-xs sm:text-sm text-[var(--muted-blue)] mt-2 italic">{block.caption}</p>
                    )}
                  </div>
                )}
                {block.type === "x-embed" && (
                  <div className="bg-[var(--background)] p-2 sm:p-3 rounded-xl">
                    <p className="text-[var(--foreground)] text-sm sm:text-base">
                      [X Post: <a href={block.value} className="text-[var(--soft-blue)] hover:underline">{block.value}</a>]
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[var(--foreground)] text-base sm:text-lg">
              No content available for this trend.
            </p>
          )}
        </div>

        <aside className="flex flex-col gap-4 sm:gap-6">
          <div className="bg-[var(--white)] rounded-2xl shadow-md p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--navy-blue)] mb-2 sm:mb-3">Trend Insights</h2>
            <p className="text-[var(--foreground)] text-sm sm:text-base">
              Spiked to <strong className="text-[var(--navy-blue)]">{trend.spike}</strong> in searches, reported{" "}
              <span className="italic text-[var(--muted-blue)]">{formattedTimestamp}</span>.
            </p>
          </div>
          <div className="bg-[var(--white)] rounded-2xl shadow-md p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--navy-blue)] mb-2 sm:mb-3">Social Buzz</h2>
            <ul className="space-y-2 sm:space-y-3 text-[var(--foreground)] text-sm sm:text-base">
              <li>“AI nonsense is out of control!” - @Fan123</li>
              <li>“#ProtectCeline - this is terrifying!” - @MusicLover</li>
            </ul>
          </div>
        </aside>
      </section>

      {((trend.relatedTopics?.length ?? 0) > 0 || (trend.relatedQueries?.length ?? 0) > 0) && (
        <section className="mb-8 sm:mb-12 bg-[var(--white)] rounded-2xl shadow-md p-3 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          {trend.relatedTopics && trend.relatedTopics.length > 0 && (
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-[var(--navy-blue)] mb-2 sm:mb-3">Related Topics</h2>
              <ul className="list-disc list-inside text-[var(--foreground)] text-sm sm:text-base space-y-1">
                {trend.relatedTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
          {trend.relatedQueries && trend.relatedQueries.length > 0 && (
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-[var(--navy-blue)] mb-2 sm:mb-3">Related Searches</h2>
              <ul className="list-disc list-inside text-[var(--foreground)] text-sm sm:text-base space-y-1">
                {trend.relatedQueries.map((query) => (
                  <li key={query}>{query}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {relatedTrends.length > 0 && (
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--navy-blue)] mb-3 sm:mb-4">More in {trend.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {relatedTrends.map((related) => (
              <Link key={related.slug} href={`/trends/${related.slug}`} className="block">
                <div className="bg-[var(--white)] rounded-2xl shadow-md p-3 sm:p-4 transition-all duration-300 hover:shadow-lg">
                  <TrendImage
                    src={related.image || "/images/placeholder.jpg"}
                    alt={related.title}
                    width={400}
                    height={200}
                    loading="lazy"
                    className="w-full h-32 sm:h-36 object-cover rounded-xl mb-2 sm:mb-3 transition-transform duration-300 hover:scale-102"
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--navy-blue)] mb-1 sm:mb-2 line-clamp-2">{related.title}</h3>
                  <p className="text-[var(--foreground)] text-sm sm:text-base line-clamp-2">{related.teaser}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="text-xs sm:text-sm text-[var(--foreground)] bg-[var(--white)] rounded-2xl shadow-md p-3 sm:p-4">
        <p>
          Category: <span className="capitalize font-medium">{trend.category}</span>
        </p>
        {trend.isHero && (
          <p className="text-[var(--soft-blue)] font-medium mt-1">Featured</p>
        )}
      </section>
    </article>
  );
}