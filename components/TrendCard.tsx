
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
        <div className="image-container h-48 mb-4 relative">
          <Image
            src={trend.image}
            alt={trend.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <FaTag className="text-xs" />
              {trend.category}
            </span>
          </div>
          
          {/* Spike Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {trend.spike}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4">
        {/* Meta Information */}
        <div className="card-meta">
          <FaClock className="text-sm" />
          <span>{new Date(trend.timestamp).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h3 className="card-title group-hover:text-blue-600 transition-colors duration-300">
          {trend.title}
        </h3>

        {/* Description */}
        <p className="card-content line-clamp-3">
          {trend.teaser}
        </p>

        {/* Actions */}
        <div className="card-actions">
          <Link
            href={`/trends/${trend.slug}`}
            className="btn btn-primary btn-sm"
          >
            <FaEye />
            Read More
          </Link>

          <button
            onClick={handleShare}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
            title="Share this trend"
            aria-label="Share trend"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
    </article>
  );
}
