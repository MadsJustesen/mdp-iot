import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { updateEventSchema } from "./schemas.js";
import { DeviceConnectionStatusService } from "../../services/connection/DeviceConnectionStatusService.js";

const dynamodb = new DynamoDBClient();

export const handler = async (event: any): Promise<void> => {
  const updateEvent = updateEventSchema.safeParse(event);
  if (!updateEvent.success) {
    throw new Error(`Invalid event schema: ${updateEvent.error.message}`);
  }

  const connectionStatusService = new DeviceConnectionStatusService(dynamodb);
  await connectionStatusService.updateDeviceStatus(updateEvent.data);
};
