import type { PersonaId } from "@/lib/rian/types";

export const RIAN_TRACE_TOPIC = "rian.trace";

export type WorkerTraceType = "persona_route" | "worker_started";

export interface WorkerTraceEvent {
  type: WorkerTraceType;
  personaId: PersonaId;
  reason: string;
  voice: string;
  createdAt: string;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTraceType(value: unknown): value is WorkerTraceType {
  return value === "persona_route" || value === "worker_started";
}

function isPersonaId(value: unknown): value is PersonaId {
  return value === "ria" || value === "ian";
}

export function encodeWorkerTrace(event: WorkerTraceEvent) {
  return textEncoder.encode(JSON.stringify(event));
}

export function decodeWorkerTrace(payload: Uint8Array): WorkerTraceEvent | null {
  try {
    const parsed: unknown = JSON.parse(textDecoder.decode(payload));

    if (!isRecord(parsed)) {
      return null;
    }

    if (
      !isTraceType(parsed.type) ||
      !isPersonaId(parsed.personaId) ||
      typeof parsed.reason !== "string" ||
      typeof parsed.voice !== "string" ||
      typeof parsed.createdAt !== "string"
    ) {
      return null;
    }

    return {
      type: parsed.type,
      personaId: parsed.personaId,
      reason: parsed.reason,
      voice: parsed.voice,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}
