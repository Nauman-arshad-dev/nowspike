// E:\nauman\NowSpike\frontend\components\TrendCard.tsx
import { Trend } from "@/types/trend";
import Link from "next/link";
import TrendImage from "./TrendImage";
import { formatDistanceToNow } from "date-fns"; // Import date-fns

export default function TrendCard({
  title,
  teaser,
  slug,
  spike,
  timestamp,
  category,
  image,
}: Trend) {
  // Format the timestamp with error handling
  let formattedTimestamp = "Unknown Date";
  try {
    formattedTimestamp = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    console.warn(`Invalid timestamp for trend ${slug}: ${timestamp}`);
  }

  return (
    <Link href={`/trends/${slug}`} className="block">
      <div className="bg-[var(--white)] p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 sm:gap-4">
        {/* Image Section */}
        <div className="w-full">
          <TrendImage
            src={image || "/images/placeholder.jpg"}
            alt={title}
            width={300}
            height={150}
            className="w-full h-32 sm:h-40 object-cover rounded-lg"
          />
        </div>
        {/* Content Section */}
        <div className="flex flex-col gap-2">
          <span className="inline-block bg-[var(--soft-blue)] text-white text-xs font-semibold px-2 py-1 rounded-full w-fit">
            {spike}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[var(--navy-blue)] line-clamp-2">
            {title}
          </h3>
          <p className="text-[var(--gray)] text-sm line-clamp-2">{teaser}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--muted-blue)]">
              {category}
            </span>
            <span className="text-xs text-[var(--muted-blue)]">
              Updated {formattedTimestamp}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}