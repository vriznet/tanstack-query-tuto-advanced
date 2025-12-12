"use client";

import { getArticleById } from "@/app/actions/articles";
import { getGraphsByArticleId } from "@/app/actions/graphs";
import { useQuery } from "@tanstack/react-query";

export default function GraphContainedArticle({ id }: { id: string }) {
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
      <GraphsOfArticle articleId={id} />
    </div>
  );
}

function GraphsOfArticle({ articleId }: { articleId: string }) {
  const { data, isPending } = useQuery({
    queryKey: ["graph", articleId],
    queryFn: () => getGraphsByArticleId(articleId),
  });
  if (isPending) {
    return <div>Loading graph...</div>;
  }
  if (!data) {
    return <div>No graph found.</div>;
  }

  return (
    <ul>
      {data.map((graph) => {
        const stringifiedGraphJsonData = JSON.stringify(graph.data);
        return (
          <li key={graph.id}>
            <h3>{graph.name}</h3>
            <pre>{stringifiedGraphJsonData}</pre>
          </li>
        );
      })}
    </ul>
  );
}
