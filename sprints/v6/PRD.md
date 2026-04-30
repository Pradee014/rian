# Sprint v6 - PRD: Live Debug Trace Surface

## Sprint Overview

Sprint v6 adds the first live observability surface for real LiveKit/xAI conversations. The goal is to see whether the browser is connected, whether `rian-agent` has joined, what room events happened, and whether LiveKit transcription streams are arriving.

This sprint focuses on browser-side debugging only. It does not persist traces, add Supabase storage, implement post-call critique, or change live persona routing.

## Goals

- Connected LiveKit rooms show participant count and `rian-agent` presence.
- The UI shows a live event timeline for browser join, participant join/leave, connection state, and audio tracks.
- The UI shows any transcription streams exposed by LiveKit components.
- Helper tests cover agent participant detection, event labeling, and transcript formatting.
- The live debug surface stays separate from local mock traces.

## User Stories

- As the builder, I want to know whether the worker actually joined, so I can debug live voice setup quickly.
- As a user testing Rian, I want to see whether the browser is connected and mic/audio events are happening.
- As a developer, I want a small event timeline, so I can diagnose silent failures before adding persistence or critique.
- As a developer, I want transcript streams displayed if available, so I can verify whether LiveKit/xAI is exposing text.

## Technical Architecture

- **Frontend**: `LiveKitConnectPanel` renders a child debug component inside `LiveKitRoom`.
- **Hooks**: LiveKit React hooks read participants and transcription text streams.
- **Events**: Room event listeners append local, ephemeral debug events.
- **Helpers**: `src/lib/livekit/live-debug.ts` formats participant/event/transcript data.
- **Tests**: Vitest covers pure helper behavior.

```text
LiveKitRoom
  ├─ RoomAudioRenderer
  ├─ ControlBar
  └─ LiveConversationDebug
     ├─ useParticipants()
     ├─ useTranscriptions()
     └─ room.on(RoomEvent.*)
```

## Out of Scope

- Durable trace storage.
- Supabase persistence.
- Post-call critique.
- Server-side worker trace export.
- Custom transcript ingestion API.
- Ria/Ian live switching.

## Dependencies

- Sprint v5 live conversation UI.
- Sprint v4 `rian-agent` worker.
- LiveKit React hooks from `@livekit/components-react`.
