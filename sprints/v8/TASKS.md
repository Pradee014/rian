# Sprint v8 - Tasks
## Status: Planned

- [x] Task 1: Add worker trace encoding tests (P0)
  - Acceptance: Tests cover trace encoding/decoding, routing payload shape, and invalid payload rejection.
  - Files: `src/lib/livekit/worker-trace.ts`, `src/lib/livekit/worker-trace.test.ts`
  - Completed: 2026-04-29 - Added `rian.trace` wire-format helpers with tests for round trips, trace topic, invalid JSON, unknown trace types, and invalid persona ids.

- [x] Task 2: Publish routing traces from the live worker (P0)
  - Acceptance: Worker publishes initial persona and handoff routing events with persona, reason, and voice on the `rian.trace` topic.
  - Files: `src/agent/agent.ts`, `src/agent/agent.test.ts`
  - Completed: 2026-04-29 - Worker now publishes `worker_started` and `persona_route` events with selected persona, reason, voice, and timestamp over the reliable LiveKit `rian.trace` data topic.

- [x] Task 3: Render worker traces in the live debug panel (P0)
  - Acceptance: Browser debug panel subscribes to `rian.trace` and shows recent worker routing events.
  - Files: `src/components/live-conversation-debug.tsx`, `src/app/globals.css`
  - Completed: 2026-04-29 - Debug panel now subscribes to `rian.trace`, decodes worker trace payloads, and renders a Worker routing column with selected persona, reason, voice, and timestamp.

- [x] Task 4: Update docs for browser-visible routing traces (P1)
  - Acceptance: README explains the worker trace section and current ephemeral-only limitation.
  - Files: `README.md`
  - Completed: 2026-04-29 - Documented the `rian.trace` data topic, Worker routing panel fields, and the current limitation that routing traces are ephemeral browser state.

- [x] Task 5: Generate Sprint v8 walkthrough (P2)
  - Acceptance: `sprints/v8/WALKTHROUGH.md` explains routing trace publishing, UI rendering, tests, limitations, and next persistence priorities.
  - Files: `sprints/v8/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Added a self-contained walkthrough covering worker trace publishing, data-channel decoding, debug-panel rendering, tests, security posture, limitations, and v9 persistence priorities.
