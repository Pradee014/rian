import type { PersonaId, RouterDecision, RouterInput } from "./types";

const RIA_PATTERNS = [
  /\bria\b/i,
  /\bria,\s*take this\b/i,
  /\bonly ria\b/i,
  /\bmake (it|this) (warmer|natural|playful|smooth)\b/i,
];

const IAN_PATTERNS = [
  /\bian\b/i,
  /\bian,\s*sharpen this\b/i,
  /\bonly ian\b/i,
  /\b(sharpen|structure|clarify|pitch|direct)\b/i,
];

const BOTH_PATTERNS = [
  /\bboth\b/i,
  /\bboth perspectives\b/i,
  /\bria and ian\b/i,
];

function includesAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function defaultPersonaForMode(mode: RouterInput["mode"]): PersonaId {
  if (mode === "self-introduction") {
    return "ian";
  }

  return "ria";
}

export function routePersona(input: RouterInput): RouterDecision {
  const userText = input.userText.trim();
  const asksForBoth = input.allowBoth === true && includesAny(userText, BOTH_PATTERNS);
  const asksForRia = includesAny(userText, RIA_PATTERNS);
  const asksForIan = includesAny(userText, IAN_PATTERNS);

  if (asksForBoth) {
    const primaryPersonaId = input.mode === "self-introduction" ? "ian" : "ria";
    return {
      primaryPersonaId,
      secondaryPersonaId: primaryPersonaId === "ria" ? "ian" : "ria",
      reason: "User explicitly asked for both perspectives.",
    };
  }

  if (asksForRia && !asksForIan) {
    return {
      primaryPersonaId: "ria",
      reason: "User explicitly routed the turn to Ria.",
    };
  }

  if (asksForIan && !asksForRia) {
    return {
      primaryPersonaId: "ian",
      reason: "User explicitly routed the turn to Ian or asked for sharper structure.",
    };
  }

  const primaryPersonaId = defaultPersonaForMode(input.mode);

  return {
    primaryPersonaId,
    reason:
      primaryPersonaId === "ria"
        ? "Casual practice defaults to Ria for warmth and conversational flow."
        : "Self-introduction practice defaults to Ian for clarity and structure.",
  };
}
