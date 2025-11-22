"use client";

import { createRandomTodo, getTodos } from "@/app/actions/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreateRandomTodo() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createRandomTodo();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown Error"}
      </div>
    );
  }
  return (
    <div>
      {mutation.isPending ? (
        <p>Adding random todo...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? (
            <div>Todo added: {mutation.data?.title}</div>
          ) : null}

          <button
            onClick={() => {
              mutation.mutate();
            }}
            disabled={mutation.isPending}
          >
            Create Todo
          </button>
        </>
      )}
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "(Completed)" : "(Not Completed)"}{" "}
            {", Todo version: " + todo.version}
          </li>
        ))}
      </ul>
    </div>
  );
}
