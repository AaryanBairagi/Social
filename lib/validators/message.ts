import { z } from "zod";
import { ObjectIdSchema } from "./common";

export const SendMessageSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(2000)
      .optional(),

    post: ObjectIdSchema.optional(),
  })
  .refine(
    (data) => !!data.text || !!data.post,
    {
      message: "Either a message or a post must be provided.",
    }
  );