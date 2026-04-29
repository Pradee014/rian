import { PERSONAS } from "@/lib/rian/personas";
import type { LlmAdapter } from "./types";

export const mockLlm: LlmAdapter = {
  provider: "mock-llm",
  async respond({ userText, decision }) {
    const startedAt = Date.now();
    const persona = PERSONAS[decision.primaryPersonaId];
    const prefix =
      decision.primaryPersonaId === "ria"
        ? "Let's make that sound warmer and easier."
        : "Start with the point and keep the sentence clean.";

    return {
      data: {
        personaId: persona.id,
        text: `${prefix} You said: "${userText}"`,
      },
      trace: {
        type: "provider_call",
        message: `${persona.name} mock response generated.`,
        metadata: {
          provider: this.provider,
          providerKind: "llm",
          latencyMs: Date.now() - startedAt,
          mocked: true,
        },
      },
    };
  },
};
