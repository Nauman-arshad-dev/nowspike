
"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import CardDetails from "./CardDetails";
import CardContent from "./CardContent";
import { Trend } from "@/types/trend";
import { formatDistanceToNow } from "date-fns";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSignOutAlt, FaSearch, FaFilter, FaSave, FaTimes, FaChartLine, FaUsers, FaNewspaper, FaCalendar } from "react-icons/fa";

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
  title?: string;
  value: string;
  image?: string;
  caption?: string;
}

interface AdminStats {
  totalTrends: number;
  todayTrends: number;
  totalViews: number;
  avgSpikeValue: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trends, setTrends] = useState<Trend[]>([]);
  const [filteredTrends, setFilteredTrends] = useState<Trend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalTrends: 0,
    todayTrends: 0,
    totalViews: 0,
    avgSpikeValue: "0"
  });

  const [form, setForm] = useState<Partial<FormTrend>>({
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
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const categories = ["all", "sports", "entertainment", "technology", "politics", "health", "business", "science", "world"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
    } else {
      fetchTrends();
    }
  }, [session, status, router]);

  useEffect(() => {
    filterTrends();
    calculateStats();
  }, [trends, searchTerm, selectedCategory]);

  const fetchTrends = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const filterTrends = () => {
    let filtered = trends;
    
    if (searchTerm) {
      filtered = filtered.filter(trend => 
        trend.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trend.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(trend => trend.category === selectedCategory);
    }
    
    setFilteredTrends(filtered);
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTrends = trends.filter(trend => {
      const trendDate = new Date(trend.createdAt);
      trendDate.setHours(0, 0, 0, 0);
      return trendDate.getTime() === today.getTime();
    }).length;

    const totalViews = trends.length * 1247; // Simulated view count
    const avgSpike = trends.length > 0 ? Math.round(trends.length * 750) : 0;

    setStats({
      totalTrends: trends.length,
      todayTrends,
      totalViews,
      avgSpikeValue: `${avgSpike}+`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const confirmMessage = editSlug
      ? "Are you sure you want to update this trend?"
      : "Are you sure you want to add this trend?";
    if (!confirm(confirmMessage)) {
      setIsLoading(false);
      return;
    }

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
      resetForm();
      setShowForm(false);
      alert(editSlug ? "Trend updated successfully!" : "Trend added successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
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
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this trend? This action cannot be undone.")) {
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/trends/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete trend");
      
      await fetchTrends();
      alert("Trend deleted successfully!");
    } catch (error) {
      console.error("Error deleting trend:", error);
      alert("Error deleting trend");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaNewspaper className="text-white text-lg" />
                </div>
                NowSpike Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage trending content and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="text-sm" />
                New Article
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrends}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FaNewspaper className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Today's Articles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayTrends}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <FaUsers className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg. Spike Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgSpikeValue}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editSlug ? "Edit Article" : "Create New Article"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <CardDetails form={form} setForm={setForm} editSlug={editSlug} />
              <CardContent
                content={form.content || [{ type: "paragraph", value: "", title: "" }]}
                setContent={(content) => setForm({ ...form, content })}
                trends={trends}
              />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Related Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., NBA, Phoenix Suns, Basketball"
                    value={form.relatedTopics?.join(", ") || ""}
                    onChange={(e) =>
                      setForm({ ...form, relatedTopics: e.target.value.split(", ").map(t => t.trim()).filter(Boolean) })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Related Queries (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., suns vs mavericks score, basketball highlights"
                    value={form.relatedQueries?.join(", ") || ""}
                    onChange={(e) =>
                      setForm({ ...form, relatedQueries: e.target.value.split(", ").map(q => q.trim()).filter(Boolean) })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaSave className="text-sm" />
                      {editSlug ? "Update Article" : "Publish Article"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaTimes className="text-sm" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Articles Management */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Articles Management
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading articles...</p>
            </div>
          ) : filteredTrends.length === 0 ? (
            <div className="text-center py-12">
              <FaNewspaper className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {searchTerm || selectedCategory !== "all" ? "No articles match your filters" : "No articles yet"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {searchTerm || selectedCategory !== "all" ? "Try adjusting your search or filters" : "Create your first article to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrends.map((trend) => (
                <div key={trend.slug} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gray-50 dark:bg-gray-750">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{trend.title}</h3>
                        {trend.isHero && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            HERO
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{trend.teaser}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                          {trend.category}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {trend.spike}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(trend.timestamp), { addSuffix: true })}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          Slug: {trend.slug}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/trends/${trend.slug}`, '_blank')}
                        className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        title="View Article"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleEdit(trend)}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        title="Edit Article"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(trend.slug)}
                        className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        title="Delete Article"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
