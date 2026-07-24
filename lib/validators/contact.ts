import { z } from "zod";

export const CreateContactSchema = z.object({

    name: z.string().min(2).max(50),
    subject: z.string().max(2000),
    email:  z.string().trim().email(),
    message: z.string().max(5000),
});