import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const start = Date.now();
  const { id } = await params;

  console.log(`[API Route] Fetching comments for article ${id} started`);

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: id },
    });

    const end = Date.now();
    console.log(
      `[API Route] Comments for article ${id} fetched in ${end - start}ms`
    );

    return Response.json({
      comments,
      count: comments.length,
      duration: end - start,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API Route] Comments fetch error:", error);
    return Response.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
