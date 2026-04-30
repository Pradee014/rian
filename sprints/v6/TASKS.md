# Sprint v6 - Tasks
## Status: Planned

- [x] Task 1: Add live debug helper tests (P0)
  - Acceptance: Tests cover `rian-agent` detection, participant summaries, room event labeling, and transcription formatting.
  - Files: `src/lib/livekit/live-debug.ts`, `src/lib/livekit/live-debug.test.ts`
  - Completed: 2026-04-29 - Added helper functions and Vitest coverage for agent detection, participant summaries, event labels, and transcription formatting.

- [x] Task 2: Add LiveKit room debug component (P0)
  - Acceptance: Connected rooms render participant status, agent presence, recent room events, and available transcription streams.
  - Files: `src/components/live-conversation-debug.tsx`, `src/components/livekit-connect-panel.tsx`, `src/app/globals.css`
  - Completed: 2026-04-29 - Added a connected-room debug panel using LiveKit participant/transcription hooks and room event listeners for connection, participant, and track subscription events.

- [x] Task 3: Update README for live debug testing (P1)
  - Acceptance: README explains what the live debug panel shows and how to use it while testing the worker.
  - Files: `README.md`
  - Completed: 2026-04-29 - Documented participant/agent status, connection events, audio track events, transcript stream expectations, and how to interpret missing transcript rows during audio tests.

- [x] Task 4: Generate Sprint v6 walkthrough (P2)
  - Acceptance: `sprints/v6/WALKTHROUGH.md` explains the debug surface, event flow, tests, limitations, and next persistence/persona-routing priorities.
  - Files: `sprints/v6/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Added a self-contained walkthrough for the live debug component, helper logic, event/transcription data flow, tests, security posture, limitations, and v7 routing priorities.
