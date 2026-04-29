# Sprint v3 - PRD: LiveKit Room Scaffold

## Sprint Overview

Sprint v3 connects Rian's browser voice room to a real LiveKit room scaffold while keeping xAI realtime model selection optional so the LiveKit xAI plugin can use its default. The sprint adds a secure local token endpoint, LiveKit connection UI, environment validation, and agent configuration notes for the future xAI realtime worker.

This sprint does not try to fully run the server-side xAI voice agent yet. It creates the verified room connection foundation that a LiveKit Agent can join in the next slice.

## Goals

- User can connect the browser app to a LiveKit room using keys from `.env.local`.
- Server-side LiveKit API key and secret stay private behind a Next.js token endpoint.
- The UI clearly separates local mock recording mode from LiveKit room connection state.
- Environment config makes xAI realtime model optional and preserves voice choices for Ria/Ian.
- Tests verify token request validation and environment handling where practical.

## User Stories

- As the builder, I want the browser to join a real LiveKit room, so that Rian can move from local recording to realtime voice transport.
- As a developer, I want token generation behind an API route, so that LiveKit secrets are never exposed to the browser.
- As a developer, I want xAI model configuration to be optional, so that the LiveKit xAI plugin can use its current default model.
- As a developer, I want a clean distinction between mock mode and LiveKit mode, so that development remains possible without all provider services running.

## Technical Architecture

- **Frontend**: existing Next.js App Router app.
- **LiveKit frontend**: `livekit-client` and `@livekit/components-react` for browser room connection.
- **LiveKit backend**: `livekit-server-sdk` for local token generation in `app/api/livekit-token/route.ts`.
- **xAI realtime**: env placeholders and agent config notes for `@livekit/agents-plugin-xai`; implementation deferred until the worker is introduced.
- **State**: React state for mock session plus LiveKit connection readiness.
- **Tests**: unit tests for token request parsing and env validation helpers.

```text
┌───────────────────────────────────────────────────────────────┐
│ Browser                                                       │
│  VoiceRoom                                                    │
│  ├─ Mock local practice controls                              │
│  └─ LiveKitConnectPanel ──▶ POST /api/livekit-token           │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ Next.js API Route                                             │
│  LIVEKIT_API_KEY + LIVEKIT_API_SECRET -> participant token    │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ LiveKit Room                                                  │
│  Browser participant now; xAI realtime agent joins later      │
└───────────────────────────────────────────────────────────────┘
```

## Out of Scope

- Running the LiveKit Agent worker.
- Full xAI realtime speech-to-speech agent implementation.
- Real persona handoff between Ria and Ian inside the agent.
- Supabase persistence for sessions, audio, transcripts, or traces.
- Post-call critique generation.
- Production authentication for token endpoint.

## Dependencies

- `.env.local` with `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and `NEXT_PUBLIC_LIVEKIT_URL`.
- `.env.local` with `XAI_API_KEY` for the next agent sprint, though v3 token scaffolding can build without using it.
- Sprint v1/v2 app, session, trace, and mock UI foundation.
- Official LiveKit docs for token endpoint and Next.js frontend SDK setup.
