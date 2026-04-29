# Sprint v4 - Tasks
## Status: Planned

- [x] Task 1: Install LiveKit Agents and xAI worker dependencies (P0)
  - Acceptance: Agent runtime packages and TypeScript runner are installed, scripts exist for running the agent, and existing app tests/build still pass.
  - Files: `package.json`, `package-lock.json`
  - Completed: 2026-04-29 - Installed `@livekit/agents`, `@livekit/agents-plugin-xai`, `dotenv`, and `tsx`; added agent scripts; verified tests/build. `npm audit` reports a no-fix moderate `uuid` advisory through LiveKit Agents.

- [x] Task 2: Add Rian agent config and instruction tests (P0)
  - Acceptance: Config helpers read LiveKit/xAI env, keep realtime model optional, expose Ria/Ian voices, and tests verify the generated instructions mention Rian's core rules.
  - Files: `src/agent/config.ts`, `src/agent/instructions.ts`, `src/agent/config.test.ts`
  - Completed: 2026-04-29 - Added env parsing, Ria/Ian voice defaults, optional xAI model handling, and instruction tests for Rian's one-speaker, privacy, and non-sycophancy rules. Focused tests/typecheck/Semgrep pass; `npm audit` still reports the no-fix LiveKit `uuid` advisory from Task 1.

- [x] Task 3: Create LiveKit xAI realtime agent worker (P0)
  - Acceptance: Worker defines a LiveKit agent named `rian-agent`, creates an `AgentSession` with xAI `RealtimeModel`, loads `.env.local`, and generates an opening reply.
  - Files: `src/agent/agent.ts`, `src/agent/index.ts`
  - Completed: 2026-04-29 - Added the LiveKit `defineAgent` worker, xAI realtime model wiring, `.env.local` loading, opening reply instructions, and no-network worker helper tests. CLI help smoke test, all tests, build, typecheck, and Semgrep pass; `npm audit` still reports the no-fix LiveKit `uuid` advisory.

- [x] Task 4: Update README with worker run instructions (P1)
  - Acceptance: README explains how to run the Next app and the agent worker together, required env vars, and current limitations.
  - Files: `README.md`
  - Completed: 2026-04-29 - Documented the two-process app/worker workflow, `agent:dev`, `agent:connect`, `agent:start`, required LiveKit/xAI env vars, `.env.local` loading, worker limitations, and the known LiveKit dependency audit caveat. Typecheck and agent-focused tests pass.

- [x] Task 5: Generate Sprint v4 walkthrough (P2)
  - Acceptance: `sprints/v4/WALKTHROUGH.md` explains the agent worker architecture, files changed, tests, security, limitations, and next persona-routing priorities.
  - Files: `sprints/v4/WALKTHROUGH.md`
  - Completed: 2026-04-29 - Added a self-contained walkthrough covering the v4 worker architecture, changed files, data flow, test coverage, security posture, limitations, and v5 routing/trace priorities.
