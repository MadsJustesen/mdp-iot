import { PutItemCommand, type DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export async function putItem(
  dynamoClient: DynamoDBClient,
  tableName: string,
  item: Record<string, any>,
): Promise<void> {
  await dynamoClient.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    }),
  );
}
