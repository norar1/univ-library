import { Client as workflowClient } from "@upstash/workflow";
import config from "@/lib/config";
export const workflowclient = new workflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});
