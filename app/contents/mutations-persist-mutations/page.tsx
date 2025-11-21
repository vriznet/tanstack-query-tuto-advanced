"use client";

import { createTodo, getTodos } from "@/app/actions/todos";
import { Todo } from "@/generated/prisma/client";
import {
  dehydrate,
  hydrate,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PersistMutations() {
  const queryClient = useQueryClient();

  queryClient.setMutationDefaults(["createTodo"], {
    mutationFn: createTodo,
    onMutate: async (title, context) => {
      // Calcel current queries for the todos list
      await context.client.cancelQueries({ queryKey: ["todos"] });

      // Create an optimistic todo
      const optimisticTodo = { id: uuidv4(), title };

      // Add the optimistic todo to the todos list (at the beginning for newest first)
      context.client.setQueryData(["todos"], (old: Todo[]) => [
        optimisticTodo,
        ...old,
      ]);

      // Return the optimistic todo for use in onSuccess/onError
      return { optimisticTodo };
    },
    onSuccess: (result, title, onMutateResult, context) => {
      console.log(`Todo title(onSuccess): ${title}`);
      // Replace optimistic todo in the todos list with the result
      if (result.success && result.data) {
        context.client.setQueryData(["todos"], (old: Todo[]) =>
          old.map((todo) =>
            todo.id === onMutateResult.optimisticTodo.id ? result : todo
          )
        );
      }
    },
    onError: (error, title, onMutateResult, context) => {
      // Remove optimistic todo from the todos list
      if (onMutateResult?.optimisticTodo) {
        context.client.setQueryData(["todos"], (old: Todo[]) =>
          old.filter((todo) => todo.id !== onMutateResult.optimisticTodo.id)
        );
      }
    },
    retry: 3,
  });

  const { status, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (title: string) => {
      const result = await createTodo(title);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    mutation.mutate(`Do Laundry - ${new Date().toLocaleString()}`);
  };

  // Persist mutations on mount
  useEffect(() => {
    const state = dehydrate(queryClient);
    hydrate(queryClient, state);
    queryClient.resumePausedMutations();
  }, [queryClient]);

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
        <p>Adding todo...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? (
            <div>Todo added: {mutation.data?.title}</div>
          ) : null}

          <button onClick={onClick} disabled={mutation.isPending}>
            Create Todo
          </button>
        </>
      )}
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "(Completed)" : "(Not Completed)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
