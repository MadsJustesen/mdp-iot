import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

export async function publishToTopic(
  client: IoTDataPlaneClient,
  topic: string,
  payload: string,
  qos: number = 1,
): Promise<void> {
  await client.send(
    new PublishCommand({
      topic,
      qos,
      payload: new TextEncoder().encode(payload),
    }),
  );
}
