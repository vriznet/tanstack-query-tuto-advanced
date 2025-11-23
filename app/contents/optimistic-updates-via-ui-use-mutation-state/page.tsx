"use client";

import { createTodo, getTodos } from "@/app/actions/todos";
import { Todo } from "@/generated/prisma/client";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

function Todos() {
  const { status, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutationIsPending = useMutationState({
    filters: { mutationKey: ["createTodo"], status: "pending" },
    select: (mutation) => mutation.state.status === "pending",
  });

  const mutationVariables = useMutationState({
    filters: { mutationKey: ["createTodo"], status: "pending" },
    select: (mutation) => mutation.state.variables as string,
  });

  const anyPending = mutationIsPending.some((m) => m === true);
  const latestMutationVariables =
    mutationVariables[mutationVariables.length - 1];

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
    <ul>
      {anyPending && (
        <li style={{ color: "red" }}>{latestMutationVariables}</li>
      )}
      {data?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

function CreateTodoButton() {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (title: string) => {
      const result = await createTodo(title);
      return result.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    mutationKey: ["createTodo"],
  });

  return (
    <button
      onClick={() => {
        mutate(`Do Laundry - ${new Date().toLocaleString()}`);
      }}
      disabled={isPending}
    >
      Create Todo
    </button>
  );
}

export default function OptimisticUpdates() {
  const mutationIsPending = useMutationState({
    filters: { mutationKey: ["createTodo"] },
    select: (mutation) => mutation.state.status === "pending",
  });
  const mutationData = useMutationState({
    filters: { mutationKey: ["createTodo"], status: "success" },
    select: (mutation) => mutation.state.data as Todo,
  });
  const mutationError = useMutationState({
    filters: { mutationKey: ["createTodo"], status: "error" },
    select: (mutation) => mutation.state.error,
  });
  const mutationIsError = useMutationState({
    filters: { mutationKey: ["createTodo"], status: "error" },
    select: (mutation) => mutation.state.status === "error",
  });

  const anyPending = mutationIsPending.some((m) => m === true);
  const anyIsError = mutationIsError.some((m) => m === true);
  const latestMutationData = mutationData[mutationData.length - 1];
  const latestMutationError = mutationError[mutationError.length - 1];

  return (
    <div>
      {anyPending ? (
        <p>Adding todo...</p>
      ) : (
        <>
          {anyIsError ? (
            <div>
              An error occurred:
              <ul>
                <li>{latestMutationError?.message}</li>
              </ul>
            </div>
          ) : null}
          {latestMutationData ? (
            <div>Todo added: {latestMutationData.title}</div>
          ) : null}
        </>
      )}
      <CreateTodoButton />
      <Todos />
    </div>
  );
}
