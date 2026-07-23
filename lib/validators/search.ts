import { z } from "zod";

export const SearchSchema = z.object({

    query: z
        .string()
        .trim()
        .min(1)
        .max(50),

});