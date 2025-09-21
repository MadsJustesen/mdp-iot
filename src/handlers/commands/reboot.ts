import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeviceCommandService } from "../../services/command/DeviceCommandService.js";
import { IoTDataPlaneClient } from "@aws-sdk/client-iot-data-plane";
import { DeviceConnectionStatusService } from "../../services/connection/DeviceConnectionStatusService.js";

const dynamodb = new DynamoDBClient();
const iotClient = new IoTDataPlaneClient();

export const handler = async (event: any) => {
  // TODO: Validate event body with zod

  const connectionStatusService = new DeviceConnectionStatusService(dynamodb);
  const commandService = new DeviceCommandService(
    iotClient,
    connectionStatusService,
  );

  try {
    await commandService.rebootDevice(event.deviceId);
  } catch (error) {
    return {
      statusCode: 500,
      body: `Failed to send reboot command: ${(error as Error).message}`,
    };
  }

  return {
    statusCode: 200,
    body: "Reboot command sent",
  };
};
