import { z } from "zod";

export const CreateEventSchema = z.object({

    title: z.string().min(3).max(100),

    description: z.string().max(2000),

    date: z.string(),

    venue: z.string().min(2),

});