import { IoTDataPlaneClient } from "@aws-sdk/client-iot-data-plane";
import { DeviceConnectionStatusService } from "../DeviceConnectionStatusService.js";
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const dynamoClient = new DynamoDBClient();
const iotClient = new IoTDataPlaneClient();

const connectionStatusService = new DeviceConnectionStatusService(dynamoClient);

const dynamodbClientMock = mockClient(dynamoClient);
const iotClientMock = mockClient(iotClient);

const deviceId = "test-device-id";
const tableName = "test-table";

describe("update_device_connection_status", () => {
  beforeAll(() => {
    process.env.CONNECTION_STATUS_TABLE_NAME = tableName;
  });

  afterEach(() => {
    dynamodbClientMock.reset();
    iotClientMock.reset();
  });

  afterAll(() => {
    process.env.CONNECTION_STATUS_TABLE_NAME = undefined;
  });

  it("should successfully update device connection status", async () => {
    dynamodbClientMock.on(UpdateItemCommand).resolves({});
    await expect(
      connectionStatusService.updateDeviceStatus({
        deviceId,
        connected: true,
        currentVersion: "v1.0.0",
      })
    ).resolves.not.toThrow();

    const calls = dynamodbClientMock.commandCalls(PutItemCommand);
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0].input).toMatchObject({
      TableName: tableName,
      Item: {
        deviceId: { S: deviceId },
        connected: { BOOL: true },
        currentVersion: { S: "v1.0.0" },
        timestamp: { S: expect.any(String) },
      },
    });
  });

  it("should throw error if schema is invalid", async () => {
    await expect(
      connectionStatusService.updateDeviceStatus({
        // @ts-expect-error: intentionally passing invalid schema
        deviceId: 123,
        // @ts-expect-error: intentionally passing invalid schema
        connected: "yes",
        // @ts-expect-error: intentionally passing invalid schema
        currentVersion: null, // invalid type, should be string
      })
    ).rejects.toThrow();

    await expect(
      connectionStatusService.updateDeviceStatus({
        deviceId: "",
        // @ts-expect-error: intentionally passing invalid schema
        connected: "",
        currentVersion: "", // invalid type, should be string
      })
    ).rejects.toThrow();
  });
});
