import { z } from "zod";

export const UpdateProfileSchema = z.object({

    firstName: z.string().min(2).max(50),

    lastName: z.string().min(2).max(50),

    bio: z.string().max(300).optional(),

    location: z.string().max(100).optional(),

    website: z.string().url().optional(),

    profilePhoto: z.string().url().optional(),

});