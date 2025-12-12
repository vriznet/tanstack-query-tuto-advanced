"use client";

import { getArticleById, getArticles } from "@/app/actions/articles";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const GraphContainedArticle = dynamic(() => import("./GraphContainedArticle"), {
  loading: () => <div>Loading graph contained article...</div>,
  ssr: false,
});

function Articles() {
  const { data, isPending } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  if (isPending) {
    return <div>Loading articles...</div>;
  }

  if (!data) {
    return <div>No articles found.</div>;
  }

  return (
    <>
      {data.map((article) => {
        if (article.type === "GRAPHCONTAINED") {
          return <GraphContainedArticle key={article.id} id={article.id} />;
        }
        return <StandardArticle key={article.id} id={article.id} />;
      })}
    </>
  );
}

function StandardArticle({ id }: { id: string }) {
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
  if (!articleData) {
    return <div>No article found.</div>;
  }

  return (
    <div>
      <h1>{articleData.title}</h1>
      <p>{articleData.content}</p>
    </div>
  );
}

export default function CodeSplitting() {
  return (
    <div>
      <h2>Performance Request Waterfall - Code Splitting</h2>
      <Articles />
    </div>
  );
}
