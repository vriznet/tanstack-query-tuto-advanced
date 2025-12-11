"use client";

import { createRandomGraph, getGraphs } from "@/app/actions/graphs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreateRandomGraph() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["graphs"],
    queryFn: getGraphs,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createRandomGraph();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphs"] });
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
        <p>Adding random graph...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? (
            <div>Graph added: {mutation.data?.name}</div>
          ) : null}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Add Random Graph
          </button>
        </>
      )}
      <ul>
        {data?.map((graph) => (
          <li key={graph.id}>
            <dl>
              <dt>Name:</dt>
              <dd>{graph.name}</dd>
              <dt>Data:</dt>
              <dd>{JSON.stringify(graph.data)}</dd>
              <dt>Article ID:</dt>
              <dd>{graph.articleId}</dd>
              <dt>Created At:</dt>
              <dd>{new Date(graph.createdAt).toLocaleString()}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
