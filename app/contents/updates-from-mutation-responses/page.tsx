"use client";

import { editTodo, getTodos } from "@/app/actions/todos";
import { Todo } from "@/generated/prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function UpdatesFromMutationResponses() {
  const queryClient = useQueryClient();

  const {
    status,
    error,
    data: todos,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const todoTitleMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const result = await editTodo(id, { title });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todos"], (old: Todo[] | undefined) => {
        if (!old) return old;
        return old.map((todo) => (todo.id === variables.id ? data : todo));
      });
    },
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>
          <span style={{ marginRight: "8px" }}>{todo.title}</span>
          <button
            onClick={() => {
              todoTitleMutation.mutate({
                id: todo.id,
                title: `${
                  todo.title
                } (edited at ${new Date().toLocaleTimeString()})`,
              });
            }}
            disabled={todoTitleMutation.isPending}
          >
            Edit Title
          </button>
        </li>
      ))}
    </ul>
  );
}
