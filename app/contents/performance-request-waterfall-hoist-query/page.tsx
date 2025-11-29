"use client";

import { getArticleById } from "@/app/actions/articles";
import { getCommentsByArticleId } from "@/app/actions/comments";
import { useQuery } from "@tanstack/react-query";

function Article({ id }: { id: string }) {
  const {
    status: commentsFetchStatus,
    data: commentsData,
    error: commentsFetchError,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getCommentsByArticleId(id),
  });

  const {
    status: articleFetchStatus,
    data: articleData,
    error: articleFetchError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
  });

  if (articleFetchStatus === "pending") {
    return <div>Loading article...</div>;
  }
  if (articleFetchStatus === "error") {
    return (
      <div>
        Error:{" "}
        {articleFetchError instanceof Error
          ? articleFetchError.message
          : "Unknown Error"}
      </div>
    );
  }
  if (commentsFetchStatus === "error") {
    return (
      <div>
        Error:{" "}
        {commentsFetchError instanceof Error
          ? commentsFetchError.message
          : "Unknown Error"}
      </div>
    );
  }
  if (!articleData) {
    return <div>No article found.</div>;
  }

  return (
    <div>
      <h1>{articleData.title}</h1>
      <p>{articleData.content}</p>
      {commentsFetchStatus === "pending" ? (
        <div>Loading comments...</div>
      ) : (
        <Comments commentsData={commentsData} />
      )}
    </div>
  );
}

function Comments({
  commentsData,
}: {
  commentsData: Array<{ id: string; text: string }> | undefined;
}) {
  if (!commentsData || commentsData.length === 0) {
    return <div>No comments found.</div>;
  }
  return (
    <ul>
      {commentsData.map((comment) => (
        <li key={comment.id}>
          <p>{comment.text}</p>
        </li>
      ))}
    </ul>
  );
}

export default function WaterfallHoistQuery() {
  const articleId = "cmijmpvfx0007j2wjcehbqo48";

  return (
    <div>
      <Article id={articleId} />
    </div>
  );
}
