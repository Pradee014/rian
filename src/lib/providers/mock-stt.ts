import type { SttAdapter } from "./types";

export const mockStt: SttAdapter = {
  provider: "mock-stt",
  async transcribe({ audioId }) {
    const startedAt = Date.now();

    return {
      data: { text: `Mock transcript for ${audioId}` },
      trace: {
        type: "provider_call",
        message: "Mock STT transcript produced.",
        metadata: {
          provider: this.provider,
          providerKind: "stt",
          latencyMs: Date.now() - startedAt,
          mocked: true,
        },
      },
    };
  },
};
