// E:\nauman\NowSpike\frontend\app\api\trends\[slug]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from "fs/promises";
import path from "path";
import { ContentBlock } from "@/types/trend";
import { TrendModel } from "@/lib/models/trend";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Updated for Next.js 14+
) {
  await connectDB();
  const resolvedParams = await params;
  const trend = await TrendModel.findOne({ slug: resolvedParams.slug }).lean();
  if (!trend) {
    return NextResponse.json({ error: "Trend not found" }, { status: 404 });
  }
  return NextResponse.json({ data: trend }, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Updated for Next.js 14+
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const resolvedParams = await params;
  const existingTrend = await TrendModel.findOne({ slug: resolvedParams.slug });
  if (!existingTrend) {
    return NextResponse.json({ error: "Trend not found" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const slug = resolvedParams.slug;
    let imagePath = existingTrend.image || "/images/placeholder.jpg";

    if (imageFile instanceof File) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const extension = path.extname(imageFile.name).toLowerCase() || ".jpg";
      const seoName = `${slug}-hero-${Date.now()}${extension}`;
      const filePath = path.join(uploadDir, seoName);
      await fs.writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${seoName}`;
    } else if (formData.get("image") && typeof formData.get("image") === "string") {
      imagePath = formData.get("image") as string;
    }

    const rawContent = formData.get("content") as string;
    const content: ContentBlock[] = JSON.parse(rawContent || JSON.stringify(existingTrend.content));
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "image" && content[i].value?.startsWith("content-image-")) {
        const fileKey = content[i].value;
        if (fileKey) { // Type guard to ensure fileKey is defined
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
        if (fileKey) { // Type guard to ensure fileKey is defined
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

    const updatedTrend = await TrendModel.findOneAndUpdate(
      { slug: resolvedParams.slug },
      {
        title: formData.get("title") as string,
        teaser: formData.get("teaser") as string,
        spike: formData.get("spike") as string,
        content: content.length > 0 ? content : existingTrend.content,
        timestamp: formData.get("timestamp") as string,
        category: formData.get("category") as string,
        isHero: formData.get("isHero") === "true",
        relatedTopics: JSON.parse(formData.get("relatedTopics") as string || JSON.stringify(existingTrend.relatedTopics)),
        relatedQueries: JSON.parse(formData.get("relatedQueries") as string || JSON.stringify(existingTrend.relatedQueries)),
        image: imagePath,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    ).lean();

    if (!updatedTrend) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ data: updatedTrend }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Update failed", details: errorMessage },
      { status: 500 }
    );
  }
}