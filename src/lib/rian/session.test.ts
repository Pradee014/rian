import { describe, expect, it } from "vitest";
import {
  appendTrace,
  appendTurn,
  createSession,
  endSession,
  setActivePersona,
} from "./session";

const testOptions = {
  id: "session-1",
  now: () => "2026-04-29T06:00:00.000Z",
  makeId: (prefix: string) => `${prefix}-1`,
};

describe("session helpers", () => {
  it("starts an active casual session with Ria as the default speaker", () => {
    const session = createSession("casual", testOptions);

    expect(session).toMatchObject({
      id: "session-1",
      status: "active",
      mode: "casual",
      activePersonaId: "ria",
      startedAt: "2026-04-29T06:00:00.000Z",
    });
    expect(session.traces[0]).toMatchObject({ type: "session_started" });
  });

  it("starts self-introduction mode with Ian active", () => {
    expect(createSession("self-introduction", testOptions).activePersonaId).toBe("ian");
  });

  it("appends transcript turns without mutating the original session", () => {
    const session = createSession("casual", testOptions);
    const next = appendTurn(
      session,
      { speaker: "user", text: "I want to practice." },
      testOptions,
    );

    expect(session.transcript).toHaveLength(0);
    expect(next.transcript).toHaveLength(1);
    expect(next.transcript[0]).toMatchObject({
      speaker: "user",
      text: "I want to practice.",
    });
  });

  it("records active persona changes as trace events", () => {
    const next = setActivePersona(createSession("casual", testOptions), "ian", testOptions);

    expect(next.activePersonaId).toBe("ian");
    expect(next.traces.at(-1)).toMatchObject({
      type: "router_decision",
      metadata: { activePersonaId: "ian" },
    });
  });

  it("ends a session and records final trace metadata", () => {
    const session = appendTrace(
      appendTurn(createSession("casual", testOptions), { speaker: "user", text: "Hi" }, testOptions),
      "user_turn",
      "User turn recorded.",
      undefined,
      testOptions,
    );
    const ended = endSession(session, testOptions);

    expect(ended.status).toBe("ended");
    expect(ended.endedAt).toBe("2026-04-29T06:00:00.000Z");
    expect(ended.traces.at(-1)).toMatchObject({
      type: "session_ended",
      metadata: { mode: "casual", turnCount: 1 },
    });
  });
});
