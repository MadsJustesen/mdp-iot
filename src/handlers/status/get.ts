import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { getEventSchema } from "./schemas.js";
import { DeviceConnectionStatusService } from "../../services/connection/DeviceConnectionStatusService.js";

const dynamodb = new DynamoDBClient();

export const handler = async (event: any) => {
  const { deviceId } = getEventSchema.parse(event);
  
  const connectionStatusService = new DeviceConnectionStatusService(dynamodb);
  const deviceStatus = await connectionStatusService.getDeviceStatus(deviceId);

  if (!deviceStatus) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Device not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(deviceStatus),
  };
};
