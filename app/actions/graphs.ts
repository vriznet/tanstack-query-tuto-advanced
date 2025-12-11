"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createGraph(
  name: string,
  data: Prisma.JsonObject,
  articleId: string
) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
    if (!article) throw new Error("Article not found");
    const graph = await prisma.graph.create({
      data: {
        name,
        data,
        article: {
          connect: {
            id: article.id,
          },
        },
      },
    });

    return { success: true, data: graph };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create graph",
    };
  }
}

export async function getGraphs() {
  try {
    const graphs = await prisma.graph.findMany({
      orderBy: { createdAt: "desc" },
    });
    return graphs;
  } catch (error) {
    console.error(error);
  }
}

export async function getGraphById(id: string) {
  try {
    const graph = await prisma.graph.findUnique({
      where: { id },
    });
    return graph;
  } catch (error) {
    console.error(error);
  }
}

export async function getGraphsByArticleId(articleId: string) {
  try {
    const graphs = await prisma.graph.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
    });
    return graphs;
  } catch (error) {
    console.error(error);
  }
}

export async function createRandomGraph() {
  try {
    const timestamp = Date.now();
    const article = await prisma.article.findFirst();
    if (!article) throw new Error("First article not found");
    const graph = await prisma.graph.create({
      data: {
        name: `Random Graph - ${timestamp}`,
        data: {
          random_key1: `Random Value at ${timestamp}`,
          random_key2: `Another Random Value at ${timestamp}`,
        },
        article: {
          connect: {
            id: article.id,
          },
        },
      },
    });
    return { success: true, data: graph };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create random graph",
    };
  }
}

export async function editGraph(
  id: string,
  editFields: {
    name?: string;
    data?: Prisma.JsonObject;
    articleId?: string;
  }
) {
  try {
    const currentGraph = await prisma.graph.findUnique({
      where: { id },
    });
    if (!currentGraph) {
      throw new Error("Graph not found");
    }

    const updateData: Prisma.GraphUpdateInput = {};

    if (editFields.name) {
      updateData.name = editFields.name;
    }

    if (editFields.data) {
      updateData.data = editFields.data;
    }

    if (editFields.articleId) {
      const article = await prisma.article.findUnique({
        where: { id: editFields.articleId },
      });
      if (!article) throw new Error("Article not found");

      updateData.article = {
        connect: { id: editFields.articleId },
      };
    }

    const updatedGraph = await prisma.graph.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: updatedGraph };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit graph",
    };
  }
}
