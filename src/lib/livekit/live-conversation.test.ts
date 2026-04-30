import { describe, expect, it } from "vitest";

import {
  getLiveConversationGuidance,
  makeAgentConnectCommand,
  normalizeRoomNameForCommand,
} from "./live-conversation";

describe("live conversation helpers", () => {
  it("normalizes blank room names to the default room", () => {
    expect(normalizeRoomNameForCommand("   ")).toBe("rian-room");
  });

  it("builds the room-specific worker command", () => {
    expect(makeAgentConnectCommand("intro-practice")).toBe(
      "npm run agent:connect -- --room intro-practice",
    );
  });

  it("quotes room names that include spaces", () => {
    expect(makeAgentConnectCommand("intro practice")).toBe(
      'npm run agent:connect -- --room "intro practice"',
    );
  });

  it("returns idle guidance before the browser joins", () => {
    expect(getLiveConversationGuidance("idle")).toContain("Join the browser");
  });

  it("returns connected guidance with the selected room", () => {
    expect(getLiveConversationGuidance("connected", "rian-room")).toContain(
      "rian-room",
    );
  });

  it("returns error guidance when token creation fails", () => {
    expect(getLiveConversationGuidance("error")).toContain("Check");
  });
});
