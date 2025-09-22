import { IoTDataPlaneClient } from "@aws-sdk/client-iot-data-plane";
import { DeviceConnectionStatusService } from "../connection/DeviceConnectionStatusService.js";
import { publishToTopic } from "../../lib/iot_core/publish_to_topic.js";

export class DeviceCommandService {
  constructor(
    private readonly iotClient: IoTDataPlaneClient,
    private readonly deviceConnectionStatusService: DeviceConnectionStatusService
  ) {}

  async rebootDevice(deviceId: string): Promise<void> {
    const isConnected =
      await this.deviceConnectionStatusService.isDeviceConnected(deviceId);

    if (!isConnected) {
      throw new Error(`Device ${deviceId} is not connected`);
    }

    await publishToTopic(
      this.iotClient,
      `devices/${deviceId}/reboot`,
      JSON.stringify({ action: "reboot" })
    );
  }
}
