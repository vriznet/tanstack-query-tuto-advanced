"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createProject(name: string, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    const project = await prisma.project.create({
      data: {
        name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return { success: true, data: project };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects;
  } catch (error) {
    console.error(error);
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    return project;
  } catch (error) {
    console.error(error);
  }
}

export async function getProjectsByUserId(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  } catch (error) {
    console.error(error);
  }
}

export async function createRandomProject() {
  try {
    const timestamp = Date.now();
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("First user not found");
    const project = await prisma.project.create({
      data: {
        name: `Random Project - ${timestamp}`,
        userId: user.id,
      },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create random project",
    };
  }
}

export async function editProject(
  id: string,
  editFields: {
    projectName?: string;
    userId?: string;
  }
) {
  try {
    const currentProject = await prisma.project.findUnique({
      where: { id },
    });
    if (!currentProject) {
      throw new Error("Project not found");
    }

    const updateData: Prisma.ProjectUpdateInput = {};

    if (editFields.projectName) {
      updateData.name = editFields.projectName;
    }

    if (editFields.userId) {
      const user = await prisma.user.findUnique({
        where: { id: editFields.userId },
      });
      if (!user) throw new Error("User not found");

      updateData.user = {
        connect: { id: editFields.userId },
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: updatedProject };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit project",
    };
  }
}
