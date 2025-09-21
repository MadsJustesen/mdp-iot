import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { putItem } from "../../lib/dynamodb/put_item.js";
import type {
  ConnectionStatus,
  UpdateConnectionStatusParameters,
} from "./types.js";
import { getItem } from "../../lib/dynamodb/get_item.js";
import { connectionStatusSchema } from "./schemas.js";

export class DeviceConnectionStatusService {
  constructor(private readonly dynamoClient: DynamoDBClient) {}

  async isDeviceConnected(deviceId: string): Promise<boolean> {
    const deviceStatus = await this.getDeviceStatus(deviceId);
    if (!deviceStatus) {
      return false;
    }
    return deviceStatus.connected;
  }

  async getDeviceStatus(deviceId: string): Promise<ConnectionStatus | null> {
    const deviceStatus = await getItem<ConnectionStatus>(
      this.dynamoClient,
      this.getTableName(),
      {
        deviceId: { S: deviceId },
      },
    );

    if (!deviceStatus) {
      return null;
    }

    const connectionStatus = connectionStatusSchema.parse(deviceStatus);
    return connectionStatus;
  }

  async updateDeviceStatus({
    deviceId,
    connected,
    currentVersion,
  }: UpdateConnectionStatusParameters): Promise<void> {
    await putItem(this.dynamoClient, this.getTableName(), {
      deviceId,
      connected,
      timestamp: new Date().toISOString(),
      currentVersion,
    });
  }

  private getTableName(): string {
    const tableName = process.env.CONNECTION_STATUS_TABLE_NAME;
    if (!tableName) {
      throw new Error(
        "Environment variable CONNECTION_STATUS_TABLE_NAME is not defined.",
      );
    }
    return tableName;
  }
}
