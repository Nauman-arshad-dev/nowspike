import { Trend } from "@/types/trend";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaEye, FaShareAlt } from "react-icons/fa";

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 w-full">
      {/* Image */}
      {trend.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={trend.image}
            alt={trend.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {trend.category}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {trend.spike}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 text-sm">
          <FaClock />
          <span>{new Date(trend.timestamp).toLocaleDateString()}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {trend.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
          {trend.teaser}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/trends/${trend.slug}`}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm flex items-center gap-2"
          >
            <FaEye />
            Read More
          </Link>

          <button
            onClick={handleShare}
            className="text-gray-500 hover:text-blue-600 transition-colors duration-300 p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg"
            title="Share this trend"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
    </div>
  );
}