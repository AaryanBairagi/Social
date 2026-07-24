import { z } from "zod";

export const CreateNoteSchema = z.object({
  fileUrl: z
    .string()
    .trim()
    .url("Invalid file URL"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000),

  folder: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),

  createdAt: z
    .string()
    .datetime()
    .optional(),
});


export const UpdateNoteSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000)
    .optional(),

  folder: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),
});