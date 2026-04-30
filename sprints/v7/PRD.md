# Sprint v7 - PRD: Live Ria/Ian Persona Routing

## Sprint Overview

Sprint v7 makes Ria and Ian real in the live worker path instead of only being prompt concepts. The worker should start as Ria for casual conversation, detect explicit user routing phrases, and hand off to an Ian or Ria agent profile before generating the next realtime reply.

This sprint focuses on explicit persona routing and one active speaker. It does not implement multi-agent debate, persistent routing traces, post-call critique, or a full dashboard.

## Goals

- Live worker can create persona-specific Ria and Ian agent profiles.
- Ria uses the configured Ria xAI voice; Ian uses the configured Ian xAI voice.
- Explicit phrases like "Ria, take this" and "Ian, sharpen this" route the next response.
- One active persona speaks at a time.
- Tests cover routing detection, persona instructions, and persona-specific model options.

## User Stories

- As a user, I want to say "Ian, sharpen this", so I can get a direct strategic response.
- As a user, I want to say "Ria, make this natural", so I can get warmer conversational coaching.
- As a developer, I want routing tests, so live persona behavior stays deterministic.
- As a developer, I want persona-specific voice options, so future voice tuning does not require rewriting the worker.

## Technical Architecture

- **Worker**: `src/agent/agent.ts` defines persona agents that can hand off through `AgentSession.updateAgent()`.
- **Routing helper**: `src/agent/persona-routing.ts` detects explicit persona requests.
- **Instructions**: `src/agent/instructions.ts` generates persona-specific live instructions.
- **Realtime model**: xAI `RealtimeModel` is created with the selected persona voice.
- **Tests**: Vitest covers routing and worker construction seams without network calls.

```text
User speech transcript
  -> RianPersonaAgent.onUserTurnCompleted()
  -> chooseLivePersona()
  -> session.updateAgent(next persona agent)
  -> xAI realtime reply with selected persona instructions/voice
```

## Out of Scope

- Both Ria and Ian speaking in the same turn.
- Autonomous multi-agent debate.
- Persisted route traces.
- Browser-visible routing reason from the worker.
- Post-call critique.
- Supabase persistence.

## Dependencies

- Sprint v4 xAI realtime worker.
- Sprint v6 live debug surface.
- Valid `XAI_RIA_VOICE` and `XAI_IAN_VOICE` values in `.env.local`.
