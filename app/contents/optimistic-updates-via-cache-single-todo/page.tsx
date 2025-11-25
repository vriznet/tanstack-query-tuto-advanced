"use client";

import { editTodo, getTodoById } from "@/app/actions/todos";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function OptimisticUpdates() {
  const todoId = "cmibjddhz001gklwjzlgu83n8";

  const { status: queryStatus, data: queryData } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodoById(todoId),
  });

  const { mutate, isPending: mutationIsPending } = useMutation({
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
      await context.client.cancelQueries({ queryKey: ["todo", newTodo.id] });

      // Snapshot the previous value
      const previousTodo = context.client.getQueryData(["todo", newTodo.id]);

      // Optimistically update to the new value
      context.client.setQueryData(["todo", newTodo.id], newTodo);

      // Return a result with the previous and new todo
      return { previousTodo, newTodo };
    },
    // If the mutation fails, use the result we returned above
    onError: (err, newTodo, onMutateResult, context) => {
      context.client.setQueryData(
        ["todo", onMutateResult?.newTodo.id],
        onMutateResult?.previousTodo
      );
    },
    // Always refetch after error or success:
    onSettled: (newTodo, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: ["todo", newTodo?.id],
      });
    },
  });

  if (queryStatus === "pending") {
    return <div>Loading...</div>;
  }
  if (queryStatus === "error") {
    return <div>Error loading todo</div>;
  }

  return (
    <div>
      <h2>Optimistic Updates via Cache - Single Todo</h2>
      <div>Current Todo Title: {queryData?.title}</div>
      {queryData && (
        <button
          onClick={() => {
            mutate({
              id: queryData?.id,
              title: `Edited Title - ${new Date().toLocaleTimeString()}`,
            });
          }}
          disabled={mutationIsPending}
        >
          Edit Title
        </button>
      )}
    </div>
  );
}
