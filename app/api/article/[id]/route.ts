import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const start = Date.now();
  const { id } = await params;

  console.log(`[API Route] Fetching article ${id} started`);

  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    const end = Date.now();
    console.log(`[API Route] Article ${id} fetched in ${end - start}ms`);

    return Response.json({
      article,
      duration: end - start,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API Route] Article fetch error:", error);
    return Response.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
