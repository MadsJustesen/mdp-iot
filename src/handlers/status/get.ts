import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { connectionStatusSchema, getEventSchema } from "./schema.js";

const dynamodb = new DynamoDBClient();
const TABLE_NAME = process.env.CONNECTION_STATUS_TABLE_NAME;

export const handler = async (event: any) => {
  const { deviceId } = getEventSchema.parse(event);

  const result = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "#pk = :deviceId",
      ExpressionAttributeNames: {
        "#pk": "deviceId",
        "#sk": "lastseen",
      },
      ExpressionAttributeValues: {
        ":deviceId": { S: deviceId },
      },
      ScanIndexForward: false, // Descending order (newest first)
      Limit: 1, // Only get the newest entry
    })
  );
  const connectionStatus =
    connectionStatusSchema.parse(result.Items?.[0]) || null;

  return {
    statusCode: 200,
    body: JSON.stringify(connectionStatus),
  };
};
