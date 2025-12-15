"use client";

import { getInfiniteProjects } from "@/app/actions/projects";
import { getTodos } from "@/app/actions/todos";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

function PrefetchingTodos() {
  const queryClient = useQueryClient();
  const prefetchTodos = async () => {
    // The results of this query will be cached like a normal query
    await queryClient.prefetchQuery({
      queryKey: ["todos"],
      queryFn: getTodos,
      // Prefetch only fires when data is older than the staleTime,
      // so in a case like this you definitely want to set one
      staleTime: 60000,
    });
  };
  return (
    <div>
      <button onClick={prefetchTodos}>Prefetch Todos</button>
    </div>
  );
}

function PrefetchingProjects() {
  const queryClient = useQueryClient();
  const prefetchProjects = async () => {
    const existingPages =
      queryClient.getQueryData<
        InfiniteData<Awaited<ReturnType<typeof getInfiniteProjects>>>
      >(["projects"])?.pages.length ?? 0;

    // The results of this query will be cached like a normal query
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["projects"],
      queryFn: ({ pageParam = 0 }) =>
        getInfiniteProjects({ pageParam, limit: 10 }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      pages: existingPages + 1,
    });
  };
  return (
    <div>
      <button onClick={prefetchProjects}>Prefetch Next Projects Page</button>
    </div>
  );
}

export default function PrefetchingBasics() {
  return (
    <div>
      <PrefetchingTodos />
      <PrefetchingProjects />
    </div>
  );
}
