"use client";

import { createRandomArticle, getArticles } from "@/app/actions/articles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreateRandomArticle() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createRandomArticle();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div>
      {mutation.isPending ? (
        <p>Adding random article...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? (
            <div>Article added: {mutation.data?.title}</div>
          ) : null}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Add Random Article
          </button>
        </>
      )}
      <ul>
        {data?.map((article) => (
          <li key={article.id}>
            <dl>
              <dt>Title:</dt>
              <dd>{article.title}</dd>
              <dt>Content:</dt>
              <dd>{article.content}</dd>
              <dt>Author ID:</dt>
              <dd>{article.authorId}</dd>
              <dt>Created At:</dt>
              <dd>{new Date(article.createdAt).toLocaleString()}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
