# Sprint v2 - PRD: Browser Mic Capture

## Sprint Overview

Sprint v2 advances Rian from a text-only mock room to a browser microphone capture room. The sprint adds local recording support, audio preview, mic permission states, and a recorded-turn path that feeds the existing mock STT, router, mock LLM, mock TTS, transcript, and trace flow.

This sprint still avoids LiveKit, cloud STT, real TTS playback, Supabase persistence, and stored audio. The goal is to prove the local browser voice loop shape before introducing provider credentials and backend storage.

## Goals

- User can start a practice session and record a short browser microphone turn.
- User sees clear recording, permission, error, and audio-preview states.
- Recorded audio is represented as a local audio object URL and tracked in session state.
- A recorded turn can run through mock STT, persona routing, mock LLM, mock TTS, transcript, and traces.
- Tests cover browser recorder state transitions and keep existing routing/session behavior green.

## User Stories

- As a user practicing conversation, I want to record a spoken line, so that Rian starts feeling voice-first instead of text-first.
- As a user, I want to preview the recorded audio locally, so that I know what was captured before provider storage exists.
- As a developer, I want recording state and errors to be explicit, so that LiveKit and STT integration can attach cleanly later.
- As a developer, I want recorded turns to preserve transcript and trace behavior, so that the dashboard foundation keeps working.

## Technical Architecture

- **Frontend**: existing Next.js App Router app.
- **Recording**: browser `navigator.mediaDevices.getUserMedia` plus `MediaRecorder` behind a local recorder controller.
- **Audio storage**: in-memory `Blob` plus browser object URL for v2 preview only.
- **STT / LLM / TTS**: existing mock adapters.
- **State**: local React state for recorder status, audio preview, session transcript, active persona, and traces.
- **Tests**: Vitest tests for recorder reducer/controller logic, plus existing router/session tests.

```text
┌──────────────────────────────────────────────────────────────┐
│ Browser                                                      │
│                                                              │
│ VoiceRoom                                                    │
│ ├─ SessionControls                                           │
│ ├─ RecordingControls ──▶ getUserMedia ──▶ MediaRecorder      │
│ ├─ AudioPreview                                              │
│ ├─ TranscriptPanel                                           │
│ └─ TracePreview                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │ recorded blob + object URL
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Mock Conversation Pipeline                                   │
│ mock STT -> persona router -> mock LLM -> mock TTS -> traces │
└──────────────────────────────────────────────────────────────┘
```

Data flow:

```text
User clicks Record -> browser asks for mic -> MediaRecorder collects chunks
User stops recording -> local audio blob/object URL is created -> mock STT returns text
Router selects Ria/Ian -> mock LLM creates response -> transcript and trace preview update
```

## Out of Scope

- LiveKit room creation, server-side agents, or real-time audio transport.
- Cloud STT, LLM, or TTS provider calls.
- Supabase database/storage persistence for audio.
- Multi-speaker responses beyond the existing explicit-both routing rule.
- Barge-in/interruption handling.
- Post-call critique generation.
- Full developer dashboard.

## Dependencies

- Sprint v1 voice room, provider mocks, router, session state, and UI shell.
- Browser support for `navigator.mediaDevices` and `MediaRecorder`.
- Future sprints will need provider credentials and storage configuration, but v2 does not.
