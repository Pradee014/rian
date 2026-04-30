import { describe, expect, it } from "vitest";

import {
  decodeWorkerTrace,
  encodeWorkerTrace,
  RIAN_TRACE_TOPIC,
  type WorkerTraceEvent,
} from "./worker-trace";

const event: WorkerTraceEvent = {
  type: "persona_route",
  personaId: "ian",
  reason: "User explicitly asked for Ian.",
  voice: "rex",
  createdAt: "2026-04-29T19:45:00.000Z",
};

describe("worker trace wire format", () => {
  it("uses the rian trace topic", () => {
    expect(RIAN_TRACE_TOPIC).toBe("rian.trace");
  });

  it("round-trips a worker trace event", () => {
    expect(decodeWorkerTrace(encodeWorkerTrace(event))).toEqual(event);
  });

  it("rejects invalid JSON", () => {
    expect(decodeWorkerTrace(new TextEncoder().encode("{"))).toBeNull();
  });

  it("rejects unknown trace types", () => {
    const payload = new TextEncoder().encode(
      JSON.stringify({
        ...event,
        type: "unknown",
      }),
    );

    expect(decodeWorkerTrace(payload)).toBeNull();
  });

  it("rejects invalid personas", () => {
    const payload = new TextEncoder().encode(
      JSON.stringify({
        ...event,
        personaId: "both",
      }),
    );

    expect(decodeWorkerTrace(payload)).toBeNull();
  });
});
