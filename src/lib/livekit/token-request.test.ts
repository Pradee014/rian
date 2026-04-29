import { describe, expect, it } from "vitest";
import { getLiveKitPublicConfig, getLiveKitServerConfig } from "./config";
import { parseLiveKitTokenRequest } from "./token-request";

describe("LiveKit config", () => {
  it("reads required server env", () => {
    expect(
      getLiveKitServerConfig({
        LIVEKIT_URL: "wss://example.livekit.cloud",
        LIVEKIT_API_KEY: "key",
        LIVEKIT_API_SECRET: "secret",
      }),
    ).toEqual({
      url: "wss://example.livekit.cloud",
      apiKey: "key",
      apiSecret: "secret",
    });
  });

  it("throws when server env is missing", () => {
    expect(() => getLiveKitServerConfig({})).toThrow("LIVEKIT_URL is required.");
  });

  it("reads public env", () => {
    expect(
      getLiveKitPublicConfig({
        NEXT_PUBLIC_LIVEKIT_URL: "wss://example.livekit.cloud",
      }),
    ).toEqual({ url: "wss://example.livekit.cloud" });
  });
});

describe("parseLiveKitTokenRequest", () => {
  it("parses safe room and participant names", () => {
    expect(
      parseLiveKitTokenRequest({
        roomName: "rian-room",
        participantName: "Pradeep",
      }),
    ).toEqual({
      roomName: "rian-room",
      participantName: "Pradeep",
    });
  });

  it("rejects unsafe room names", () => {
    expect(() =>
      parseLiveKitTokenRequest({
        roomName: "../secret",
        participantName: "Pradeep",
      }),
    ).toThrow("Room name");
  });

  it("rejects unsafe participant names", () => {
    expect(() =>
      parseLiveKitTokenRequest({
        roomName: "rian-room",
        participantName: "<script>",
      }),
    ).toThrow("Participant name");
  });
});
