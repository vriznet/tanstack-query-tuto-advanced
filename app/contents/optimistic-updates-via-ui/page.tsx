"use client";

import { createTodo, getTodos } from "@/app/actions/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function OptimisticUpdates() {
  const queryClient = useQueryClient();

  const {
    status: queryStatus,
    data: queryData,
    error: queryError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const {
    isPending: mutationIsPending,
    variables: mutationVariables,
    data: mutationData,
    mutate,
    isError: mutationIsError,
    error: mutationError,
  } = useMutation({
    mutationFn: async (title: string) => {
      const result = await createTodo(title);
      return result.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  if (queryStatus === "pending") {
    return <div>Loading...</div>;
  }
  if (queryStatus === "error") {
    return (
      <div>
        Error:{" "}
        {queryError instanceof Error ? queryError.message : "Unknown Error"}
      </div>
    );
  }

  return (
    <div>
      {mutationIsPending ? (
        <p>Adding todo...</p>
      ) : (
        <>
          {mutationIsError ? (
            <div>An error occurred: {mutationError.message}</div>
          ) : null}

          {mutationData ? <div>Todo added: {mutationData.title}</div> : null}

          <button
            onClick={() => {
              mutate(`Do Laundry - ${new Date().toLocaleString()}`);
            }}
            disabled={mutationIsPending}
          >
            Create Todo
          </button>
        </>
      )}
      <ul>
        {mutationIsPending && (
          <li style={{ color: "red" }}>{mutationVariables}</li>
        )}
        {queryData?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
