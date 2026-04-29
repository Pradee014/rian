# Sprint v3 - Tasks
## Status: Planned

- [x] Task 1: Install LiveKit browser/server dependencies and update env example (P0)
  - Acceptance: LiveKit frontend/server packages are installed, `.env.example` reflects optional xAI realtime model selection, and existing tests/build still pass.
  - Files: `package.json`, `package-lock.json`, `.env.example`
  - Completed: 2026-04-29 - Installed LiveKit browser/server packages, left xAI realtime model optional for plugin defaults, and verified tests, typecheck, and build.

- [x] Task 2: Add LiveKit environment and token helpers with tests (P0)
  - Acceptance: Helpers validate required LiveKit env vars, parse token request input, and produce stable room/participant defaults in tests.
  - Files: `src/lib/livekit/config.ts`, `src/lib/livekit/token-request.ts`, `src/lib/livekit/token-request.test.ts`
  - Completed: 2026-04-29 - Added LiveKit env validation and safe token request parsing with tests for required env and input rejection.

- [x] Task 3: Create Next.js LiveKit token API route (P0)
  - Acceptance: `POST /api/livekit-token` returns a token when env and request are valid, rejects invalid input, and never exposes API secret to the client.
  - Files: `src/app/api/livekit-token/route.ts`
  - Completed: 2026-04-29 - Added a server-side token route that validates request input, signs room grants with LiveKit server credentials, and returns only token, URL, room, and participant data.

- [x] Task 4: Add LiveKit connection panel to the voice room UI (P0)
  - Acceptance: UI shows LiveKit readiness, room name, participant name, connect/disconnect controls, and keeps mock practice available as fallback.
  - Files: `src/components/livekit-connect-panel.tsx`, `src/components/voice-room.tsx`, `src/app/globals.css`
  - Completed: 2026-04-29 - Added a LiveKit connection panel that requests server tokens, connects with LiveKit React components, shows room state, and preserves mock practice fallback.

- [x] Task 5: Add xAI realtime agent scaffold notes (P1)
  - Acceptance: README documents LiveKit xAI default-model approach, required env vars, and the next worker integration path.
  - Files: `README.md`
  - Completed: 2026-04-29 - Updated README with LiveKit env setup, xAI realtime default-model guidance, and next agent-worker priorities.

- [x] Task 6: Generate Sprint v3 walkthrough (P2)
  - Acceptance: `sprints/v3/WALKTHROUGH.md` explains the LiveKit token architecture, changed files, tests, security limitations, and next agent-worker priorities.
  - Files: `sprints/v3/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Generated a v3 walkthrough covering LiveKit token architecture, UI flow, tests, security measures, limitations, and v4 agent-worker priorities.
