# Sprint v2 - Tasks
## Status: Planned

- [x] Task 1: Add recorder domain types and reducer tests (P0)
  - Acceptance: Recorder status, permission, audio preview, and error types exist; reducer tests cover idle, requesting, recording, recorded, and error transitions.
  - Files: `src/lib/voice/recorder.ts`, `src/lib/voice/recorder.test.ts`
  - Completed: 2026-04-29 - Added recorder state types and reducer tests for permission, recording, recorded audio, unsupported browser, and error states.

- [x] Task 2: Implement browser MediaRecorder helper (P0)
  - Acceptance: Helper can request mic access, start recording, stop recording, return an audio blob/object URL, and surface unsupported-browser or permission errors.
  - Files: `src/lib/voice/browser-recorder.ts`
  - Completed: 2026-04-29 - Added browser recorder helper with support checks, mic capture, MediaRecorder start/stop, object URL preview, duration metadata, and stream cleanup.

- [x] Task 3: Add recording controls and audio preview UI (P0)
  - Acceptance: Voice room shows record/stop controls during an active session, disabled states outside a session, mic status text, and local audio playback after recording.
  - Files: `src/components/recording-controls.tsx`, `src/components/audio-preview.tsx`, `src/components/voice-room.tsx`, `src/app/globals.css`
  - Completed: 2026-04-29 - Added recording controls, mic status text, local audio preview, responsive styles, and session-aware disabled states.

- [x] Task 4: Wire recorded audio through mock STT and conversation flow (P0)
  - Acceptance: Stopping a recording creates a user transcript turn from mock STT, routes to one active persona, appends mock assistant response, and records trace events for audio capture, STT, routing, LLM, and TTS.
  - Files: `src/components/voice-room.tsx`, `src/lib/providers/mock-stt.ts`, `src/lib/rian/session.ts`
  - Completed: 2026-04-29 - Connected recorded audio previews to mock STT, persona routing, mock LLM, mock TTS, transcript updates, and trace events.

- [x] Task 5: Update documentation for browser mic v2 (P1)
  - Acceptance: README explains browser mic behavior, current limitations, and next LiveKit/provider integration path.
  - Files: `README.md`
  - Completed: 2026-04-29 - Updated README with v2 local mic capture behavior, audio preview notes, and continued provider/storage limitations.

- [x] Task 6: Generate Sprint v2 walkthrough (P2)
  - Acceptance: `sprints/v2/WALKTHROUGH.md` explains the mic capture architecture, files changed, data flow, tests, limitations, and next sprint priorities.
  - Files: `sprints/v2/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Generated a self-contained v2 walkthrough covering recording architecture, data flow, tests, security, limitations, and v3 priorities.
