import { DEFAULT_ACTIVE_PERSONA_ID } from "./personas";
import type {
  PersonaId,
  PracticeMode,
  RianSession,
  SpeakerId,
  TraceEvent,
  TraceEventType,
  TranscriptTurn,
} from "./types";

interface SessionFactoryOptions {
  id?: string;
  now?: () => string;
  makeId?: (prefix: string) => string;
}

const defaultNow = () => new Date().toISOString();
const defaultMakeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function makeTrace(
  type: TraceEventType,
  message: string,
  options: Required<SessionFactoryOptions>,
  metadata?: TraceEvent["metadata"],
): TraceEvent {
  return {
    id: options.makeId("trace"),
    type,
    createdAt: options.now(),
    message,
    metadata,
  };
}

export function createSession(
  mode: PracticeMode = "casual",
  options: SessionFactoryOptions = {},
): RianSession {
  const factory = {
    id: options.id ?? defaultMakeId("session"),
    now: options.now ?? defaultNow,
    makeId: options.makeId ?? defaultMakeId,
  };
  const startedAt = factory.now();

  return {
    id: factory.id,
    status: "active",
    mode,
    activePersonaId: mode === "self-introduction" ? "ian" : DEFAULT_ACTIVE_PERSONA_ID,
    startedAt,
    transcript: [],
    traces: [
      {
        id: factory.makeId("trace"),
        type: "session_started",
        createdAt: startedAt,
        message: "Practice session started.",
        metadata: { mode },
      },
    ],
  };
}

export function appendTrace(
  session: RianSession,
  type: TraceEventType,
  message: string,
  metadata?: TraceEvent["metadata"],
  options: SessionFactoryOptions = {},
): RianSession {
  const factory = {
    id: options.id ?? session.id,
    now: options.now ?? defaultNow,
    makeId: options.makeId ?? defaultMakeId,
  };

  return {
    ...session,
    traces: [...session.traces, makeTrace(type, message, factory, metadata)],
  };
}

export function appendTurn(
  session: RianSession,
  input: {
    speaker: SpeakerId;
    text: string;
    personaId?: PersonaId;
  },
  options: SessionFactoryOptions = {},
): RianSession {
  const now = options.now ?? defaultNow;
  const makeId = options.makeId ?? defaultMakeId;
  const turn: TranscriptTurn = {
    id: makeId("turn"),
    speaker: input.speaker,
    text: input.text,
    createdAt: now(),
    personaId: input.personaId,
  };

  return {
    ...session,
    transcript: [...session.transcript, turn],
  };
}

export function setActivePersona(
  session: RianSession,
  activePersonaId: PersonaId,
  options: SessionFactoryOptions = {},
): RianSession {
  return appendTrace(
    {
      ...session,
      activePersonaId,
    },
    "router_decision",
    `Active speaker set to ${activePersonaId}.`,
    { activePersonaId },
    options,
  );
}

export function endSession(
  session: RianSession,
  options: SessionFactoryOptions = {},
): RianSession {
  const now = options.now ?? defaultNow;
  const endedAt = now();

  return appendTrace(
    {
      ...session,
      status: "ended",
      endedAt,
    },
    "session_ended",
    "Practice session ended.",
    { mode: session.mode, turnCount: session.transcript.length },
    { ...options, now: () => endedAt },
  );
}
