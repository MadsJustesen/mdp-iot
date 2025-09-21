import type { DeviceConnectionStatusService } from "../connection/DeviceConnectionStatusService.js";
import type { CreateDeploymentParameters } from "./types.js";
import { createDeployment as createGreengrassDeployment } from "../../lib/greengrass/create_deployment.js";
import type { GreengrassV2Client } from "@aws-sdk/client-greengrassv2";

export class DeviceDeploymentService {
  constructor(
    private readonly greenGrassClient: GreengrassV2Client,
    private readonly deviceConnectionStatusService: DeviceConnectionStatusService,
  ) {}

  async createDeployment({
    group,
    component,
    version,
  }: CreateDeploymentParameters): Promise<void> {
    if (!this.deviceConnectionStatusService.isDeviceConnected) {
      // This actually doesn't make sense, as deployments are to groups, not individual devices
      // But keeping it here for the sake of the example
      throw new Error("Device is not connected");
    }

    await createGreengrassDeployment(
      this.greenGrassClient,
      group,
      component,
      version,
    );
  }
}
