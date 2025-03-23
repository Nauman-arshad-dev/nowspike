// E:\nauman\NowSpike\frontend\app\admin\page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import CardDetails from "./CardDetails";
import CardContent from "./CardContent";
import { Trend } from "@/types/trend";

interface FormTrend {
  title?: string;
  teaser?: string;
  slug?: string;
  spike?: string;
  content?: ContentBlock[];
  timestamp?: string;
  category?: string;
  isHero?: boolean;
  relatedTopics?: string[];
  relatedQueries?: string[];
  image?: string | File;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentBlock {
  type: "paragraph" | "image" | "video" | "x-embed";
  title?: string; // New optional title field
  value: string;
  image?: string; // New optional image field for paragraph blocks
  caption?: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trends, setTrends] = useState<Trend[]>([]);
  const [form, setForm] = useState<Partial<FormTrend>>({
    title: "",
    teaser: "",
    slug: "",
    spike: "",
    content: [{ type: "paragraph", value: "", title: "" }], // Include title in default block
    timestamp: "",
    category: "",
    isHero: false,
    relatedTopics: [],
    relatedQueries: [],
    image: "",
  });
  const [editSlug, setEditSlug] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
    } else {
      fetchTrends();
    }
  }, [session, status, router]);

  const fetchTrends = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
      }
      const res = await fetch(`${baseUrl}/api/trends`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch trends");
      const data = await res.json();
      setTrends(data.data || data);
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title || "");
    formData.append("teaser", form.teaser || "");
    formData.append("slug", form.slug || "");
    formData.append("spike", form.spike || "");

    const contentWithFiles: ContentBlock[] = form.content?.map((block, index) => {
      const newBlock = { ...block };
      if (block.type === "image" && block.value.startsWith("blob:")) {
        const fileInput = document.querySelector(`#image-upload-${index}`) as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          formData.append(`content-image-${index}`, file);
          newBlock.value = `content-image-${index}`;
        }
      }
      if (block.type === "paragraph" && block.image?.startsWith("blob:")) {
        const fileInput = document.querySelector(`#paragraph-image-upload-${index}`) as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          formData.append(`paragraph-image-${index}`, file);
          newBlock.image = `paragraph-image-${index}`;
        }
      }
      return newBlock;
    }) || [{ type: "paragraph", value: "", title: "" }];
    formData.append("content", JSON.stringify(contentWithFiles.filter(block => block.value)));

    formData.append("timestamp", form.timestamp || "");
    formData.append("category", form.category || "");
    formData.append("isHero", String(form.isHero || false));
    formData.append("relatedTopics", JSON.stringify(form.relatedTopics || []));
    formData.append("relatedQueries", JSON.stringify(form.relatedQueries || []));
    if (form.image instanceof File) {
      formData.append("image", form.image);
    } else {
      formData.append("image", form.image || "/images/placeholder.jpg");
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
    }

    const method = editSlug ? "PUT" : "POST";
    const url = editSlug ? `${baseUrl}/api/trends/${editSlug}` : `${baseUrl}/api/trends`;

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Request failed");
      }

      await fetchTrends();
      setEditSlug(null);
      setForm({
        title: "",
        teaser: "",
        slug: "",
        spike: "",
        content: [{ type: "paragraph", value: "", title: "" }],
        timestamp: "",
        category: "",
        isHero: false,
        relatedTopics: [],
        relatedQueries: [],
        image: "",
      });
      alert(editSlug ? "Trend updated successfully!" : "Trend added successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = (trend: Trend) => {
    setEditSlug(trend.slug);
    setForm({
      title: trend.title,
      teaser: trend.teaser,
      slug: trend.slug,
      spike: trend.spike,
      content: trend.content.length > 0 ? trend.content : [{ type: "paragraph", value: "", title: "" }],
      timestamp: trend.timestamp,
      category: trend.category,
      isHero: trend.isHero,
      relatedTopics: trend.relatedTopics || [],
      relatedQueries: trend.relatedQueries || [],
      image: trend.image || "",
      createdAt: trend.createdAt,
      updatedAt: trend.updatedAt,
    });
  };

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-[--font-poppins] text-blue-900">Admin Panel</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <CardDetails form={form} setForm={setForm} editSlug={editSlug} />
        <CardContent
          content={form.content || [{ type: "paragraph", value: "", title: "" }]}
          setContent={(content) => setForm({ ...form, content })}
        />
        <div className="mt-4">
          <input
            type="text"
            placeholder="Related Topics (comma-separated, e.g., NBA, Phoenix Suns)"
            value={form.relatedTopics?.join(", ") || ""}
            onChange={(e) =>
              setForm({ ...form, relatedTopics: e.target.value.split(", ").map(t => t.trim()).filter(Boolean) })
            }
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Related Queries (comma-separated, e.g., suns vs mavericks score)"
            value={form.relatedQueries?.join(", ") || ""}
            onChange={(e) =>
              setForm({ ...form, relatedQueries: e.target.value.split(", ").map(q => q.trim()).filter(Boolean) })
            }
            className="p-2 border rounded w-full mb-2"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-900 text-white p-2 rounded hover:bg-blue-800 transition"
        >
          {editSlug ? "Update Trend" : "Add Trend"}
        </button>
        {editSlug && (
          <button
            type="button"
            onClick={() => setEditSlug(null)}
            className="mt-4 ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold font-[--font-poppins] text-blue-900 mb-4">
          Existing Trends
        </h2>
        {trends.length === 0 ? (
          <p className="text-gray-600">No trends yet.</p>
        ) : (
          <ul className="space-y-4">
            {trends.map((trend) => (
              <li key={trend.slug} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-blue-900">{trend.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {trend.category} - {trend.timestamp}
                  </p>
                  <p className="text-gray-500 text-sm">Slug: {trend.slug}</p>
                </div>
                <button
                  onClick={() => handleEdit(trend)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}