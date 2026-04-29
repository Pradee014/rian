import { describe, expect, it } from "vitest";

import rianAgent, { createRealtimeModelOptions, createRianVoiceAgent } from "./agent";
import { getRianAgentConfig } from "./config";

const env = {
  LIVEKIT_URL: "wss://rian.example.livekit.cloud",
  LIVEKIT_API_KEY: "livekit-key",
  LIVEKIT_API_SECRET: "livekit-secret",
  XAI_API_KEY: "xai-key",
  XAI_RIA_VOICE: "ara",
  XAI_IAN_VOICE: "rex",
};

describe("Rian LiveKit agent worker", () => {
  it("exports a LiveKit agent entrypoint", () => {
    expect(rianAgent).toMatchObject({
      entry: expect.any(Function),
    });
  });

  it("builds xAI realtime options without hardcoding a model", () => {
    const config = getRianAgentConfig(env);

    expect(createRealtimeModelOptions(config)).toEqual({
      apiKey: "xai-key",
      voice: "ara",
    });
  });

  it("passes an explicit model only when configured", () => {
    const config = getRianAgentConfig({
      ...env,
      XAI_REALTIME_MODEL: "grok-realtime-custom",
    });

    expect(createRealtimeModelOptions(config)).toMatchObject({
      model: "grok-realtime-custom",
    });
  });

  it("creates the rian-agent voice agent with Rian instructions", () => {
    const agent = createRianVoiceAgent(getRianAgentConfig(env));

    expect(agent.id).toBe("rian-agent");
    expect(agent.instructions).toContain("private voice-first communication training coach");
    expect(agent.instructions).toContain("one active AI speaker");
  });
});
