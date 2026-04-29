import { describe, expect, it, vi } from "vitest";
import { mockLlm } from "@/lib/providers/mock-llm";
import { mockStt } from "@/lib/providers/mock-stt";
import { mockTts } from "@/lib/providers/mock-tts";
import { completeConversationTurn } from "./conversation-turn";
import { createSession } from "./session";

const options = {
  id: "session-1",
  now: () => "2026-04-29T06:00:00.000Z",
  makeId: (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 6)}`,
};

describe("completeConversationTurn", () => {
  it("routes text turns through router, LLM, TTS, transcript, and traces", async () => {
    const session = createSession("self-introduction", options);
    const next = await completeConversationTurn(
      session,
      { type: "text", userText: "Help me introduce myself." },
      { llm: mockLlm, tts: mockTts },
    );

    expect(next.activePersonaId).toBe("ian");
    expect(next.transcript).toHaveLength(2);
    expect(next.transcript[0]).toMatchObject({
      speaker: "user",
      text: "Help me introduce myself.",
    });
    expect(next.transcript[1]).toMatchObject({
      speaker: "system",
      personaId: "ian",
    });
    expect(next.traces.map((trace) => trace.type)).toContain("router_decision");
    expect(next.traces.filter((trace) => trace.type === "provider_call")).toHaveLength(2);
  });

  it("transcribes audio once before completing the turn", async () => {
    const stt = {
      ...mockStt,
      transcribe: vi.fn(mockStt.transcribe),
    };
    const next = await completeConversationTurn(
      createSession("casual", options),
      { type: "audio", audioId: "audio-1" },
      { stt, llm: mockLlm, tts: mockTts },
    );

    expect(stt.transcribe).toHaveBeenCalledOnce();
    expect(next.transcript[0]?.text).toBe("Mock transcript for audio-1");
    expect(next.activePersonaId).toBe("ria");
    expect(next.traces.filter((trace) => trace.type === "provider_call")).toHaveLength(3);
  });

  it("requires STT for audio turns", async () => {
    await expect(
      completeConversationTurn(
        createSession("casual", options),
        { type: "audio", audioId: "audio-1" },
        { llm: mockLlm, tts: mockTts },
      ),
    ).rejects.toThrow("An STT adapter is required");
  });
});
