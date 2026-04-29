export interface LiveKitServerConfig {
  url: string;
  apiKey: string;
  apiSecret: string;
}

export interface LiveKitPublicConfig {
  url: string;
}

type EnvReader = Record<string, string | undefined>;

function readRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function getLiveKitServerConfig(env: EnvReader = process.env): LiveKitServerConfig {
  return {
    url: readRequiredEnv("LIVEKIT_URL", env.LIVEKIT_URL),
    apiKey: readRequiredEnv("LIVEKIT_API_KEY", env.LIVEKIT_API_KEY),
    apiSecret: readRequiredEnv("LIVEKIT_API_SECRET", env.LIVEKIT_API_SECRET),
  };
}

export function getLiveKitPublicConfig(env: EnvReader = process.env): LiveKitPublicConfig {
  return {
    url: readRequiredEnv("NEXT_PUBLIC_LIVEKIT_URL", env.NEXT_PUBLIC_LIVEKIT_URL),
  };
}
