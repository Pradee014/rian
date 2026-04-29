export type RianAgentEnv = Record<string, string | undefined>;

export interface RianAgentConfig {
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
  xaiApiKey: string;
  xaiRealtimeModel?: string;
  riaVoice: string;
  ianVoice: string;
  agentName: string;
}

function requireEnv(env: RianAgentEnv, name: string) {
  const value = env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for the Rian agent worker.`);
  }

  return value;
}

function optionalEnv(env: RianAgentEnv, name: string) {
  const value = env[name]?.trim();

  return value || undefined;
}

export function getRianAgentConfig(env: RianAgentEnv = process.env): RianAgentConfig {
  return {
    livekitUrl: requireEnv(env, "LIVEKIT_URL"),
    livekitApiKey: requireEnv(env, "LIVEKIT_API_KEY"),
    livekitApiSecret: requireEnv(env, "LIVEKIT_API_SECRET"),
    xaiApiKey: requireEnv(env, "XAI_API_KEY"),
    xaiRealtimeModel: optionalEnv(env, "XAI_REALTIME_MODEL"),
    riaVoice: optionalEnv(env, "XAI_RIA_VOICE") ?? "ara",
    ianVoice: optionalEnv(env, "XAI_IAN_VOICE") ?? "rex",
    agentName: optionalEnv(env, "RIAN_AGENT_NAME") ?? "rian-agent",
  };
}
