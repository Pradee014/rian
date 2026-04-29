import type { LlmAdapter, SttAdapter, TtsAdapter } from "@/lib/providers/types";
import { routePersona } from "./router";
import { appendTrace, appendTurn, setActivePersona } from "./session";
import type { RianSession } from "./types";

export interface ConversationTurnAdapters {
  stt?: SttAdapter;
  llm: LlmAdapter;
  tts: TtsAdapter;
}

export type ConversationTurnInput =
  | {
      type: "text";
      userText: string;
    }
  | {
      type: "audio";
      audioId: string;
    };

export async function completeConversationTurn(
  session: RianSession,
  input: ConversationTurnInput,
  adapters: ConversationTurnAdapters,
): Promise<RianSession> {
  let text = input.type === "text" ? input.userText : "";
  let baseSession = session;

  if (input.type === "audio") {
    if (!adapters.stt) {
      throw new Error("An STT adapter is required for audio conversation turns.");
    }

    const transcript = await adapters.stt.transcribe({ audioId: input.audioId });
    text = transcript.data.text;
    baseSession = appendTrace(
      baseSession,
      transcript.trace.type,
      transcript.trace.message,
      transcript.trace.metadata,
    );
  }

  const decision = routePersona({ mode: session.mode, userText: text });
  let next = appendTurn(baseSession, { speaker: "user", text });
  next = appendTrace(next, "user_turn", "User utterance recorded.");
  next = setActivePersona(next, decision.primaryPersonaId);
  next = appendTrace(next, "router_decision", decision.reason, {
    primaryPersonaId: decision.primaryPersonaId,
    secondaryPersonaId: decision.secondaryPersonaId ?? null,
  });

  const response = await adapters.llm.respond({
    userText: text,
    decision,
    transcript: next.transcript,
  });
  next = appendTrace(next, response.trace.type, response.trace.message, response.trace.metadata);
  next = appendTurn(next, {
    speaker: "system",
    personaId: response.data.personaId,
    text: response.data.text,
  });

  const audio = await adapters.tts.synthesize({
    personaId: response.data.personaId,
    text: response.data.text,
  });

  return appendTrace(next, audio.trace.type, audio.trace.message, audio.trace.metadata);
}
