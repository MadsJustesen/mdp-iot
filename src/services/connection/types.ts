import type z from "zod";
import type { connectionStatusSchema } from "./schemas.js";

export type UpdateConnectionStatusParameters = {
  deviceId: string;
  connected: boolean;
  currentVersion: string;
};

export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
