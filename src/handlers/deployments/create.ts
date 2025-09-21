import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeviceConnectionStatusService } from "../../services/connection/DeviceConnectionStatusService.js";
import { GreengrassV2Client } from "@aws-sdk/client-greengrassv2";
import { DeviceDeploymentService } from "../../services/deployment/DeviceDeploymentService.js";

const dynamodb = new DynamoDBClient();
const greenGrassClient = new GreengrassV2Client();

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || "{}");
  const { group, component, version } = body;

  // TODO: Validate event body with zod

  const connectionStatusService = new DeviceConnectionStatusService(dynamodb);
  const deploymentService = new DeviceDeploymentService(
    greenGrassClient,
    connectionStatusService,
  );

  await deploymentService.createDeployment({ group, component, version });

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Deployment published",
    }),
  };
};
