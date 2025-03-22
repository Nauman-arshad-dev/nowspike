/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://nowspike.com",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    // Exclude admin pages from the sitemap
    exclude: ["/admin", "/admin/login"],
    // Add static pages manually if needed
    additionalPaths: async (config) => {
      const staticPaths = [
        { loc: "/", changefreq: "daily", priority: 1.0 },
        { loc: "/trends", changefreq: "daily", priority: 0.8 },
        { loc: "/about", changefreq: "weekly", priority: 0.5 },
        { loc: "/contact", changefreq: "weekly", priority: 0.5 },
      ];
  
      // Fetch dynamic trend pages from your API
      let trendPaths = [];
      try {
        const response = await fetch("https://nowspike.com/api/trends");
        if (!response.ok) {
          throw new Error("Failed to fetch trends");
        }
        const trendsData = await response.json();
        const trends = trendsData.data || [];
        trendPaths = trends.map((trend) => ({
          loc: `/trends/${trend.slug}`,
          changefreq: "daily",
          priority: 0.8,
          lastmod: new Date(trend.timestamp).toISOString(),
        }));
      } catch (error) {
        console.error("Error fetching trends for sitemap:", error);
      }
  
      return [...staticPaths, ...trendPaths];
    },
    // Ensure robots.txt includes the sitemap
    robotsTxtOptions: {
      policies: [
        { userAgent: "*", allow: "/" },
        { userAgent: "*", disallow: ["/admin", "/admin/login"] },
      ],
    },
  };