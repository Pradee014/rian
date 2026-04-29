import type {
  PersonaId,
  PracticeMode,
  ProviderKind,
  RouterDecision,
  TraceEvent,
  TranscriptTurn,
} from "@/lib/rian/types";

export interface ProviderResult<T> {
  data: T;
  trace: Omit<TraceEvent, "id" | "createdAt"> & {
    metadata: {
      provider: string;
      providerKind: ProviderKind;
      latencyMs: number;
      mocked: boolean;
    };
  };
}

export interface VoiceRuntimeAdapter {
  provider: string;
  startSession(input: { mode: PracticeMode }): Promise<ProviderResult<{ roomId: string }>>;
  endSession(input: { roomId: string }): Promise<ProviderResult<{ roomId: string }>>;
}

export interface SttAdapter {
  provider: string;
  transcribe(input: { audioId: string }): Promise<ProviderResult<{ text: string }>>;
}

export interface LlmAdapter {
  provider: string;
  respond(input: {
    userText: string;
    decision: RouterDecision;
    transcript: TranscriptTurn[];
  }): Promise<ProviderResult<{ personaId: PersonaId; text: string }>>;
}

export interface TtsAdapter {
  provider: string;
  synthesize(input: {
    personaId: PersonaId;
    text: string;
  }): Promise<ProviderResult<{ audioId: string; durationMs: number }>>;
}
