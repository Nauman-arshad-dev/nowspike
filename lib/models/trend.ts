// E:\nauman\NowSpike\frontend\lib\models\trend.ts
import mongoose, { Schema } from "mongoose";

export interface ContentBlock {
  type: "paragraph" | "image" | "video" | "x-embed";
  title?: string; // New optional title field
  value: string;
  image?: string; // New optional image field for paragraph blocks
  caption?: string;
}

export interface Trend {
  title: string;
  teaser: string;
  slug: string;
  spike: string;
  content: ContentBlock[];
  timestamp: string;
  category: string;
  isHero: boolean;
  relatedTopics?: string[];
  relatedQueries?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const trendSchema = new Schema<Trend>({
  title: { type: String, required: true },
  teaser: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  spike: { type: String, required: true },
  content: [{
    type: { type: String, enum: ["paragraph", "image", "video", "x-embed"], required: true },
    title: { type: String }, // New optional title field
    value: { type: String, required: true },
    image: { type: String }, // New optional image field
    caption: { type: String },
  }],
  timestamp: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      "Arts & Entertainment",
      "Autos & Vehicles",
      "Beauty & Fitness",
      "Books & Literature",
      "Business & Industrial",
      "Computers & Electronics",
      "Finance",
      "Food & Drink",
      "Games",
      "Health",
      "Hobbies & Leisure",
      "Home & Garden",
      "Internet & Telecom",
      "Jobs & Education",
      "Law & Government",
      "News",
      "Online Communities",
      "People & Society",
      "Pets & Animals",
      "Real Estate",
      "Science",
      "Shopping",
      "Sports",
      "Travel & Transportation"
    ]
  },
  isHero: { type: Boolean, default: false },
  relatedTopics: { type: [String] },
  relatedQueries: { type: [String] },
  image: { type: String, default: "/images/placeholder.jpg" },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

export const TrendModel = mongoose.models.Trend || mongoose.model<Trend>("Trend", trendSchema);