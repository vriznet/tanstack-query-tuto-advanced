// In this example, we can't trivially flatten the waterfall
// by just hoisting the query to the parent, or even adding prefetching.
// One option is to refactor our API to include the graph data in the getFeed query.
// Another more advanced solution is to leverage Server Components
// to move the waterfall to the server where latency is lower.

"use client";

import { getArticleById, getArticles } from "@/app/actions/articles";
import { getGraphsByArticleId } from "@/app/actions/graphs";
import { useQuery } from "@tanstack/react-query";

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

function GraphContainedArticle({ id }: { id: string }) {
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
    // This query is dependent on its parent(GraphContainedArticle)
    // in two different ways:
    // 1. It only makes sense to fetch graphs for an article that is of type GRAPHCONTAINED.
    // 2. It needs the articleId from the parent to fetch the correct graphs.
    // |> getArticles()
    //    |> getGraphsByArticleId()
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

export default function DependentNestedComponent() {
  return (
    <div>
      <h2>Performance Request Waterfall - Dependent Nested Component</h2>
      <Articles />
    </div>
  );
}
