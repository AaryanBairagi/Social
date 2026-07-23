import { z } from "zod";

export const SendMessageSchema = z.object({

    text: z
        .string()
        .trim()
        .min(1)
        .max(2000),

});