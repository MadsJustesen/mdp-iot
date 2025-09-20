import z from "zod";

export const connectionStatusSchema = z.object({
  deviceId: z.string(),
  status: z.enum(["connected", "disconnected"]),
  lastSeen: z.string(),
  currentVersion: z.string(),
});

export const updateEventSchema = connectionStatusSchema;
export const getEventSchema = z.object({
  deviceId: z.string(), // This schema might need to be a bit more detailed, this will be a api gateway event
});
