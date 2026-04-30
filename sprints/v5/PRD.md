# Sprint v5 - PRD: Usable Live Conversation Surface

## Sprint Overview

Sprint v5 turns the existing LiveKit engineering panel into a usable live conversation surface. The goal is for the builder to understand exactly how to join a room, start the Rian worker, enable the microphone, and begin a real voice conversation without needing to remember terminal details.

This sprint focuses on user-facing clarity and the first practical live-call controls. It does not add persistence, post-call critique, advanced Ria/Ian switching, or a production deployment flow.

## Goals

- The main UI clearly explains how to start a live Rian conversation.
- The room panel shows the exact `npm run agent:connect` command for the selected room.
- Browser microphone controls are visible inside the connected LiveKit room.
- The UI distinguishes live voice mode from the older local mock practice mode.
- Tests cover command generation and room readiness copy so docs and UI stay aligned.

## User Stories

- As the builder, I want the app to show me the exact worker command, so I can start the live agent without guessing.
- As a user practicing conversation, I want obvious mic controls, so I know when I can speak.
- As a developer, I want the UI to keep mock practice separate from live voice, so I can debug each path cleanly.
- As a developer, I want deterministic tests for live-room helper copy, so future room-name changes do not silently break the workflow.

## Technical Architecture

- **Frontend**: Existing Next.js voice room.
- **Live room UI**: `LiveKitConnectPanel` upgraded with live mode instructions and LiveKit `ControlBar`.
- **Helper logic**: `src/lib/livekit/live-conversation.ts` for command generation and connection guidance.
- **Tests**: Vitest tests for command/copy helpers.
- **Worker**: Existing v4 `rian-agent` LiveKit worker.

```text
┌──────────────────────────────────────────────────────────────┐
│ VoiceRoom                                                    │
│ ├─ LiveKitConnectPanel                                       │
│ │  ├─ Room + participant inputs                              │
│ │  ├─ exact worker command                                   │
│ │  ├─ Connect / Disconnect                                   │
│ │  └─ LiveKit ControlBar + RoomAudioRenderer                 │
│ ├─ PersonaCards                                              │
│ └─ Mock practice panel                                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
                     LiveKit room + rian-agent
```

## Out of Scope

- Post-call critique report.
- Supabase session/audio/transcript persistence.
- Dynamic live Ria/Ian model switching.
- Developer dashboard trace storage.
- Production worker deployment.
- Automated browser E2E with real provider audio.

## Dependencies

- Sprint v3 LiveKit browser room scaffold.
- Sprint v4 LiveKit xAI realtime worker.
- `.env.local` with working LiveKit and xAI keys.
