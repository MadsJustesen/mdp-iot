import { z } from "zod";

export const handler = async (event: any) => {
  // /device/{id}/data topic consumer
  // Example handling of different payload types:

  const baseSchema = z.object({
    deviceId: z.string(),
    type: z.string(),
    timestamp: z.number().optional(),
    data: z.unknown(),
  });

  // Example: extend for different types
  const temperatureSchema = baseSchema.extend({
    type: z.literal("temperature"),
    data: z.object({
      value: z.number(),
      unit: z.string().optional(),
    }),
  });

  const humiditySchema = baseSchema.extend({
    type: z.literal("humidity"),
    data: z.object({
      value: z.number(),
      unit: z.string().optional(),
    }),
  });

  // Discriminated union for all supported types
  const eventSchema = z.discriminatedUnion("type", [
    temperatureSchema,
    humiditySchema,
    // Add more schemas here as needed
  ]);

  let parsed;
  try {
    parsed = eventSchema.parse(event);
  } catch (err) {
    console.error("Invalid event:", err);
    throw new Error("Invalid event payload");
  }

  console.log("Parsed event:", parsed);
  // Persist parsed data into data store or submit to data pipeline
};
