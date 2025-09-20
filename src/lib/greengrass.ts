import {
  GreengrassV2Client,
  CreateDeploymentCommand,
} from "@aws-sdk/client-greengrassv2";

const client = new GreengrassV2Client({});

export async function createDeployment(
  group: string,
  component: string,
  version: string
) {
  // TODO: Example command, consider rollout config and abort config etc
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
