import { z } from "zod";

export const UpdateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50),

  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .optional(),

  email: z
    .string()
    .email()
    .optional(),

  bio: z
    .string()
    .trim()
    .max(300)
    .optional(),

  college: z
    .string()
    .trim()
    .max(100)
    .optional(),

  department: z
    .string()
    .trim()
    .max(100)
    .optional(),

  year: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(4)
    .optional(),

  interests: z
    .array(z.string().trim())
    .optional(),

  socialLinks: z.object({
    linkedin: z.string().trim().optional(),
    github: z.string().trim().optional(),
    twitter: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
  }).optional(),

  profilePhoto: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("/") ||
        /^https?:\/\/.+/.test(value),
      {
        message: "Invalid profile photo",
      }
    )
    .optional(),
});