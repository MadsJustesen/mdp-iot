import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

export const handler = async (event: any) => {
  const client = new IoTDataPlaneClient({
    region: process.env.AWS_REGION || "",
  });

  const topic = `devices/${event.deviceId}/reboot`;

  await client.send(
    new PublishCommand({
      topic,
      qos: 1,
    })
  );
};
