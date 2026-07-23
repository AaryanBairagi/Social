import { z } from "zod";

export const UploadSchema = z.object({

    imageUrl: z.string().url(),

});