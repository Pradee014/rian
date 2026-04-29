# Sprint v2 - Walkthrough

## Summary

Sprint v2 moved Rian from a text-only mock room toward a real browser voice room. The app now has microphone recording controls, browser `MediaRecorder` capture, local audio preview, explicit recorder state, and a recorded-turn path that flows through mock STT, persona routing, mock LLM, mock TTS, transcript, and traces.

The sprint still avoids LiveKit, cloud STT, real TTS playback, Supabase storage, and post-call critique generation. Audio is captured only in the browser and represented by a local object URL for preview.

## Architecture Overview

```text
┌───────────────────────────────────────────────────────────────┐
│ Browser                                                       │
│                                                               │
│ VoiceRoom                                                     │
│ ├─ SessionControls                                            │
│ ├─ PersonaCards                                               │
│ ├─ RecordingControls ──▶ createBrowserRecorder                │
│ │                      └─ getUserMedia + MediaRecorder        │
│ ├─ AudioPreview        local Blob object URL                  │
│ ├─ TranscriptPanel                                           │
│ └─ TracePreview                                              │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ Recorded Turn Pipeline                                        │
│ audio blob -> mock STT -> routePersona -> mock LLM -> mock TTS │
│            -> transcript turns -> trace events                 │
└───────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### `src/lib/voice/recorder.ts`

**Purpose**: Defines recorder state, audio preview metadata, and reducer transitions.

**Key Functions/Components**:

- `RecorderStatus` - idle, requesting permission, recording, recorded, or error.
- `MicPermission` - unknown, granted, denied, or unsupported.
- `AudioPreview` - local audio id, object URL, MIME type, size, and optional duration.
- `recorderReducer()` - deterministic state transition function.

**How it works**:

The reducer keeps microphone state independent from browser APIs. That makes recording UI predictable and testable even though `MediaRecorder` itself is not easy to run in unit tests.

```ts
case "recording_stopped":
  return {
    ...state,
    status: "recorded",
    permission: "granted",
    audio: action.audio,
    error: undefined,
  };
```

The reducer captures the states the UI needs: permission request, active recording, recorded audio, unsupported browser, and permission errors.

### `src/lib/voice/recorder.test.ts`

**Purpose**: Tests recorder state transitions.

**Key Tests**:

- idle to requesting permission
- permission granted
- unsupported browser
- recording started
- recording stopped with audio metadata
- permission denial

**How it works**:

The tests exercise the pure reducer rather than the real browser mic. This keeps v2 deterministic while still covering the state logic the UI depends on.

### `src/lib/voice/browser-recorder.ts`

**Purpose**: Wraps browser microphone capture and `MediaRecorder`.

**Key Functions/Components**:

- `createBrowserRecorder()` - returns `start`, `stop`, and `cancel` methods.
- `assertRecordingSupport()` - checks `getUserMedia` and `MediaRecorder`.
- `stopStream()` - stops mic tracks when recording ends or is canceled.

**How it works**:

`start()` asks for microphone access, creates a `MediaRecorder`, and collects audio chunks from `dataavailable` events. `stop()` resolves after the recorder emits `stop`, creates a `Blob`, converts it into an object URL, and returns preview metadata.

```ts
const blob = new Blob(chunks, { type: mimeType });
const url = URL.createObjectURL(blob);
stopStream(stream);

resolve({
  blob,
  preview: {
    id: `audio-${Date.now()}`,
    url,
    mimeType,
    size: blob.size,
    durationMs: Math.max(0, Date.now() - startedAt),
  },
});
```

The helper is intentionally local. It does not upload audio, create LiveKit rooms, or call real STT.

### `src/components/recording-controls.tsx`

**Purpose**: Renders record/stop controls and microphone status text.

**Key Functions/Components**:

- `RecordingControls` - shows recorder state and invokes start/stop callbacks.

**How it works**:

The component disables recording outside an active session and disables Stop unless a recording is active. It also exposes `data-testid` selectors for future browser tests.

### `src/components/audio-preview.tsx`

**Purpose**: Displays the most recent local audio recording.

**Key Functions/Components**:

- `AudioPreview` - renders size, duration, and an HTML audio control.

**How it works**:

The component receives `AudioPreview` metadata from recorder state. It renders only after a recording exists, using the local object URL produced by `createBrowserRecorder()`.

### `src/components/voice-room.tsx`

**Purpose**: Coordinates session state, recording state, and the mock conversation pipeline.

**Key Functions/Components**:

- `handleStartRecording()` - requests mic access and starts browser recording.
- `handleStopRecording()` - stops recording, stores preview metadata, runs mock STT, and completes a practice turn.
- `completePracticeTurn()` - shared path for typed and recorded turns.
- `handleEnd()` - cancels active recording before ending the session.

**How it works**:

The component now uses `useReducer` for recorder state and `useRef` to hold the active browser recorder. When recording stops, the app records audio metadata as a trace, calls mock STT with the local audio id, then sends the transcript through the same router/LLM/TTS path as text input.

```tsx
const transcript = await mockStt.transcribe({ audioId: recording.preview.id });
next = appendTrace(next, transcript.trace.type, transcript.trace.message, transcript.trace.metadata);

await completePracticeTurn(next, transcript.data.text);
```

This keeps the recorded voice path aligned with the existing v1 transcript and trace model.

### `src/components/session-controls.tsx`

**Purpose**: Provides session lifecycle controls and practice mode selection.

**Key Functions/Components**:

- `SessionControls` - start/end session, choose Casual or Intro mode, show elapsed time.

**How it works**:

This file was not structurally changed in v2, but its controls now gate the recording experience. Recording is disabled until a session is active.

### `src/components/persona-cards.tsx`

**Purpose**: Shows Ria and Ian with active speaker state.

**Key Functions/Components**:

- `PersonaCards` - renders the two coaches from `PERSONAS`.

**How it works**:

The active persona changes after either typed or recorded turns. The cards remain the visible signal that only one persona is currently speaking.

### `src/components/transcript-panel.tsx`

**Purpose**: Shows transcript turns from typed and recorded practice input.

**Key Functions/Components**:

- `TranscriptPanel`
- `labelForTurn()`

**How it works**:

Recorded audio becomes transcript text through mock STT, then appears exactly like a typed user turn. This is intentional: real STT should later write into the same transcript shape.

### `src/components/trace-preview.tsx`

**Purpose**: Shows recent trace events.

**Key Functions/Components**:

- `TracePreview`

**How it works**:

V2 adds audio recording start/stop traces and STT traces. The trace preview now shows a clearer early version of the future developer dashboard.

### `src/lib/rian/types.ts`

**Purpose**: Extends trace event types for audio recording.

**Key Functions/Components**:

- `audio_recording_started`
- `audio_recording_stopped`

**How it works**:

These event types let the session trace distinguish local audio capture from provider calls and routing decisions.

### `src/lib/providers/mock-stt.ts`

**Purpose**: Converts a local audio id into mock transcript text.

**Key Functions/Components**:

- `mockStt.transcribe()`

**How it works**:

The recorded path calls mock STT after a browser recording stops. The returned text is then treated as the user's transcript turn, preserving the future STT contract without real transcription.

### `src/app/globals.css`

**Purpose**: Adds recording and audio preview styling.

**Key Functions/Components**:

- `.recording-panel`
- `.recording-actions`
- `.recorder-status`
- `.audio-preview`

**How it works**:

The new CSS keeps recording controls visually aligned with the rest of the room. On small screens, recording and audio preview rows collapse vertically to avoid cramped controls.

### `README.md`

**Purpose**: Documents the new browser mic behavior and remaining limits.

**Key Sections**:

- Sprint v2 browser mic capture notes.
- Local audio preview behavior.
- Continued provider and storage limitations.

**How it works**:

The README now tells future developers that microphone capture exists locally, but no audio leaves the browser and no durable storage exists yet.

### `sprints/v2/PRD.md`

**Purpose**: Defines the v2 sprint scope.

**Key Sections**:

- Sprint Overview
- Goals
- User Stories
- Technical Architecture
- Out of Scope
- Dependencies

**How it works**:

The PRD keeps v2 focused on local browser mic capture. It deliberately avoids LiveKit and cloud provider work so the app can prove the browser-side recording model first.

### `sprints/v2/TASKS.md`

**Purpose**: Tracks v2 task execution.

**Key Functions/Components**:

- Six v2 tasks.
- Completion notes for recorder, recording UI, mock flow, docs, and walkthrough.

**How it works**:

This file records that v2 added state, browser recorder support, UI, mock pipeline wiring, docs, and this walkthrough.

## Data Flow

1. User opens `/` and starts a session.
2. User clicks `Record`.
3. `handleStartRecording()` creates a browser recorder and calls `getUserMedia`.
4. `MediaRecorder` collects audio chunks.
5. User clicks `Stop`.
6. `createBrowserRecorder().stop()` creates a local audio `Blob` and object URL.
7. Recorder state stores the audio preview metadata.
8. `VoiceRoom` records `audio_recording_stopped` trace metadata.
9. `mockStt.transcribe()` returns mock transcript text for the local audio id.
10. `routePersona()` selects Ria or Ian.
11. `mockLlm.respond()` creates a mock persona response.
12. `mockTts.synthesize()` records where future audio synthesis will happen.
13. Transcript and trace preview update in the UI.

## Test Coverage

- Unit: 17 tests - router behavior, session lifecycle, and recorder reducer transitions.
- Integration: 0 tests - browser mic capture is not covered by automated browser tests yet.
- E2E: 0 tests - Playwright is still deferred until the recording flow stabilizes with real provider boundaries.

## Security Measures

- Audio stays local to the browser in v2.
- No audio is uploaded or persisted.
- No hidden memory is implemented.
- Mic permission errors are surfaced instead of silently failing.
- Recording tracks are stopped when recording ends or the session is ended.
- `npm audit` reports zero vulnerabilities.
- Semgrep completed with no findings against `src/`.

## Known Limitations

- Recording requires a browser with `navigator.mediaDevices.getUserMedia` and `MediaRecorder`.
- There is no LiveKit room or streaming audio transport yet.
- Mock STT does not transcribe real speech content.
- Audio object URLs are local preview artifacts, not durable stored audio.
- There is no interruption or barge-in behavior.
- There is still no post-call critique report.
- No automated browser E2E test currently validates microphone behavior.

## What's Next

Sprint v3 should connect the voice runtime boundary to a real room model. The most useful next step is LiveKit room scaffolding with clear trace events for room creation, participant state, mic lifecycle, and future agent handoff.

After that, Rian should add one real STT provider behind the existing STT adapter while keeping transcript shape, trace metadata, and one-speaker routing unchanged.
