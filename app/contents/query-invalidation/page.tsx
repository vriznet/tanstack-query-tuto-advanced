"use client";

import { Todo } from "@/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";

export default function QueryInvalidation() {
  const queryClient = useQueryClient();

  const invalidateTodos = () => {
    queryClient.invalidateQueries({
      queryKey: ["todos"],
    });
    // Both queries below will be invalidated
    /*
    const todoListQuery = useQuery({
      queryKey: ['todos'],
      queryFn: fetchTodoList,
    })
    const todoListQuery = useQuery({
      queryKey: ['todos', { page: 1 }],
      queryFn: fetchTodoList,
    })
    */
  };

  const invalidateCompletedTodos = () => {
    queryClient.invalidateQueries({
      queryKey: ["todos", { completed: true }],
    });
    /*
    // The query below will be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos', { completed: true }],
      queryFn: getTodos,
    })

    // However, the following query below will NOT be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos'],
      queryFn: getTodos,
    })
    */
  };

  const invalidateExactTodos = () => {
    queryClient.invalidateQueries({
      queryKey: ["todos"],
      exact: true,
    });

    /*
    // Only the query below will be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos'],
      queryFn: getTodos,
    })

    // However, the following query below will NOT be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos', { completed: true }],
      queryFn: getTodos,
    })
    */
  };

  const invalidateMoreGranularTodos = () => {
    queryClient.invalidateQueries({
      queryKey: ["todos"],
      predicate: (query) => {
        const queryKey = query.queryKey[0];
        const queryData = query.queryKey[1] as Todo | undefined;
        if (queryKey === "todos" && queryData) {
          return queryData.version >= 10;
        }
        return false;
      },
    });
    /*
    // The query below will be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos', { version: 20 }],
      queryFn: getTodos,
    })

    // The query below will be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos', { version: 10 }],
      queryFn: getTodos,
    })

    // However, the following query below will NOT be invalidated
    const todoListQuery = useQuery({
      queryKey: ['todos', { version: 5 }],
      queryFn: getTodos,
    })
    */
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h1>Query Invalidation Examples</h1>
      <div>
        <button onClick={invalidateTodos}>Invalidate Todos</button>
        <pre>
          <code>
            {`queryClient.invalidateQueries({
  queryKey: ["todos"],
});`}
          </code>
        </pre>
      </div>
      <div>
        <button onClick={invalidateCompletedTodos}>
          Invalidate Completed Todos
        </button>
        <pre>
          <code>
            {`queryClient.invalidateQueries({
  queryKey: ["todos", { completed: true }],
});`}
          </code>
        </pre>
      </div>
      <div>
        <button onClick={invalidateExactTodos}>Invalidate Exact Todos</button>
        <pre>
          <code>
            {`queryClient.invalidateQueries({
  queryKey: ["todos"],
  exact: true,
});`}
          </code>
        </pre>
      </div>
      <div>
        <button onClick={invalidateMoreGranularTodos}>
          Invalidate More Granular Todos
        </button>
        <pre>
          <code>
            {`queryClient.invalidateQueries({
  queryKey: ["todos"],
  predicate: (query) => {
    const queryKey = query.queryKey[0];
    const queryData = query.queryKey[1] as Todo | undefined;
    if (queryKey === "todos" && queryData) {
      return queryData.version >= 10;
    }
    return false;
  },
});`}
          </code>
        </pre>
      </div>
    </div>
  );
}
