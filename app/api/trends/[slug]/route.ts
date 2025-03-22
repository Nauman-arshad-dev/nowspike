// app/api/trends/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";
import { ContentBlock } from "@/types/trend";
import { TrendModel } from "@/lib/models/trend";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  // Get query parameters for pagination
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 trends per page
  const skip = (page - 1) * limit;

  // Fetch total number of trends for pagination metadata
  const totalTrends = await TrendModel.countDocuments();

  // Fetch trends for the current page
  const trends = await TrendModel.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalTrends / limit);

  return NextResponse.json(
    {
      data: trends,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalTrends: totalTrends,
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("image") as File | null;
    let imagePath = "/images/placeholder.jpg";

    if (imageFile instanceof File && slug) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const extension = path.extname(imageFile.name).toLowerCase() || ".jpg";
      const seoName = `${slug}-hero-${Date.now()}${extension}`;
      const filePath = path.join(uploadDir, seoName);
      await fs.writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${seoName}`;
    }

    const rawContent = formData.get("content") as string;
    const content: ContentBlock[] = JSON.parse(rawContent || "[]");
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "image" && content[i].value?.startsWith("content-image-")) {
        const fileKey = content[i].value;
        if (fileKey) {
          const imageFile = formData.get(fileKey) as File | null;
          if (imageFile instanceof File && slug) {
            const uploadDir = path.join(process.cwd(), "public/uploads");
            await fs.mkdir(uploadDir, { recursive: true });
            const extension = path.extname(imageFile.name).toLowerCase() || ".jpg";
            const seoName = `${slug}-content-${i}-${Date.now()}${extension}`;
            const filePath = path.join(uploadDir, seoName);
            await fs.writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()));
            content[i].value = `/uploads/${seoName}`;
          }
        }
      }
      if (content[i].type === "paragraph" && content[i].image?.startsWith("paragraph-image-")) {
        const fileKey = content[i].image;
        if (fileKey) {
          const imageFile = formData.get(fileKey) as File | null;
          if (imageFile instanceof File && slug) {
            const uploadDir = path.join(process.cwd(), "public/uploads");
            await fs.mkdir(uploadDir, { recursive: true });
            const extension = path.extname(imageFile.name).toLowerCase() || ".jpg";
            const seoName = `${slug}-paragraph-${i}-${Date.now()}${extension}`;
            const filePath = path.join(uploadDir, seoName);
            await fs.writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()));
            content[i].image = `/uploads/${seoName}`;
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
    return NextResponse.json(
      { error: "Trend creation failed", details: errorMessage },
      { status: 500 }
    );
  }
}