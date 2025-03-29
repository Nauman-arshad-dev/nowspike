// E:\nauman\NowSpike\frontend\components\TrendingNow.tsx
"use client";

import { useState, useEffect } from "react";
import TrendCard from "./TrendCard";
import { Trend } from "@/types/trend";

interface TrendingNowProps {
  initialTrends: Trend[];
}

export default function TrendingNow({ initialTrends }: TrendingNowProps) {
  const [trends, setTrends] = useState<Trend[]>(initialTrends);
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTrends.length > 10);

  useEffect(() => {
    setTrends(initialTrends);
    setDisplayCount(10);
    setHasMore(initialTrends.length > 10);
  }, [initialTrends]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newDisplayCount = displayCount + 10;
      setDisplayCount(newDisplayCount);
      setHasMore(newDisplayCount < trends.length);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    console.log("initialTrends.length:", initialTrends.length);
    console.log("trends.length:", trends.length);
    console.log("displayCount:", displayCount);
    console.log("hasMore:", hasMore);
  }, [initialTrends, trends, displayCount, hasMore]);

  return (
    <section className="max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4 lg:py-12">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-[--font-poppins] text-[var(--navy-blue)] mb-3 sm:mb-4 lg:mb-6 flex items-center flex-wrap">
        Trending Now
        <span className="ml-2 text-xs sm:text-sm text-[var(--soft-blue)]">
          ({trends.length} active trends)
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {trends.slice(0, displayCount).map((trend) => (
          <TrendCard key={trend.slug} {...trend} />
        ))}
      </div>
      {trends.length > 0 && hasMore && (
        <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={`px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--soft-blue)] text-[var(--white)] hover:bg-[var(--navy-blue)]"
            }`}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}