import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { updateEventSchema } from "./schema.js";

const dynamodb = new DynamoDBClient();
const TABLE_NAME = process.env.CONNECTION_STATUS_TABLE_NAME;

/**
 * Lambda handler to update the device connection status in DynamoDB.
 *
 * @param event - The event object containing deviceId, status, lastSeen, and currentVersion.
 * @returns Promise<void>
 */
export const handler = async (event: any): Promise<void> => {
  const { deviceId, status, lastSeen, currentVersion } =
    updateEventSchema.parse(event); // use safeparse and handle error

  await dynamodb.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        deviceId: { S: deviceId },
        status: { S: status },
        lastSeen: { S: lastSeen },
        currentVersion: { S: currentVersion },
      },
    })
  );
};
