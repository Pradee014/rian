# Sprint v8 - PRD: Browser-Visible Worker Routing Traces

## Sprint Overview

Sprint v8 exposes live worker routing decisions in the browser debug panel. When the worker starts as Ria or hands off to Ian/Ria, it should publish a lightweight trace event over the LiveKit data channel so the UI can show selected persona, routing reason, and active voice.

This sprint adds ephemeral trace visibility only. It does not persist traces, create a full developer dashboard, or add post-call critique.

## Goals

- Worker publishes routing trace events on a dedicated LiveKit data topic.
- Browser debug panel subscribes to that topic and renders recent worker trace events.
- Trace payloads include selected persona, reason, and voice.
- Tests cover trace encoding, decoding, and invalid payload handling.
- Existing live voice and one-active-speaker behavior remain intact.

## User Stories

- As the builder, I want to see "Ian selected because..." in the browser, so I can verify live routing.
- As a developer, I want trace payload tests, so worker/browser trace format does not drift.
- As a user testing Rian, I want confidence that the persona I asked for actually became active.

## Technical Architecture

- **Worker**: publishes JSON trace events through `ctx.room.localParticipant.publishData()`.
- **Topic**: `rian.trace`.
- **Browser**: `LiveConversationDebug` subscribes via `useDataChannel("rian.trace")`.
- **Helpers**: `src/lib/livekit/worker-trace.ts` encodes/decodes trace messages.
- **Tests**: Vitest validates payload round trips and malformed payload rejection.

```text
RianPersonaAgent
  -> publishWorkerTrace()
  -> LiveKit data channel topic: rian.trace
  -> useDataChannel("rian.trace")
  -> Live debug panel
```

## Out of Scope

- Durable trace storage.
- Full latency waterfall.
- Supabase persistence.
- Post-call critique.
- Both personas speaking in one turn.

## Dependencies

- Sprint v7 live Ria/Ian routing.
- Sprint v6 live debug panel.
