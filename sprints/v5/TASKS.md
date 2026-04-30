# Sprint v5 - Tasks
## Status: Planned

- [x] Task 1: Add live conversation helper tests (P0)
  - Acceptance: Tests cover the room-specific worker command and readiness guidance for idle, connecting, connected, and error states.
  - Files: `src/lib/livekit/live-conversation.ts`, `src/lib/livekit/live-conversation.test.ts`
  - Completed: 2026-04-29 - Added command/guidance helpers and Vitest coverage for default room handling, shell-safe command generation, and status-specific live conversation guidance.

- [x] Task 2: Upgrade LiveKit UI into a live conversation panel (P0)
  - Acceptance: Panel shows live-mode instructions, exact worker command, connected-room status, LiveKit mic controls, and clear mock-mode separation.
  - Files: `src/components/livekit-connect-panel.tsx`, `src/app/globals.css`
  - Completed: 2026-04-29 - Reworked the LiveKit panel into a live conversation guide with status-specific guidance, exact room worker command, three-step call flow, renamed join/leave actions, LiveKit `ControlBar` mic controls, and styling for command/status/call controls.

- [x] Task 3: Update docs for the v5 live conversation flow (P1)
  - Acceptance: README explains how to run the app, join the room, start the worker, use mic controls, and understand current limitations.
  - Files: `README.md`
  - Completed: 2026-04-29 - Updated README with the browser-led live conversation flow, room-specific worker command, LiveKit mic control instructions, development worker command, and current transcript/persistence limitations.

- [x] Task 4: Generate Sprint v5 walkthrough (P2)
  - Acceptance: `sprints/v5/WALKTHROUGH.md` explains the live conversation UI, helper logic, tests, limitations, and next persistence/routing priorities.
  - Files: `sprints/v5/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Added a self-contained walkthrough covering the v5 UI changes, helper/test logic, live conversation data flow, security posture, limitations, and v6 recommendations.
