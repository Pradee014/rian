import { defineAgent, type JobContext, type llm, voice } from "@livekit/agents";
import * as xai from "@livekit/agents-plugin-xai";

import { getRianAgentConfig } from "./config";
import { buildOpeningReplyInstructions, buildRianAgentInstructions } from "./instructions";
import { chooseLivePersona } from "./persona-routing";
import type { PersonaId } from "@/lib/rian/types";

export function createRealtimeModelOptions(
  config: ReturnType<typeof getRianAgentConfig>,
  personaId: PersonaId = "ria",
) {
  return {
    apiKey: config.xaiApiKey,
    voice: personaId === "ian" ? config.ianVoice : config.riaVoice,
    ...(config.xaiRealtimeModel ? { model: config.xaiRealtimeModel } : {}),
  };
}

export class RianPersonaAgent extends voice.Agent {
  constructor(
    private readonly config: ReturnType<typeof getRianAgentConfig>,
    readonly personaId: PersonaId,
  ) {
    super({
      id: `${config.agentName}-${personaId}`,
      instructions: buildRianAgentInstructions(config, personaId),
      llm: createRealtimeModel(config, personaId),
    });
  }

  override async onUserTurnCompleted(
    _chatCtx: llm.ChatContext,
    newMessage: llm.ChatMessage,
  ): Promise<void> {
    const decision = chooseLivePersona(newMessage.textContent, this.personaId);

    if (decision.personaId === this.personaId) {
      return;
    }

    this.session.updateAgent(createRianVoiceAgent(this.config, decision.personaId));
  }
}

export function createRianVoiceAgent(
  config: ReturnType<typeof getRianAgentConfig>,
  personaId: PersonaId = "ria",
) {
  return new RianPersonaAgent(config, personaId);
}

function createRealtimeModel(
  config: ReturnType<typeof getRianAgentConfig>,
  personaId: PersonaId,
) {
  return new xai.realtime.RealtimeModel(createRealtimeModelOptions(config, personaId));
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const config = getRianAgentConfig();
    const session = new voice.AgentSession({
      llm: createRealtimeModel(config, "ria"),
    });

    await session.start({
      agent: createRianVoiceAgent(config),
      room: ctx.room,
    });

    await session.generateReply({
      instructions: buildOpeningReplyInstructions(),
    });
  },
});
