import z from "zod";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function isValidIsoDate(val: string): boolean {
  return !isNaN(Date.parse(val)) && isoDatePattern.test(val);
}

export const connectionStatusSchema = z.object({
  deviceId: z.string().min(1, { message: "deviceId is required" }),
  connected: z.boolean(),
  timestamp: z
    .string()
    .min(1, { message: "timestamp is required" })
    .refine(isValidIsoDate, {
      message: "timestamp must be a valid ISO date string",
    }),
  currentVersion: z.string().min(1, { message: "currentVersion is required" }),
});
