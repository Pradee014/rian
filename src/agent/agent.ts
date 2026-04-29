import { defineAgent, type JobContext, voice } from "@livekit/agents";
import * as xai from "@livekit/agents-plugin-xai";

import { getRianAgentConfig } from "./config";
import { buildOpeningReplyInstructions, buildRianAgentInstructions } from "./instructions";

export function createRealtimeModelOptions(config: ReturnType<typeof getRianAgentConfig>) {
  return {
    apiKey: config.xaiApiKey,
    voice: config.riaVoice,
    ...(config.xaiRealtimeModel ? { model: config.xaiRealtimeModel } : {}),
  };
}

export function createRianVoiceAgent(config: ReturnType<typeof getRianAgentConfig>) {
  return new voice.Agent({
    id: config.agentName,
    instructions: buildRianAgentInstructions(config),
  });
}

function createRealtimeModel(config: ReturnType<typeof getRianAgentConfig>) {
  return new xai.realtime.RealtimeModel(createRealtimeModelOptions(config));
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const config = getRianAgentConfig();
    const session = new voice.AgentSession({
      llm: createRealtimeModel(config),
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
