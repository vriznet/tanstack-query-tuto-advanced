"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createArticle(
  title: string,
  content: string,
  userId: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    const article = await prisma.article.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return { success: true, data: article };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create article",
    };
  }
}

export async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    return articles;
  } catch (error) {
    console.error(error);
  }
}

export async function getArticleById(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });
    return article;
  } catch (error) {
    console.error(error);
  }
}

export async function createRandomArticle() {
  try {
    const timestamp = Date.now();
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("First user not found");
    const article = await prisma.article.create({
      data: {
        title: `Random Article - ${timestamp}`,
        content: `Hello World at ${timestamp}`,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return { success: true, data: article };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create random article",
    };
  }
}

export async function editArticle(
  id: string,
  editFields: {
    title?: string;
    content?: string;
    userId?: string;
  }
) {
  try {
    const currentArticle = await prisma.article.findUnique({
      where: { id },
    });
    if (!currentArticle) {
      throw new Error("Article not found");
    }

    const updateData: Prisma.ArticleUpdateInput = {};

    if (editFields.title) {
      updateData.title = editFields.title;
    }

    if (editFields.content) {
      updateData.content = editFields.content;
    }

    if (editFields.userId) {
      const user = await prisma.user.findUnique({
        where: { id: editFields.userId },
      });
      if (!user) throw new Error("User not found");

      updateData.author = {
        connect: { id: editFields.userId },
      };
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: updatedArticle };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit article",
    };
  }
}
