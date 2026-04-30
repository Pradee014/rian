import { defineAgent, type JobContext, type llm, voice } from "@livekit/agents";
import * as xai from "@livekit/agents-plugin-xai";

import { getRianAgentConfig } from "./config";
import { buildOpeningReplyInstructions, buildRianAgentInstructions } from "./instructions";
import { chooseLivePersona } from "./persona-routing";
import { encodeWorkerTrace, RIAN_TRACE_TOPIC } from "@/lib/livekit/worker-trace";
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
    private readonly publishTrace?: (personaId: PersonaId, reason: string) => Promise<void>,
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

    await this.publishTrace?.(decision.personaId, decision.reason);
    this.session.updateAgent(
      createRianVoiceAgent(this.config, decision.personaId, this.publishTrace),
    );
  }
}

export function createRianVoiceAgent(
  config: ReturnType<typeof getRianAgentConfig>,
  personaId: PersonaId = "ria",
  publishTrace?: (personaId: PersonaId, reason: string) => Promise<void>,
) {
  return new RianPersonaAgent(config, personaId, publishTrace);
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
    const publishTrace = async (personaId: PersonaId, reason: string) => {
      const voice = personaId === "ian" ? config.ianVoice : config.riaVoice;

      await ctx.room.localParticipant?.publishData(
        encodeWorkerTrace({
          type: reason === "Worker started." ? "worker_started" : "persona_route",
          personaId,
          reason,
          voice,
          createdAt: new Date().toISOString(),
        }),
        {
          reliable: true,
          topic: RIAN_TRACE_TOPIC,
        },
      );
    };
    const session = new voice.AgentSession({
      llm: createRealtimeModel(config, "ria"),
    });

    await session.start({
      agent: createRianVoiceAgent(config, "ria", publishTrace),
      room: ctx.room,
    });

    await publishTrace("ria", "Worker started.");

    await session.generateReply({
      instructions: buildOpeningReplyInstructions(),
    });
  },
});
