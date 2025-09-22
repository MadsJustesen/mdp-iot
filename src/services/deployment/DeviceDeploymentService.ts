import type { CreateDeploymentParameters } from "./types.js";
import { createDeployment as createGreengrassDeployment } from "../../lib/greengrass/create_deployment.js";
import type { GreengrassV2Client } from "@aws-sdk/client-greengrassv2";
import { z } from "zod";

export class DeviceDeploymentService {
  constructor(private readonly greengrassClient: GreengrassV2Client) {}

  private readonly createDeploymentSchema = z.object({
    group: z.string().min(1, "Group is required"),
    component: z.string().min(1, "Component is required"),
    version: z.string().min(1, "Version is required"),
  });

  async createDeployment({
    group,
    component,
    version,
  }: CreateDeploymentParameters): Promise<void> {
    const parsed = this.createDeploymentSchema.parse({
      group,
      component,
      version,
    });

    await createGreengrassDeployment(
      this.greengrassClient,
      parsed.group,
      parsed.component,
      parsed.version
    );
  }
}
