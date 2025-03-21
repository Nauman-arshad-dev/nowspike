// E:\nauman\NowSpike\frontend\components\TrendImage.tsx
import Image from "next/image";
import { FC } from "react";

interface TrendImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager"; // Add loading prop with valid values
}

const TrendImage: FC<TrendImageProps> = ({ src, alt, width, height, className, priority, loading }) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    priority={priority}
    loading={loading} // Pass loading to Next.js Image
  />
);

export default TrendImage;