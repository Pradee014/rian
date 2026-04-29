export type PersonaId = "ria" | "ian";

export type PracticeMode = "casual" | "self-introduction" | "katta-kotta-techa";

export type SessionStatus = "idle" | "active" | "ended";

export type SpeakerId = PersonaId | "user" | "system";

export type TraceEventType =
  | "session_started"
  | "session_ended"
  | "audio_recording_started"
  | "audio_recording_stopped"
  | "user_turn"
  | "router_decision"
  | "assistant_turn"
  | "provider_call";

export type ProviderKind = "voice" | "stt" | "llm" | "tts";

export interface Persona {
  id: PersonaId;
  name: "Ria" | "Ian";
  role: string;
  voiceDirection: string;
  leadsIn: PracticeMode[];
  strengths: string[];
}

export interface TranscriptTurn {
  id: string;
  speaker: SpeakerId;
  text: string;
  createdAt: string;
  personaId?: PersonaId;
}

export interface TraceEvent {
  id: string;
  type: TraceEventType;
  createdAt: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface RianSession {
  id: string;
  status: SessionStatus;
  mode: PracticeMode;
  activePersonaId: PersonaId;
  startedAt?: string;
  endedAt?: string;
  transcript: TranscriptTurn[];
  traces: TraceEvent[];
}

export interface RouterInput {
  userText: string;
  mode: PracticeMode;
  allowBoth?: boolean;
}

export interface RouterDecision {
  primaryPersonaId: PersonaId;
  secondaryPersonaId?: PersonaId;
  reason: string;
}
