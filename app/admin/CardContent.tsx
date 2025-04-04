// E:\nauman\NowSpike\frontend\app\admin\CardContent.tsx
"use client";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Trend } from "@/types/trend";

interface ContentBlock {
  type: "paragraph" | "image" | "video" | "x-embed";
  title?: string;
  value: string;
  image?: string;
  caption?: string;
}

interface CardContentProps {
  content: ContentBlock[];
  setContent: (content: ContentBlock[]) => void;
  trends: Trend[]; // Add trends prop for interlinking
}

export default function CardContent({ content, setContent, trends }: CardContentProps) {
  const [newBlockType, setNewBlockType] = useState<"paragraph" | "image" | "video" | "x-embed">("paragraph");
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(null);
  const [linkText, setLinkText] = useState("");
  const [linkTarget, setLinkTarget] = useState("");
  const [linkType, setLinkType] = useState<"trend" | "category" | "custom">("trend");

  const categories = Array.from(new Set(trends.map((trend) => trend.category))).sort();

  const addBlock = () => {
    setContent([...content, { type: newBlockType, value: "", title: "" }]);
  };

  const updateBlock = (index: number, field: "title" | "value" | "image" | "caption", value: string) => {
    const newContent = [...content];
    newContent[index] = { ...newContent[index], [field]: value };
    setContent(newContent);
  };

  const handleImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>, isParagraphImage = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      if (isParagraphImage) {
        updateBlock(index, "image", blobUrl);
      } else {
        updateBlock(index, "value", blobUrl);
      }
    }
  };

  const insertLink = (index: number) => {
    if (!linkText || !linkTarget) {
      alert("Please provide both link text and target.");
      return;
    }

    let url = "";
    if (linkType === "trend") {
      url = `/trends/${linkTarget}`;
    } else if (linkType === "category") {
      url = `/category/${linkTarget.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`;
    } else {
      url = linkTarget;
    }

    const linkHtml = `<a href="${url}" class="text-[var(--soft-blue)] hover:underline">${linkText}</a>`;
    const newContent = [...content];
    const currentValue = newContent[index].value || "";
    newContent[index].value = currentValue + (currentValue ? " " : "") + linkHtml;
    setContent(newContent);

    // Reset link form
    setSelectedLinkIndex(null);
    setLinkText("");
    setLinkTarget("");
    setLinkType("trend");
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Blocks</h3>
      {content.map((block, index) => (
        <div key={index} className="mb-4 p-4 border rounded bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block {index + 1} ({block.type})
          </label>
          <input
            type="text"
            placeholder={`Block Title (e.g., "${block.type === "paragraph" ? "Introduction" : block.type === "image" ? "Featured Image" : "Media Section"}")`}
            value={block.title || ""}
            onChange={(e) => updateBlock(index, "title", e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          {block.type === "paragraph" && (
            <>
              <textarea
                placeholder={`Paragraph ${index + 1} (e.g., The Suns vs Mavericks game surged...)`}
                value={block.value}
                onChange={(e) => updateBlock(index, "value", e.target.value)}
                className="p-2 border rounded w-full mb-2"
                rows={4}
                required={index === 0 && block.type === "paragraph"}
              />
              <button
                type="button"
                onClick={() => setSelectedLinkIndex(index)}
                className="text-blue-600 hover:underline mb-2"
              >
                Add Link
              </button>
              {selectedLinkIndex === index && (
                <div className="mb-2 p-2 border rounded bg-white">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insert Link</label>
                  <input
                    type="text"
                    placeholder="Link Text (e.g., Read more about the Sagaing Fault)"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="p-2 border rounded w-full mb-2"
                  />
                  <select
                    value={linkType}
                    onChange={(e) => setLinkType(e.target.value as "trend" | "category" | "custom")}
                    className="p-2 border rounded w-full mb-2"
                  >
                    <option value="trend">Link to Another Trend</option>
                    <option value="category">Link to a Category</option>
                    <option value="custom">Custom URL</option>
                  </select>
                  {linkType === "trend" && (
                    <select
                      value={linkTarget}
                      onChange={(e) => setLinkTarget(e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="" disabled>Select a Trend</option>
                      {trends.map((trend) => (
                        <option key={trend.slug} value={trend.slug}>
                          {trend.title}
                        </option>
                      ))}
                    </select>
                  )}
                  {linkType === "category" && (
                    <select
                      value={linkTarget}
                      onChange={(e) => setLinkTarget(e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="" disabled>Select a Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                  {linkType === "custom" && (
                    <input
                      type="text"
                      placeholder="Custom URL (e.g., /about)"
                      value={linkTarget}
                      onChange={(e) => setLinkTarget(e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => insertLink(index)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                      Insert Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLinkIndex(null)}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id={`paragraph-image-upload-${index}`}
                onChange={(e) => handleImageUpload(index, e, true)}
                className="p-2 border rounded w-full mb-2"
              />
              {block.image && (
                <div className="relative w-full max-w-xs h-32 mb-2">
                  <Image
                    src={block.image}
                    alt="Paragraph Image Preview"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                </div>
              )}
            </>
          )}
          {block.type === "image" && (
            <>
              <input
                type="file"
                accept="image/*"
                id={`image-upload-${index}`}
                onChange={(e) => handleImageUpload(index, e)}
                className="p-2 border rounded w-full mb-2"
              />
              {block.value && (
                <div className="relative w-full max-w-xs h-32 mb-2">
                  <Image
                    src={block.value}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                </div>
              )}
              <input
                type="text"
                placeholder="Image Caption (optional)"
                value={block.caption || ""}
                onChange={(e) => updateBlock(index, "caption", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </>
          )}
          {block.type === "video" && (
            <>
              <input
                type="text"
                placeholder="Video URL (e.g., https://youtube.com/watch?v=xyz)"
                value={block.value}
                onChange={(e) => updateBlock(index, "value", e.target.value)}
                className="p-2 border rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Video Caption (optional)"
                value={block.caption || ""}
                onChange={(e) => updateBlock(index, "caption", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </>
          )}
          {block.type === "x-embed" && (
            <input
              type="text"
              placeholder="X Post URL (e.g., https://x.com/user/status/123)"
              value={block.value}
              onChange={(e) => updateBlock(index, "value", e.target.value)}
              className="p-2 border rounded w-full"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <select
          value={newBlockType}
          onChange={(e) => setNewBlockType(e.target.value as typeof newBlockType)}
          className="p-2 border rounded"
        >
          <option value="paragraph">Paragraph</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="x-embed">X Embed</option>
        </select>
        <button
          type="button"
          onClick={addBlock}
          className="text-blue-600 hover:underline"
        >
          Add New Block
        </button>
      </div>
    </div>
  );
}