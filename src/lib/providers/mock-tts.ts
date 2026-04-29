import type { TtsAdapter } from "./types";

export const mockTts: TtsAdapter = {
  provider: "mock-tts",
  async synthesize({ personaId, text }) {
    const startedAt = Date.now();

    return {
      data: {
        audioId: `mock-audio-${personaId}-${text.length}`,
        durationMs: Math.max(900, text.length * 42),
      },
      trace: {
        type: "provider_call",
        message: "Mock TTS audio synthesized.",
        metadata: {
          provider: this.provider,
          providerKind: "tts",
          latencyMs: Date.now() - startedAt,
          mocked: true,
        },
      },
    };
  },
};
