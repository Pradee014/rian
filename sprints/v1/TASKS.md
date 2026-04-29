# Sprint v1 - Tasks
## Status: Planned

- [x] Task 1: Initialize the Next.js TypeScript app scaffold (P0)
  - Acceptance: `npm run dev` starts a Next.js app, the root route renders, and basic project scripts exist for dev, build, lint, and test.
  - Files: `.gitignore`, `package.json`, `package-lock.json`, `next.config.ts`, `next-env.d.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
  - Completed: 2026-04-29 - Created the Next.js TypeScript scaffold, added scripts, verified the root route, and cleared dependency/security checks.

- [x] Task 2: Define core Rian domain types and persona constants (P0)
  - Acceptance: Shared TypeScript types exist for personas, session status, transcript turns, trace events, and practice modes.
  - Files: `src/lib/rian/types.ts`, `src/lib/rian/personas.ts`
  - Completed: 2026-04-29 - Added shared Rian domain types and persona constants for Ria, Ian, sessions, transcript turns, traces, and provider metadata.

- [x] Task 3: Implement deterministic persona routing logic (P0)
  - Acceptance: Router defaults to Ria for casual conversation, Ian for self-introduction structure, honors explicit Ria/Ian routing phrases, and never returns both speakers unless both are explicitly allowed.
  - Files: `src/lib/rian/router.ts`, `src/lib/rian/router.test.ts`
  - Completed: 2026-04-29 - Added deterministic persona routing with tests for defaults, explicit routing, and one-speaker behavior.

- [x] Task 4: Create mock provider boundaries for voice, STT, LLM, and TTS (P0)
  - Acceptance: Provider interfaces and mock implementations compile, expose latency/trace metadata, and can be replaced later without changing UI components.
  - Files: `src/lib/providers/types.ts`, `src/lib/providers/mock-voice.ts`, `src/lib/providers/mock-stt.ts`, `src/lib/providers/mock-llm.ts`, `src/lib/providers/mock-tts.ts`
  - Completed: 2026-04-29 - Added provider interfaces and mock voice, STT, LLM, and TTS adapters with trace metadata.

- [x] Task 5: Build local session state helpers with tests (P0)
  - Acceptance: Session helpers can start a session, append transcript turns, record trace events, switch active persona, and end a session; tests cover the lifecycle.
  - Files: `src/lib/rian/session.ts`, `src/lib/rian/session.test.ts`
  - Completed: 2026-04-29 - Added immutable session helpers with tests for start, transcript turns, active persona changes, traces, and session end.

- [x] Task 6: Build the voice room page layout and controls (P0)
  - Acceptance: Root page shows Rian voice room, start/end controls, session status, elapsed time placeholder, Ria/Ian cards, active speaker indicator, transcript panel, and trace preview.
  - Files: `src/app/page.tsx`, `src/components/voice-room.tsx`, `src/components/session-controls.tsx`, `src/components/persona-cards.tsx`, `src/components/transcript-panel.tsx`, `src/components/trace-preview.tsx`
  - Completed: 2026-04-29 - Built the root voice room shell with session controls, mode selection, persona cards, transcript panel, and trace preview.

- [x] Task 7: Wire mock conversation flow into the UI (P1)
  - Acceptance: During an active session, a user can submit a mock utterance, the router selects one active persona, a mock response appears in the transcript, and a trace event records the routing reason.
  - Files: `src/components/voice-room.tsx`, `src/lib/providers/mock-llm.ts`, `src/lib/rian/session.ts`
  - Completed: 2026-04-29 - Wired text-based mock utterances through the router, mock LLM, mock TTS, transcript state, and trace events.

- [x] Task 8: Add first-pass Rian visual styling (P1)
  - Acceptance: The app feels like a focused private communication gym, works on mobile and desktop, and avoids generic chatbot/companion styling.
  - Files: `src/app/globals.css`, `src/components/voice-room.tsx`, component CSS updates if CSS modules are used
  - Completed: 2026-04-29 - Added responsive first-pass styling for the focused practice room, persona cards, controls, transcript, and trace surfaces.

- [x] Task 9: Document v1 setup and next-provider wiring notes (P2)
  - Acceptance: A short repo README explains how to run the app, what is mocked in v1, and where LiveKit/STT/LLM/TTS providers should be wired in later.
  - Files: `README.md`
  - Completed: 2026-04-29 - Added setup, verification, project structure, mocked-provider notes, and next provider wiring guidance.
