"use client";

import { createRandomUser, getUsers } from "@/app/actions/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreateRandomUser() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createRandomUser();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
        <p>Adding random user...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? (
            <div>User added: {mutation.data?.name}</div>
          ) : null}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Add Random User
          </button>
        </>
      )}
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            <dl>
              <dt>Name:</dt>
              <dd>{user.name}</dd>
              <dt>Email:</dt>
              <dd>{user.email}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
