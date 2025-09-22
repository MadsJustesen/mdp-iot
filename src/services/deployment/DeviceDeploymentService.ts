import type { CreateDeploymentParameters } from "./types.js";
import { createDeployment as createGreengrassDeployment } from "../../lib/greengrass/create_deployment.js";
import type { GreengrassV2Client } from "@aws-sdk/client-greengrassv2";
import { z } from "zod";

export class DeviceDeploymentService {
  constructor(private readonly greenGrassClient: GreengrassV2Client) {}

  async createDeployment({
    group,
    component,
    version,
  }: CreateDeploymentParameters): Promise<void> {
    const createDeploymentSchema = z.object({
      group: z.string().min(1, "Group is required"),
      component: z.string().min(1, "Component is required"),
      version: z.string().min(1, "Version is required"),
    });

    createDeploymentSchema.parse({ group, component, version });

    await createGreengrassDeployment(
      this.greenGrassClient,
      group,
      component,
      version
    );
  }
}
