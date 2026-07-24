import { z } from "zod";
import { ObjectIdSchema } from "./common";

export const MarkNotificationSchema = z.object({
    notificationId : ObjectIdSchema
});