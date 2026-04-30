# Sprint v6 - Walkthrough

## Summary

Sprint v6 added the first browser-side debug surface for live LiveKit/xAI conversations. After joining a room, the UI now shows participant count, whether `rian-agent` is present, recent LiveKit room events, and any transcription streams exposed by LiveKit components.

This is intentionally ephemeral debug visibility, not durable observability. No Supabase persistence, post-call critique, or live Ria/Ian switching was added.

## Architecture Overview

```text
LiveKitConnectPanel
  └─ LiveKitRoom
     ├─ RoomAudioRenderer
     ├─ ControlBar
     └─ LiveConversationDebug
        ├─ useParticipants()
        ├─ useTranscriptions()
        ├─ useRoomContext()
        └─ RoomEvent listeners
```

## Files Created/Modified

### `src/lib/livekit/live-debug.ts`

**Purpose**: Formats live room debug data for UI display.

**Key Functions**:
- `hasRianAgentParticipant()` - detects whether `rian-agent` joined.
- `summarizeParticipants()` - returns count, identities, and agent presence.
- `formatLiveDebugEvent()` - converts event keys into readable messages.
- `formatTranscription()` - normalizes transcription stream text.

**How it works**:

The helpers stay pure so they are easy to test and can later feed a real developer dashboard. For now they power the browser debug panel only.

### `src/lib/livekit/live-debug.test.ts`

**Purpose**: Tests live debug formatting behavior.

**Key Tests**:
- detects `rian-agent`
- summarizes participant identities
- labels known and unknown room events
- trims transcription text

**How it works**:

The tests do not connect to LiveKit. They make sure the display logic is deterministic before room events are attached.

### `src/components/live-conversation-debug.tsx`

**Purpose**: Renders live room diagnostics inside `LiveKitRoom`.

**Key Components/Hooks**:
- `useRoomContext()` - accesses the active LiveKit room.
- `useParticipants()` - reads local and remote participants.
- `useTranscriptions()` - reads LiveKit transcription text streams.
- `RoomEvent` listeners - append connection, participant, and track events.

**How it works**:

The component subscribes to room events and keeps the latest eight events in local React state. It also summarizes participants on every participant update, so `rian-agent joined` appears when the worker is present.

```tsx
const participantSummary = summarizeParticipants(
  participants.map((participant) => ({
    identity: participant.identity,
  })),
);
```

If LiveKit publishes transcription streams, the component shows the latest six non-empty rows. If none arrive, the UI says `No LiveKit transcription stream yet`.

### `src/components/livekit-connect-panel.tsx`

**Purpose**: Mounts the debug panel inside the connected LiveKit room.

**Key Change**:
- Adds `<LiveConversationDebug />` below the LiveKit mic controls.

**How it works**:

The debug panel only renders after the browser has a token and `LiveKitRoom` exists. That keeps LiveKit hooks inside the correct provider context.

### `src/app/globals.css`

**Purpose**: Styles the live debug panel.

**Key Classes**:
- `.live-debug-panel`
- `.live-debug-grid`
- `.debug-card`
- `.debug-columns`
- `.debug-event-list`

**How it works**:

The debug UI uses compact cards and two columns so it remains readable below the call controls without overwhelming the primary live conversation flow.

### `README.md`

**Purpose**: Documents how to use the live debug panel while testing.

**Key Section**:
- `Use The Live Debug Panel`

**How it works**:

The README explains what should change when the worker joins and clarifies that missing transcript rows do not necessarily mean audio failed.

### `sprints/v6/PRD.md`

**Purpose**: Defines the v6 observability sprint.

**How it works**:

The PRD keeps this sprint focused on browser-side live debugging and explicitly defers durable trace storage, post-call critique, and persona routing.

### `sprints/v6/TASKS.md`

**Purpose**: Tracks v6 implementation and verification notes.

**How it works**:

The task list records helper tests, the debug component, README updates, and this walkthrough.

## Data Flow

1. Browser joins a LiveKit room through `LiveKitConnectPanel`.
2. `LiveKitRoom` provides room context.
3. `LiveConversationDebug` reads participants and transcriptions from LiveKit hooks.
4. Room event listeners append recent connection, participant, and track events.
5. The debug panel shows agent presence, connection state, event history, and transcript rows if available.

## Test Coverage

- Unit: 6 tests in `src/lib/livekit/live-debug.test.ts`.
- Existing live conversation helper tests still cover worker command generation.
- Full suite after v6: 49 passing tests.
- Typecheck and production build pass.
- Semgrep passes.

No E2E test confirms browser mic/audio playback yet. That remains a manual test because it depends on LiveKit/xAI credentials and audio device permissions.

## Security Measures

- Debug events are local UI state only and are not persisted.
- No provider secrets are exposed.
- No hidden memory, transcript storage, or audio storage was added.
- Transcriptions, if shown, are displayed only in the active browser session.

## Known Limitations

- Worker internals are not streamed back from the Node agent yet.
- Debug events disappear on refresh.
- Transcription visibility depends on LiveKit/xAI stream publication behavior.
- There is no latency waterfall yet.
- Ria/Ian live routing remains unchanged.

## What's Next

Sprint v7 should add live persona routing and trace events from the worker. The worker should detect explicit phrases like "Ria, take this" or "Ian, sharpen this", keep one active speaker, and emit a visible router reason so the debug panel can show why Rian behaved a certain way.
