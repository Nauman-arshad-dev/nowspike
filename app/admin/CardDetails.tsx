// E:\nauman\NowSpike\frontend\app\admin\CardDetails.tsx
"use client";
import { ChangeEvent } from "react";

// Define ContentBlock (same as in page.tsx)
interface ContentBlock {
  type: "paragraph" | "image" | "video" | "x-embed";
  value: string; // Text, blob URL (frontend) or path (backend), or embed URL
  caption?: string; // Optional for images/videos
}

// Define FormTrend (aligned with page.tsx)
interface FormTrend {
  title?: string;
  teaser?: string;
  slug?: string;
  spike?: string;
  content?: ContentBlock[]; // Updated to ContentBlock[]
  timestamp?: string;
  category?: string;
  isHero?: boolean;
  relatedTopics?: string[];
  relatedQueries?: string[];
  image?: string | File;
  createdAt?: string;
  updatedAt?: string;
}

interface CardDetailsProps {
  form: Partial<FormTrend>;
  setForm: (form: Partial<FormTrend>) => void;
  editSlug: string | null;
}

export default function CardDetails({ form, setForm, editSlug }: CardDetailsProps) {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Title (e.g., Suns vs Mavericks)"
        value={form.title || ""}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="p-2 border rounded w-full"
        required
      />
      <input
        type="text"
        placeholder="Teaser (e.g., 20K+ searches as Suns and Mavericks clash!)"
        value={form.teaser || ""}
        onChange={(e) => setForm({ ...form, teaser: e.target.value })}
        className="p-2 border rounded w-full"
        required
      />
      <input
        type="text"
        placeholder="Slug (e.g., suns-vs-mavericks-march-9-2025)"
        value={form.slug || ""}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        className="p-2 border rounded w-full"
        required
        disabled={!!editSlug}
      />
      <input
        type="text"
        placeholder="Spike (e.g., 20K+ searches)"
        value={form.spike || ""}
        onChange={(e) => setForm({ ...form, spike: e.target.value })}
        className="p-2 border rounded w-full"
        required
      />
      <input
        type="text"
        placeholder="Timestamp (e.g., 5 hours ago)"
        value={form.timestamp || ""}
        onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
        className="p-2 border rounded w-full"
        required
      />
      <select
        value={form.category || ""}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="p-2 border rounded w-full"
        required
      >
        <option value="" disabled>Select Category</option>
        <option value="Arts & Entertainment">Arts & Entertainment</option>
        <option value="Autos & Vehicles">Autos & Vehicles</option>
        <option value="Beauty & Fitness">Beauty & Fitness</option>
        <option value="Books & Literature">Books & Literature</option>
        <option value="Business & Industrial">Business & Industrial</option>
        <option value="Computers & Electronics">Computers & Electronics</option>
        <option value="Finance">Finance</option>
        <option value="Food & Drink">Food & Drink</option>
        <option value="Games">Games</option>
        <option value="Health">Health</option>
        <option value="Hobbies & Leisure">Hobbies & Leisure</option>
        <option value="Home & Garden">Home & Garden</option>
        <option value="Internet & Telecom">Internet & Telecom</option>
        <option value="Jobs & Education">Jobs & Education</option>
        <option value="Law & Government">Law & Government</option>
        <option value="News">News</option>
        <option value="Online Communities">Online Communities</option>
        <option value="People & Society">People & Society</option>
        <option value="Pets & Animals">Pets & Animals</option>
        <option value="Real Estate">Real Estate</option>
        <option value="Science">Science</option>
        <option value="Shopping">Shopping</option>
        <option value="Sports">Sports</option>
        <option value="Travel & Transportation">Travel & Transportation</option>
      </select>
      <div className="flex flex-col">
        <label htmlFor="image-upload" className="text-sm text-gray-600 mb-1">
          Upload Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 border rounded w-full"
        />
        {form.image && typeof form.image === "string" && (
          <p className="text-xs text-gray-500 mt-1">Current: {form.image}</p>
        )}
      </div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={form.isHero || false}
          onChange={(e) => setForm({ ...form, isHero: e.target.checked })}
          className="mr-2"
        />
        Set as Hero Trend
      </label>
    </div>
  );
}