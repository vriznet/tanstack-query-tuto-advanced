"use server";

import { prisma } from "@/lib/prisma";

export async function createTodo(title: string) {
  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        completed: false,
      },
    });

    return { success: true, data: todo };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create todo",
    };
  }
}

export async function getTodos() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return todos;
  } catch (error) {
    console.error(error);
  }
}

export async function getTodoById(id: string) {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    return todo;
  } catch (error) {
    console.error(error);
  }
}

export async function createRandomTodo() {
  try {
    const todo = await prisma.todo.create({
      data: {
        title: `Random Todo - ${new Date().toLocaleString()}`,
        completed: Math.random() < 0.5,
        version: Math.floor(Math.random() * 30) + 1,
      },
    });
    return { success: true, data: todo };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create random todo",
    };
  }
}
