"use client";

import { createRandomProject, getProjects } from "@/app/actions/projects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreateRandomProject() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createRandomProject();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
        <p>Adding random project...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? (
            <div>Project added: {mutation.data?.name}</div>
          ) : null}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Add Random Project
          </button>
        </>
      )}
      <ul>
        {data?.map((project) => (
          <li key={project.id}>
            <dl>
              <dt>Name:</dt>
              <dd>{project.name}</dd>
              <dt>User ID:</dt>
              <dd>{project.userId}</dd>
              <dt>Created At:</dt>
              <dd>{new Date(project.createdAt).toLocaleString()}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
