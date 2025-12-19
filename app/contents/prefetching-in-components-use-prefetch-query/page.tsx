"use client";

import { useSuspenseQuery, usePrefetchQuery } from "@tanstack/react-query";
import { Suspense } from "react";

// Helper to get absolute URL
function getAbsoluteUrl(path: string) {
  if (typeof window !== "undefined") {
    // Client-side: use relative path
    return path;
  }
  // Server-side: use absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}

async function fetchArticle(id: string) {
  const res = await fetch(getAbsoluteUrl(`/api/article/${id}`));
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}

async function fetchComments(articleId: string) {
  const res = await fetch(getAbsoluteUrl(`/api/comments/${articleId}`));
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

function ArticleLayout({ id }: { id: string }) {
  // Using usePrefetchQuery with API Routes (not Server Actions)
  // This should work now since we're using standard HTTP fetch
  usePrefetchQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
  });

  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <Article id={id} />
    </Suspense>
  );
}

function Article({ id }: { id: string }) {
  const { data: articleData } = useSuspenseQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
  });

  // Throw error if article is not found to trigger error.tsx
  if (!articleData?.article) {
    throw new Error(`Article with id "${id}" not found`);
  }

  return (
    <div>
      <h1>{articleData.article.title}</h1>
      <p>{articleData.article.content}</p>
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments articleId={articleData.article.id} />
      </Suspense>
    </div>
  );
}

function Comments({ articleId }: { articleId: string }) {
  const { data: commentsData } = useSuspenseQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchComments(articleId),
  });

  // Throw error if comments data is invalid
  if (!commentsData?.comments) {
    throw new Error(`Failed to load comments for article "${articleId}"`);
  }

  if (commentsData.comments.length === 0) {
    return <div>No comments yet.</div>;
  }

  return (
    <ul>
      {commentsData.comments.map((comment: any) => (
        <li key={comment.id}>
          <p>{comment.text}</p>
        </li>
      ))}
    </ul>
  );
}

export default function PrefetchingWithUsePrefetchQuery() {
  const articleId = "cmijmpvfx0007j2wjcehbqo48";
  // const articleId = "non-existent-id"; // ← Uncomment to test error.tsx

  return (
    <div>
      <ArticleLayout id={articleId} />
    </div>
  );
}
