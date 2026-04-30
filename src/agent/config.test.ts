import { describe, expect, it } from "vitest";

import { getRianAgentConfig } from "./config";
import { buildOpeningReplyInstructions, buildRianAgentInstructions } from "./instructions";

const baseEnv = {
  LIVEKIT_URL: "wss://rian.example.livekit.cloud",
  LIVEKIT_API_KEY: "livekit-key",
  LIVEKIT_API_SECRET: "livekit-secret",
  XAI_API_KEY: "xai-key",
};

describe("Rian agent config", () => {
  it("reads required LiveKit and xAI env", () => {
    expect(getRianAgentConfig(baseEnv)).toMatchObject({
      livekitUrl: "wss://rian.example.livekit.cloud",
      livekitApiKey: "livekit-key",
      livekitApiSecret: "livekit-secret",
      xaiApiKey: "xai-key",
      agentName: "rian-agent",
    });
  });

  it("keeps the xAI realtime model optional so the plugin default can be used", () => {
    expect(getRianAgentConfig({ ...baseEnv, XAI_REALTIME_MODEL: "" }).xaiRealtimeModel).toBe(
      undefined,
    );
  });

  it("exposes explicit default voices for Ria and Ian", () => {
    expect(getRianAgentConfig(baseEnv)).toMatchObject({
      riaVoice: "ara",
      ianVoice: "rex",
    });
  });

  it("allows voice overrides without changing agent code", () => {
    expect(
      getRianAgentConfig({
        ...baseEnv,
        XAI_RIA_VOICE: "eve",
        XAI_IAN_VOICE: "leo",
      }),
    ).toMatchObject({
      riaVoice: "eve",
      ianVoice: "leo",
    });
  });

  it("throws when a required secret is missing", () => {
    expect(() => getRianAgentConfig({ ...baseEnv, XAI_API_KEY: "" })).toThrow(
      "XAI_API_KEY is required",
    );
  });
});

describe("Rian agent instructions", () => {
  it("includes Rian's core behavior rules", () => {
    const instructions = buildRianAgentInstructions(getRianAgentConfig(baseEnv));

    expect(instructions).toContain("private voice-first communication training coach");
    expect(instructions).toContain("one active AI speaker");
    expect(instructions).toContain("Lead this turn as Ria");
    expect(instructions).toContain("not sycophantic");
    expect(instructions).toContain("Do not create romantic or sexual behavior");
    expect(instructions).toContain("Do not store or imply hidden memory");
  });

  it("keeps the opening reply short and choice-oriented", () => {
    const instructions = buildOpeningReplyInstructions();

    expect(instructions).toContain("casual conversation");
    expect(instructions).toContain("self-introduction");
    expect(instructions).toContain("under 20 seconds");
  });
});
