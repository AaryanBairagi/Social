import { z } from "zod";

export const UsageTrackSchema = z.object({
  duration: z
    .number({
      error: "Duration must be a number",
    })
    .positive("Duration must be greater than 0")
    .finite(),
});