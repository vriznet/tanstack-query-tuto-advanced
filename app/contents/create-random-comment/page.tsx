"use client";

import { createRandomComment, getComments } from "@/app/actions/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreateRandomComment() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createRandomComment();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
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
        <p>Adding random comment...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? (
            <div>Comment added: {mutation.data?.text}</div>
          ) : null}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Add Random Comment
          </button>
        </>
      )}
      <ul>
        {data?.map((comment) => (
          <li key={comment.id}>
            <dl>
              <dt>Text:</dt>
              <dd>{comment.text}</dd>
              <dt>User ID:</dt>
              <dd>{comment.userId}</dd>
              <dt>Article ID:</dt>
              <dd>{comment.articleId}</dd>
              <dt>Created At:</dt>
              <dd>{new Date(comment.createdAt).toLocaleString()}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
