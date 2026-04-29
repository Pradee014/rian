import { cli, ServerOptions } from "@livekit/agents";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";

import { getRianAgentConfig } from "./config";

loadEnv({ path: ".env.local" });
loadEnv();

const config = getRianAgentConfig();

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(new URL("./agent.ts", import.meta.url)),
    agentName: config.agentName,
    wsURL: config.livekitUrl,
    apiKey: config.livekitApiKey,
    apiSecret: config.livekitApiSecret,
  }),
);
