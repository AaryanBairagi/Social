import { z } from "zod";

export const CreatePostSchema = z.object({
    caption: z
        .string()
        .trim()
        .max(500)
        .optional(),

    image: z
        .string()
        .url()
        .optional(),
});