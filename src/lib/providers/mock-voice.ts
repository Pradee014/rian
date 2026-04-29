import type { VoiceRuntimeAdapter } from "./types";

export const mockVoiceRuntime: VoiceRuntimeAdapter = {
  provider: "mock-voice-runtime",
  async startSession({ mode }) {
    const startedAt = Date.now();

    return {
      data: { roomId: `mock-room-${mode}` },
      trace: {
        type: "provider_call",
        message: "Mock voice room started.",
        metadata: {
          provider: this.provider,
          providerKind: "voice",
          latencyMs: Date.now() - startedAt,
          mocked: true,
        },
      },
    };
  },
  async endSession({ roomId }) {
    const startedAt = Date.now();

    return {
      data: { roomId },
      trace: {
        type: "provider_call",
        message: "Mock voice room ended.",
        metadata: {
          provider: this.provider,
          providerKind: "voice",
          latencyMs: Date.now() - startedAt,
          mocked: true,
        },
      },
    };
  },
};
