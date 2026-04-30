import { describe, expect, it } from "vitest";

import {
  formatLiveDebugEvent,
  formatTranscription,
  hasRianAgentParticipant,
  summarizeParticipants,
} from "./live-debug";

describe("live debug helpers", () => {
  it("detects the rian-agent participant", () => {
    expect(
      hasRianAgentParticipant([
        { identity: "pradeep" },
        { identity: "rian-agent" },
      ]),
    ).toBe(true);
  });

  it("summarizes participants with agent presence", () => {
    expect(
      summarizeParticipants([
        { identity: "pradeep" },
        { identity: "rian-agent" },
      ]),
    ).toEqual({
      count: 2,
      agentPresent: true,
      identities: ["pradeep", "rian-agent"],
    });
  });

  it("formats known room events", () => {
    expect(formatLiveDebugEvent("participant_connected", "rian-agent")).toBe(
      "Participant joined: rian-agent",
    );
  });

  it("formats unknown room events defensively", () => {
    expect(formatLiveDebugEvent("custom_event", "payload")).toBe("custom_event: payload");
  });

  it("formats transcription stream data", () => {
    expect(
      formatTranscription({
        participantIdentity: "rian-agent",
        text: "Welcome to Rian.",
      }),
    ).toEqual({
      speaker: "rian-agent",
      text: "Welcome to Rian.",
    });
  });

  it("trims empty transcription text", () => {
    expect(
      formatTranscription({
        participantIdentity: "rian-agent",
        text: "   ",
      }),
    ).toEqual({
      speaker: "rian-agent",
      text: "",
    });
  });
});
