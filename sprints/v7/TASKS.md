# Sprint v7 - Tasks
## Status: Planned

- [x] Task 1: Add live persona routing tests (P0)
  - Acceptance: Tests cover explicit Ria/Ian routing phrases, default fallback behavior, and one-persona decisions.
  - Files: `src/agent/persona-routing.ts`, `src/agent/persona-routing.test.ts`
  - Completed: 2026-04-29 - Added deterministic live persona routing for explicit Ria/Ian and only-Ria/only-Ian phrases, with fallback to the current persona and tests ensuring one-persona decisions.

- [x] Task 2: Add persona-specific worker agents (P0)
  - Acceptance: Worker can create Ria and Ian agent profiles, uses persona-specific xAI voice options, and handoff logic updates the active agent before reply generation.
  - Files: `src/agent/agent.ts`, `src/agent/agent.test.ts`, `src/agent/instructions.ts`, `src/agent/config.test.ts`
  - Completed: 2026-04-29 - Added `RianPersonaAgent`, Ria/Ian-specific instructions and xAI voice options, and `onUserTurnCompleted` handoff logic that switches the active agent for explicit persona requests before generation.

- [x] Task 3: Update docs for live persona routing (P1)
  - Acceptance: README explains supported live routing phrases, current one-speaker behavior, and limitations.
  - Files: `README.md`
  - Completed: 2026-04-29 - Documented live Ria/Ian routing phrases, one-active-speaker behavior, persona-specific voices, and the remaining limitation that routing reason is not yet browser-visible.

- [x] Task 4: Generate Sprint v7 walkthrough (P2)
  - Acceptance: `sprints/v7/WALKTHROUGH.md` explains live persona routing, files changed, tests, limitations, and next trace/persistence priorities.
  - Files: `sprints/v7/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Added a self-contained walkthrough covering explicit live Ria/Ian routing, persona-specific worker agents, xAI voice selection, tests, limitations, and v8 trace priorities.
