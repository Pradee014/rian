import type { PersonaId } from "@/lib/rian/types";

export interface LivePersonaDecision {
  personaId: PersonaId;
  reason: string;
}

const RIA_PATTERNS = [
  /\bria\b[,\s:]/i,
  /\bonly\s+ria\b/i,
  /\bria\s+only\b/i,
];

const IAN_PATTERNS = [
  /\bian\b[,\s:]/i,
  /\bonly\s+ian\b/i,
  /\bian\s+only\b/i,
];

function matchesAny(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

export function chooseLivePersona(
  userText: string | undefined,
  currentPersonaId: PersonaId,
): LivePersonaDecision {
  const normalized = userText?.trim() ?? "";

  if (matchesAny(normalized, RIA_PATTERNS)) {
    return {
      personaId: "ria",
      reason: "User explicitly asked for Ria.",
    };
  }

  if (matchesAny(normalized, IAN_PATTERNS)) {
    return {
      personaId: "ian",
      reason: "User explicitly asked for Ian.",
    };
  }

  return {
    personaId: currentPersonaId,
    reason: "No explicit live persona route; keeping the current persona.",
  };
}
