import {
  GreengrassV2Client,
  CreateDeploymentCommand,
} from "@aws-sdk/client-greengrassv2";

export async function createDeployment(
  client: GreengrassV2Client,
  group: string,
  component: string,
  version: string,
) {
  // Example command, consider rollout config and abort config etc
  const cmd = new CreateDeploymentCommand({
    targetArn: `arn:aws:iot:eu-central-1:123456789012:thinggroup/${group}`,
    components: {
      [component]: { componentVersion: version },
    },
    iotJobConfiguration: {
      jobExecutionsRolloutConfig: {
        maximumPerMinute: 10,
      },
      abortConfig: {
        criteriaList: [
          {
            failureType: "FAILED",
            action: "CANCEL",
            thresholdPercentage: 20,
            minNumberOfExecutedThings: 5,
          },
        ],
      },
    },
  });

  return client.send(cmd);
}
