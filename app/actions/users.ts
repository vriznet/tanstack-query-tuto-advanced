"use server";

import { prisma } from "@/lib/prisma";

export async function createUser(name: string, email: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function createRandomUser() {
  try {
    const timestamp = Date.now();
    const user = await prisma.user.create({
      data: {
        name: `Random User - ${timestamp}`,
        email: `random${timestamp}@gmail.com`,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create random user",
    };
  }
}

export async function editUser(
  id: string,
  editFields: {
    name?: string;
    email?: string;
  }
) {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!currentUser) {
      throw new Error("User not found");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: editFields.name,
        email: editFields.email,
      },
    });
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error(error);
    return {
      sucess: false,
      error: error instanceof Error ? error.message : "Failed to edit user",
    };
  }
}
