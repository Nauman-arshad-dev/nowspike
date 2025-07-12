"use client";
import { Trend } from "@/types/trend";
import Link from "next/link";
import TrendImage from "./TrendImage";
import { formatDistanceToNow } from "date-fns";
import { FaArrowUp, FaClock, FaBookmark, FaShareAlt, FaEye } from "react-icons/fa";
import { useState } from "react";

declare global {
  interface Window {
    trackTrendView?: (title: string, category: string, spike: number) => void;
    trackTrendShare?: (title: string, platform: string) => void;
  }
}

interface TrendCardProps {
  trend: Trend;
  variant?: "default" | "featured" | "compact";
}

export default function TrendCard({ trend, variant = "default" }: TrendCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to localStorage or send to API
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: trend.title,
        text: trend.teaser,
        url: `/trends/${trend.slug}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/trends/${trend.slug}`);
    }
  };

  const getCardClasses = () => {
    const baseClasses = "group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700";

    switch (variant) {
      case "featured":
        return `${baseClasses} lg:col-span-2`;
      case "compact":
        return `${baseClasses} flex flex-row`;
      default:
        return baseClasses;
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case "featured":
        return "h-64 lg:h-80";
      case "compact":
        return "h-24 w-24 flex-shrink-0";
      default:
        return "h-48";
    }
  };

  return (
    <Link 
          href={`/trends/${trend.slug}`} 
          className="group block"
          onClick={() => {
            if (typeof window !== 'undefined' && window.trackTrendView) {
              window.trackTrendView(trend.title, trend.category, trend.spike);
            }
          }}
        >
      <article 
        className={getCardClasses()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className={`relative ${getImageClasses()} overflow-hidden`}>
          <TrendImage
            src={trend.image || "/images/placeholder.jpg"}
            alt={trend.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
              {trend.category}
            </span>
          </div>

          {/* Spike Indicator */}
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <FaArrowUp className="text-xs" />
              {trend.spike}
            </div>
          </div>

          {/* Action Buttons (Visible on Hover) */}
          <div className={`absolute bottom-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isBookmarked 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            >
              <FaBookmark className="text-xs" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
              title="Share article"
            >
              <FaShareAlt className="text-xs" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${variant === "compact" ? "flex-1" : ""}`}>
          {/* Title */}
          <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3 ${
            variant === "featured" ? "text-2xl" : variant === "compact" ? "text-base" : "text-lg"
          }`}>
            {trend.title}
          </h3>

          {/* Teaser */}
          {variant !== "compact" && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
              {trend.teaser}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FaClock className="text-gray-400" />
                <span>{formatDistanceToNow(new Date(trend.timestamp), { addSuffix: true })}</span>
              </div>
              {variant !== "compact" && (
                <div className="flex items-center gap-1">
                  <FaEye className="text-gray-400" />
                  <span>{Math.floor(Math.random() * 5000) + 1000} views</span>
                </div>
              )}
            </div>

            {/* Read Time Estimate */}
            {variant !== "compact" && (
              <span className="text-gray-400">
                {Math.ceil(trend.content.reduce((acc, block) => acc + block.value.split(' ').length, 0) / 200)} min read
              </span>
            )}
          </div>

          {/* Related Topics (Featured variant only) */}
          {variant === "featured" && trend.relatedTopics && trend.relatedTopics.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {trend.relatedTopics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
                {trend.relatedTopics.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{trend.relatedTopics.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover Effect Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </article>
    </Link>
  );
}