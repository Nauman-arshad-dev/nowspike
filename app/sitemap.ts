// app/sitemap.ts
import type { MetadataRoute } from "next";
import { Trend } from "@/types/trend";

async function getTrends(): Promise<Trend[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }
  const res = await fetch(`${baseUrl}/api/trends`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trends");
  const { data } = await res.json();
  return data || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://nowspike.com";
  const trends = await getTrends();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  const trendPages: MetadataRoute.Sitemap = trends.map((trend) => ({
    url: `${baseUrl}/trends/${trend.slug}`,
    lastModified: new Date(trend.timestamp).toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.7,
    images: trend.image ? [`${baseUrl}${trend.image}`] : undefined, // Prepend baseUrl to make image URL absolute
  }));

  return [...staticPages, ...trendPages];
}