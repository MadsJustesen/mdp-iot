import { createDeployment } from "../../lib/greengrass.js";

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || "{}");
  const { group, component, version } = body;

  const result = await createDeployment(group, component, version);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Deployment started",
      result,
    }),
  };
};
