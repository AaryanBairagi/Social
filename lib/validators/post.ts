import { z } from "zod";
import { ObjectIdSchema } from "./common";

export const CreatePostSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000),

  user: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid user id"),

  imageUrls: z
    .array(z.string().url())
    .default([]),

  fileNames: z
    .array(z.string())
    .default([]),

  fileTypes: z
    .array(z.string())
    .default([]),

  type: z
    .enum(["post", "event"])
    .default("post"),

  eventDate: z
    .string()
    .datetime()
    .optional(),
});

export const SavePostSchema = z.object({
  postId: ObjectIdSchema, 
  userId: ObjectIdSchema
});

export const ArchivePostSchema = z.object({
  postId: ObjectIdSchema,
  unarchive : z.boolean().default(false),
});

export const UpdatePostSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1)
    .max(5000)
    .optional(),

  user: ObjectIdSchema.optional(),

  imageUrls: z
    .array(z.string().url())
    .optional(),

  fileNames: z
    .array(z.string())
    .optional(),

  fileTypes: z
    .array(z.string())
    .optional(),

  type: z
    .enum(["post", "event"])
    .optional(),

  eventDate: z
    .string()
    .datetime()
    .optional(),
});