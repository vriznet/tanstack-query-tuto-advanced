"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createComment(
  text: string,
  userId: string,
  articleId: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
    if (!article) throw new Error("Article not found");
    const comment = await prisma.comment.create({
      data: {
        text,
        user: {
          connect: {
            id: user.id,
          },
        },
        article: {
          connect: {
            id: article.id,
          },
        },
      },
    });

    return { success: true, data: comment };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create comment",
    };
  }
}

export async function getComments() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return comments;
  } catch (error) {
    console.error(error);
  }
}

export async function getCommentById(id: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    return comment;
  } catch (error) {
    console.error(error);
  }
}

export async function getCommentsByArticleId(articleId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
    });
    return comments;
  } catch (error) {
    console.error(error);
  }
}

export async function createRandomComment() {
  try {
    const timestamp = Date.now();
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("First user not found");
    const article = await prisma.article.findFirst();
    if (!article) throw new Error("First article not found");
    const comment = await prisma.comment.create({
      data: {
        text: `Random Comment - ${timestamp}`,
        user: {
          connect: {
            id: user.id,
          },
        },
        article: {
          connect: {
            id: article.id,
          },
        },
      },
    });
    return { success: true, data: comment };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create random comment",
    };
  }
}

export async function editComment(
  id: string,
  editFields: {
    text?: string;
    userId?: string;
    articleId?: string;
  }
) {
  try {
    const currentComment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!currentComment) {
      throw new Error("Comment not found");
    }

    const updateData: Prisma.CommentUpdateInput = {};

    if (editFields.text) {
      updateData.text = editFields.text;
    }

    if (editFields.userId) {
      const user = await prisma.user.findUnique({
        where: { id: editFields.userId },
      });
      if (!user) throw new Error("User not found");
      updateData.user = {
        connect: {
          id: user.id,
        },
      };
    }

    if (editFields.articleId) {
      const article = await prisma.article.findUnique({
        where: { id: editFields.articleId },
      });
      if (!article) throw new Error("Article not found");
      updateData.article = {
        connect: {
          id: article.id,
        },
      };
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: updateData,
    });
    return { success: true, data: updatedComment };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit comment",
    };
  }
}
