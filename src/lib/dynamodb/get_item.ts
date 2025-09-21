import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  type GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getItem<T>(
  client: DynamoDBClient,
  tableName: string,
  key: Record<string, AttributeValue>,
): Promise<T | undefined> {
  const params: GetItemCommandInput = {
    TableName: tableName,
    Key: key,
  };

  const command = new GetItemCommand(params);
  const response = await client.send(command);

  if (!response.Item) {
    return undefined;
  }

  return unmarshall(response.Item) as T;
}
