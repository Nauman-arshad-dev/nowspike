// app/sitemap.ts
import type { MetadataRoute } from "next";
import { Trend } from "@/types/trend";

async function getTrends(): Promise<Trend[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }
  try {
    const res = await fetch(`${baseUrl}/api/trends`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch trends: ${res.status} ${res.statusText}`);
    }
    const { data } = await res.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching trends for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.nowspike.com";
  let trends: Trend[] = [];

  try {
    trends = await getTrends();
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  const trendPages: MetadataRoute.Sitemap = trends.map((trend) => {
    let lastModified: string;
    try {
      // Use updatedAt for lastModified to reflect the most recent update
      const date = new Date(trend.updatedAt);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid updatedAt");
      }
      lastModified = date.toISOString();
    } catch {
      console.warn(`Invalid updatedAt for trend ${trend.slug}: ${trend.updatedAt}. Using current date as fallback.`);
      lastModified = new Date().toISOString();
    }

    // Ensure the image URL is absolute
    const imageUrl = trend.image
      ? trend.image.startsWith("http")
        ? trend.image
        : `${baseUrl}${trend.image.startsWith("/") ? "" : "/"}${trend.image}`
      : undefined;

    return {
      url: `${baseUrl}/trends/${trend.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
      images: imageUrl ? [imageUrl] : undefined,
    };
  });

  return [...staticPages, ...trendPages];
}