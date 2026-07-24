import { z } from "zod";

export const CommentSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1)
        .max(500),
});

export const CreateCommentSchema = z.object({
  textMessage: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters"),
});