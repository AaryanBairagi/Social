import { z } from "zod";

export const CreateStorySchema = z.object({
  mediaUrl: z.string().url("Invalid media URL"),

  fileType: z
    .enum(["image", "video"])
    .default("image"),
});

export const UpdateStorySchema = z.object({
  mediaUrl: z
    .string()
    .url("Invalid media URL")
    .optional(),

  fileType: z
    .enum(["image", "video"])
    .optional(),

  expiresAt: z
    .string()
    .datetime("Invalid expiry date")
    .optional(),
});