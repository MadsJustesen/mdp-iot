import { GreengrassV2Client } from "@aws-sdk/client-greengrassv2";
import { DeviceDeploymentService } from "../../services/deployment/DeviceDeploymentService.js";
import { z } from "zod";

const greenGrassClient = new GreengrassV2Client();

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || "{}");
  const { group, component, version } = body;

  const schema = z.object({
    group: z.string(),
    component: z.string(),
    version: z.string(),
  });

  const parseResult = schema.safeParse({ group, component, version });
  if (!parseResult.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request body",
        error: parseResult.error,
      }),
    };
  }

  const deploymentService = new DeviceDeploymentService(greenGrassClient);

  await deploymentService.createDeployment({ group, component, version });

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Deployment published",
    }),
  };
};
