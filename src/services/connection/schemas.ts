import z from "zod";

export const connectionStatusSchema = z.object({
  deviceId: z.string(),
  connected: z.boolean(),
  timestamp: z.string(),
  currentVersion: z.string(),
});
