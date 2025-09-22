import { mockClient } from "aws-sdk-client-mock";
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

import { DeviceCommandService } from "../DeviceCommandService.js";
import { DeviceConnectionStatusService } from "../../connection/DeviceConnectionStatusService.js";
import { describe, expect, it } from "@jest/globals";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient();
const iotClient = new IoTDataPlaneClient();

const connectionStatusService = new DeviceConnectionStatusService(dynamoClient);
const commandService = new DeviceCommandService(
  iotClient,
  connectionStatusService
);

const dynamodbClientMock = mockClient(dynamoClient);
const iotClientMock = mockClient(iotClient);

const deviceId = "test-device-id";

describe("reboot_device", () => {
  beforeAll(() => {
    process.env.CONNECTION_STATUS_TABLE_NAME = "test-table";
  });

  afterEach(() => {
    dynamodbClientMock.reset();
    iotClientMock.reset();
  });

  afterAll(() => {
    process.env.CONNECTION_STATUS_TABLE_NAME = undefined;
  });

  it("should publish reboot command if device is connected", async () => {
    mockDeviceConnectionStatus(true);

    await commandService.rebootDevice(deviceId);

    expect(
      iotClientMock.commandCalls(PublishCommand, {
        topic: `devices/${deviceId}/reboot`,
        payload: new TextEncoder().encode(JSON.stringify({ action: "reboot" })),
      })
    ).toHaveLength(1);
  });

  it("should throw error if device is not connected", async () => {
    mockDeviceConnectionStatus(false);

    await expect(commandService.rebootDevice(deviceId)).rejects.toThrow(
      `Device ${deviceId} is not connected`
    );

    expect(iotClientMock.commandCalls(PublishCommand)).toHaveLength(0);
  });
});

function mockDeviceConnectionStatus(connected: boolean) {
  dynamodbClientMock.on(GetItemCommand).resolves({
    Item: {
      deviceId: { S: deviceId },
      connected: { BOOL: connected },
      timestamp: { S: "2024-01-01T00:00:00Z" },
      currentVersion: { S: "v1.0.0" },
    },
  });
}
