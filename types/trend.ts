// Define ContentBlock interface
export interface ContentBlock {
  type: "paragraph" | "image" | "video" | "x-embed";
  title?: string; // New optional title field
  value: string; // Text, image path, or URL
  image?: string; // New optional image field for paragraph blocks
  caption?: string; // Optional for images/videos
}

export interface Trend {
  title: string;
  teaser: string;
  slug: string;
  spike: string;
  content: ContentBlock[]; // Updated to ContentBlock[]
  timestamp: string;
  category: string;
  isHero: boolean;
  relatedTopics?: string[];
  relatedQueries?: string[];
  image?: string; // Hero image
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  title: string;
  spike: string;
  timestamp: string;
  slug: string;
}

export interface TrendData {
  hero: Trend;
  trends: Trend[];
  categories: { [key: string]: Trend[] };
  updates: Update[];
}