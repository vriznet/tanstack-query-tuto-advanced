"use client";

import { getProjectsByUserId } from "@/app/actions/projects";
import { getUserByEmail } from "@/app/actions/users";
import { useQuery } from "@tanstack/react-query";

export default function WaterfallSingleComponent() {
  const userEmail = "random1764380432346@gmail.com";

  // Get the user
  const {
    status: userFetchStatus,
    data: userData,
    error: userFetchError,
  } = useQuery({
    queryKey: ["user", userEmail],
    queryFn: () => getUserByEmail(userEmail),
  });

  const userId = userData?.id;

  // Then get the user's projects
  const {
    status: projectFetchStatus,
    data: projectData,
    error: projectFetchError,
  } = useQuery({
    queryKey: ["projects", userId],
    queryFn: () => getProjectsByUserId(userId!),
    // The query will not execute until the userId exists
    enabled: !!userId,
  });

  if (userFetchStatus === "pending") {
    return <div>Loading user data...</div>;
  }
  if (userFetchStatus === "error") {
    return (
      <div>
        Error:{" "}
        {userFetchError instanceof Error
          ? userFetchError.message
          : "Unknown Error"}
      </div>
    );
  }
  if (!userData) {
    return <div>No user found</div>;
  }

  if (projectFetchStatus === "pending") {
    return <div>Loading projects...</div>;
  }
  if (projectFetchStatus === "error") {
    return (
      <div>
        Error:{" "}
        {projectFetchError instanceof Error
          ? projectFetchError.message
          : "Unknown Error"}
      </div>
    );
  }
  if (!projectData || projectData.length === 0) {
    return <div>No projects found</div>;
  }

  return (
    <div>
      <h2>{userData.name}'s Projects:</h2>
      <ul>
        {projectData.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
