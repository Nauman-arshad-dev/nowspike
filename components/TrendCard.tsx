
import { Trend } from "@/types/trend";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaEye, FaShareAlt, FaTag } from "react-icons/fa";

interface TrendCardProps {
  trend: Trend;
}

export default function TrendCard({ trend }: TrendCardProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trend.title,
          text: trend.teaser,
          url: `/trends/${trend.slug}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/trends/${trend.slug}`);
    }
  };

  return (
    <article className="card card-interactive group">
      {/* Image Section */}
      {trend.image && (
        <div className="image-container h-56 mb-6 relative">
          <Image
            src={trend.image}
            alt={trend.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="tag tag-category">
              <FaTag className="text-xs" />
              {trend.category}
            </span>
          </div>
          
          {/* Spike Badge */}
          <div className="absolute top-4 right-4">
            <span className="tag tag-spike">
              {trend.spike}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col h-full">
        {/* Meta Information */}
        <div className="card-meta">
          <FaClock className="text-sm opacity-80" />
          <span>{new Date(trend.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
        </div>

        {/* Title */}
        <h3 className="card-title group-hover:text-blue-600 transition-colors duration-300">
          {trend.title}
        </h3>

        {/* Description */}
        <p className="card-content line-clamp-3 flex-grow">
          {trend.teaser}
        </p>

        {/* Actions */}
        <div className="card-actions pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/trends/${trend.slug}`}
            className="btn btn-primary btn-sm flex-1 justify-center"
          >
            <FaEye className="text-sm" />
            Read Full Story
          </Link>

          <button
            onClick={handleShare}
            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
            title="Share this trend"
            aria-label="Share trend"
          >
            <FaShareAlt className="text-sm" />
          </button>
        </div>
      </div>
    </article>
  );
}
