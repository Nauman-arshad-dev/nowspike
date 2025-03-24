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
  const [displayCount, setDisplayCount] = useState(10); // Start with 10 trends
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTrends.length > 10);

  // Update trends when initialTrends changes
  useEffect(() => {
    setTrends(initialTrends);
    setDisplayCount(10); // Reset display count on new trends
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

  // Debug logs to verify state
  useEffect(() => {
    console.log("initialTrends.length:", initialTrends.length);
    console.log("trends.length:", trends.length);
    console.log("displayCount:", displayCount);
    console.log("hasMore:", hasMore);
  }, [initialTrends, trends, displayCount, hasMore]);

  return (
    <section className="max-w-7xl mx-auto py-8 sm:py-12 px-2 sm:px-6 lg:py-16">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-[--font-poppins] text-[var(--navy-blue)] mb-4 lg:mb-6 flex items-center flex-wrap">
        Trending Now
        <span className="ml-2 text-xs sm:text-sm lg:text-base text-[var(--soft-blue)]">
          ({trends.length} active trends)
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {trends.slice(0, displayCount).map((trend) => (
          <TrendCard key={trend.slug} {...trend} />
        ))}
      </div>
      {trends.length > 0 && hasMore && (
        <div className="mt-6 sm:mt-8 lg:mt-10 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--soft-blue)] text-white hover:bg-[var(--navy-blue)]"
            }`}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}