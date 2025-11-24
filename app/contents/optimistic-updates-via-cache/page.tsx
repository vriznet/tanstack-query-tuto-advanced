"use client";

import { editTodo, getTodos } from "@/app/actions/todos";
import { Todo } from "@/generated/prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function OptimisticUpdates() {
  const { status: queryStatus, data: queryData } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const { isPending: mutationIsPending, mutate } = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const result = await editTodo(id, { title });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onMutate: async (newTodo, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the previous value
      const previousTodos = context.client.getQueryData(["todos"]);

      // Optimistically update to the new value
      context.client.setQueryData(["todos"], (old: Todo[]) => {
        if (!old) return old;
        return old.map((todo: any) =>
          todo.id === newTodo.id ? { ...todo, title: newTodo.title } : todo
        );
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, newTodo, onMutateResult, context) => {
      context.client.setQueryData(["todos"], onMutateResult?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (queryStatus === "pending") {
    return <div>Loading...</div>;
  }
  if (queryStatus === "error") {
    return <div>Error loading todos</div>;
  }

  return (
    <ul>
      {queryData?.map((todo) => (
        <li key={todo.id}>
          <span style={{ marginRight: "8px" }}>{todo.title}</span>
          <button
            onClick={() => {
              mutate({
                id: todo.id,
                title: `Edited Title - ${new Date().toLocaleTimeString()}`,
              });
            }}
            disabled={mutationIsPending}
          >
            Edit Title
          </button>
        </li>
      ))}
    </ul>
  );
}
