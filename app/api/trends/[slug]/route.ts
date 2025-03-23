// app/api/trends/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob"; // Import Vercel Blob
import { ContentBlock } from "@/types/trend";
import { TrendModel } from "@/lib/models/trend";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, context: unknown) {
  await connectDB();

  // Safely extract the slug from the context
  const params = (context as { params?: { slug?: string } })?.params;
  const slug = params?.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  // Fetch the trend with the matching slug
  const trend = await TrendModel.findOne({ slug }).lean();

  if (!trend) {
    return NextResponse.json({ error: "Trend not found" }, { status: 404 });
  }

  return NextResponse.json(trend, { status: 200 });
}

export async function POST(req: NextRequest) {
  // Validate environment variables
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set");
    return NextResponse.json(
      { error: "Server configuration error", details: "BLOB_READ_WRITE_TOKEN is not set" },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    if (!slug) {
      throw new Error("Slug is required");
    }

    const imageFile = formData.get("image") as File | null;
    let imagePath = "/images/placeholder.jpg";

    // Upload the hero image to Vercel Blob
    if (imageFile instanceof File) {
      const maxSize = 4.5 * 1024 * 1024; // 4.5MB
      if (imageFile.size > maxSize) {
        throw new Error("Hero image exceeds 4.5MB limit");
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Hero image must be JPEG, PNG, or WebP");
      }
      const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const seoName = `${slug}-hero-${Date.now()}.${extension}`;
      const blob = await put(seoName, imageFile, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      imagePath = blob.url;
      console.log(`Uploaded hero image to Vercel Blob: ${imagePath}`);
    }

    const rawContent = formData.get("content") as string;
    if (!rawContent) {
      throw new Error("Content is required");
    }
    const content: ContentBlock[] = JSON.parse(rawContent || "[]");
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "image" && content[i].value?.startsWith("content-image-")) {
        const fileKey = content[i].value;
        if (fileKey) {
          const imageFile = formData.get(fileKey) as File | null;
          if (imageFile instanceof File) {
            const maxSize = 4.5 * 1024 * 1024; // 4.5MB
            if (imageFile.size > maxSize) {
              throw new Error(`Content image ${i} exceeds 4.5MB limit`);
            }
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(imageFile.type)) {
              throw new Error(`Content image ${i} must be JPEG, PNG, or WebP`);
            }
            const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
            const seoName = `${slug}-content-${i}-${Date.now()}.${extension}`;
            const blob = await put(seoName, imageFile, {
              access: "public",
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            content[i].value = blob.url;
            console.log(`Uploaded content image ${i} to Vercel Blob: ${blob.url}`);
          }
        }
      }
      if (content[i].type === "paragraph" && content[i].image?.startsWith("paragraph-image-")) {
        const fileKey = content[i].image;
        if (fileKey) {
          const imageFile = formData.get(fileKey) as File | null;
          if (imageFile instanceof File) {
            const maxSize = 4.5 * 1024 * 1024; // 4.5MB
            if (imageFile.size > maxSize) {
              throw new Error(`Paragraph image ${i} exceeds 4.5MB limit`);
            }
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(imageFile.type)) {
              throw new Error(`Paragraph image ${i} must be JPEG, PNG, or WebP`);
            }
            const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
            const seoName = `${slug}-paragraph-${i}-${Date.now()}.${extension}`;
            const blob = await put(seoName, imageFile, {
              access: "public",
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            content[i].image = blob.url;
            console.log(`Uploaded paragraph image ${i} to Vercel Blob: ${blob.url}`);
          }
        }
      }
    }

    const trend = new TrendModel({
      title: formData.get("title") as string,
      teaser: formData.get("teaser") as string,
      slug: slug,
      spike: formData.get("spike") as string,
      content: content.length > 0 ? content : [{ type: "paragraph", value: "", title: "" }],
      timestamp: formData.get("timestamp") as string,
      category: formData.get("category") as string,
      isHero: formData.get("isHero") === "true",
      relatedTopics: JSON.parse(formData.get("relatedTopics") as string || "[]"),
      relatedQueries: JSON.parse(formData.get("relatedQueries") as string || "[]"),
      image: imagePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await trend.save();
    return NextResponse.json({ data: trend }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in POST /api/trends/[slug]:", errorMessage, error);
    return NextResponse.json(
      { error: "Trend creation failed", details: errorMessage },
      { status: 500 }
    );
  }
}