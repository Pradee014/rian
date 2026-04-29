# Sprint v4 - PRD: xAI Realtime Agent Worker

## Sprint Overview

Sprint v4 adds a local LiveKit Agent worker scaffold that can join the room created by the browser and use xAI's realtime voice model through the LiveKit xAI plugin. The sprint keeps the realtime model selection optional so the plugin can use its default model, while Ria/Ian voice choices and Rian-specific instructions come from project config.

This sprint focuses on a runnable worker and agent configuration. It does not yet implement dynamic Ria/Ian handoff, persistent transcripts, Supabase storage, or post-call critique.

## Goals

- Developer can run a separate Rian LiveKit Agent worker from this repo.
- Worker loads `.env.local`, connects to LiveKit, and uses the xAI realtime plugin.
- Agent prompt reflects Rian's private communication gym, one-active-speaker, and non-sycophantic coaching rules.
- xAI realtime model is optional/blank by default; voice config remains explicit for Ria/Ian.
- Tests cover agent config and instruction generation without calling LiveKit or xAI.

## User Stories

- As the builder, I want a local agent worker, so that the browser room can eventually receive realtime AI audio.
- As a user practicing conversation, I want the first live agent to sound like Rian, not a generic assistant.
- As a developer, I want config tests, so that missing env or accidental model hardcoding does not break the provider strategy.
- As a developer, I want mock mode to remain available, so that frontend development does not require a running agent.

## Technical Architecture

- **Frontend**: existing Next.js app and LiveKit connection panel.
- **Worker runtime**: Node.js LiveKit Agents SDK.
- **Realtime model**: `@livekit/agents-plugin-xai` `RealtimeModel`.
- **Config**: `.env.local` loaded by `dotenv`.
- **Prompting**: Rian-specific instructions generated from local config.
- **Tests**: Vitest tests for env parsing, voice defaults, optional model behavior, and instructions.

```text
┌─────────────────────────┐        ┌──────────────────────────┐
│ Browser VoiceRoom       │        │ Rian Agent Worker         │
│ ├─ LiveKitRoom          │        │ ├─ defineAgent            │
│ └─ mock fallback        │        │ ├─ AgentSession           │
└───────────┬─────────────┘        │ └─ xAI RealtimeModel      │
            │                      └───────────┬──────────────┘
            └──────────▶ LiveKit Room ◀────────┘
```

## Out of Scope

- Dynamic Ria/Ian switching inside the live agent.
- Separate simultaneous persona agents.
- Supabase persistence.
- Post-call critique report.
- Barge-in tuning beyond xAI/LiveKit default turn detection.
- Production deployment to LiveKit Cloud.

## Dependencies

- Sprint v3 LiveKit token and browser room connection.
- `.env.local` with LiveKit keys and `XAI_API_KEY`.
- Official LiveKit Agents Node.js SDK and xAI plugin.
