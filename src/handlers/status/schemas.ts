import z from "zod";
import { connectionStatusSchema } from "../../services/connection/schemas.js";

export const updateEventSchema = connectionStatusSchema.omit({
  timestamp: true,
});
export const getEventSchema = z.object({
  deviceId: z.string(), // This schema might need to be a bit more detailed, this will be a api gateway event
});
