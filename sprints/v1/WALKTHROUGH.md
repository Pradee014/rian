# Sprint v1 - Walkthrough

## Summary

Sprint v1 built the first working foundation for Rian's voice room. The app now has a Next.js TypeScript scaffold, a local practice-room UI, Ria/Ian persona state, deterministic one-speaker routing, mock provider boundaries, transcript state, trace events, and setup documentation.

The sprint deliberately stops before real microphone capture, LiveKit, STT, LLM, TTS, Supabase persistence, or post-call critique generation. The goal was to make those later integrations pluggable instead of forcing them into an unshaped app.

## Architecture Overview

```text
┌───────────────────────────────────────────────────────────────┐
│ Browser                                                       │
│                                                               │
│  /                                                            │
│  └─ VoiceRoom                                                 │
│     ├─ SessionControls     start/end, mode, elapsed time      │
│     ├─ PersonaCards        Ria/Ian active speaker display     │
│     ├─ TranscriptPanel     user and mock assistant turns      │
│     └─ TracePreview        routing/provider trace events      │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│ Rian App Layer                                                │
│  ├─ createSession / appendTurn / appendTrace / endSession      │
│  ├─ routePersona                                               │
│  └─ PERSONAS                                                   │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│ Provider Boundaries                                           │
│  ├─ mockVoiceRuntime  future LiveKit adapter boundary          │
│  ├─ mockStt           future Groq/Deepgram/OpenAI STT boundary │
│  ├─ mockLlm           future Groq/OpenAI LLM boundary          │
│  └─ mockTts           future OpenAI/ElevenLabs/TTS boundary    │
└───────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### `README.md`

**Purpose**: Explains how to run the v1 scaffold and where future provider integrations should connect.

**Key Sections**:

- `Run Locally` - install and dev server commands.
- `Project Structure` - where app, component, domain, provider, and sprint files live.
- `Mocked in v1` - which real provider concerns are placeholders.
- `Next Provider Wiring` - suggested order for replacing mocks.

**How it works**:

The README is intentionally short and operational. It tells a new developer that v1 is not a live voice stack yet, then points them to the exact directories that matter.

It also records the local dev-server workaround: `WATCHPACK_POLLING=true next dev --webpack`. That exists because the default watcher hit local file descriptor limits during verification.

### `package.json`

**Purpose**: Defines the Next.js app dependencies and project scripts.

**Key Scripts**:

- `dev` - starts Next.js in webpack mode with polling.
- `build` - creates a production Next.js build.
- `lint` - runs TypeScript with `noEmit`.
- `test` - runs Vitest.

**How it works**:

The package uses `next`, `react`, and `react-dom` for the app, with TypeScript and Vitest as dev tooling. It also includes an `overrides` block to force PostCSS to `8.5.12`, which cleared the npm audit advisory reported through Next's dependency tree.

```json
"scripts": {
  "dev": "WATCHPACK_POLLING=true next dev --webpack",
  "build": "next build",
  "lint": "tsc --noEmit",
  "test": "vitest run --passWithNoTests"
}
```

### `package-lock.json`

**Purpose**: Locks the exact dependency graph used by the scaffold.

**Key Functions/Components**:

- Dependency versions for Next.js, React, TypeScript, Vitest, and transitive packages.
- The PostCSS override resolution used to keep `npm audit` clean.

**How it works**:

The lockfile makes local installs repeatable. It is not hand-authored, but it matters because the sprint verified the app against this exact dependency tree.

### `.gitignore`

**Purpose**: Keeps generated app artifacts and local secrets out of version control.

**Key Entries**:

- `node_modules`
- `.next`
- `*.tsbuildinfo`
- `.env`
- `.env.*`

**How it works**:

The ignore file is standard for a Next.js TypeScript project. It also leaves room for a future `.env.example` by explicitly unignoring it.

### `next.config.ts`

**Purpose**: Configures Next.js for this repo root.

**Key Configuration**:

- `turbopack.root` - pins the project root to the current working directory.

**How it works**:

Next initially inferred a parent directory as the workspace root because another lockfile exists above this repo. Pinning the root keeps build behavior tied to `/Users/pradeep/Spark/toys/rian`.

```ts
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};
```

### `next-env.d.ts`

**Purpose**: Provides Next.js TypeScript ambient references.

**Key Functions/Components**:

- Next.js type references.
- Next image type references.

**How it works**:

This file is the conventional Next.js TypeScript environment declaration. It lets the TypeScript compiler understand Next-specific imports and generated types.

### `tsconfig.json`

**Purpose**: Defines TypeScript compiler behavior for the app.

**Key Configuration**:

- `strict: true` - keeps types tight from the start.
- `moduleResolution: "bundler"` - matches modern Next.js expectations.
- `paths` - maps `@/*` to `src/*`.
- `.next/types` and `.next/dev/types` includes - lets generated Next types participate in checks.

**How it works**:

The app uses TypeScript as the primary lint gate through `npm run lint`. Next adjusted the JSX setting to `react-jsx`, which is required for the React automatic runtime.

### `src/app/layout.tsx`

**Purpose**: Defines the root HTML shell and metadata for the app.

**Key Functions/Components**:

- `metadata` - sets the Rian title and description.
- `RootLayout` - wraps all pages and loads global CSS.

**How it works**:

The layout is intentionally thin. It loads `globals.css`, sets `lang="en"`, and renders child routes.

### `src/app/page.tsx`

**Purpose**: Makes the root route render the Rian voice room.

**Key Functions/Components**:

- `Home` - returns `VoiceRoom`.

**How it works**:

The root page delegates to the client-side voice room component. That keeps the app route simple while allowing session state and mock interactions to live in the UI component.

```tsx
import { VoiceRoom } from "@/components/voice-room";

export default function Home() {
  return <VoiceRoom />;
}
```

### `src/app/globals.css`

**Purpose**: Provides the first-pass visual system and responsive layout for the practice room.

**Key Functions/Components**:

- CSS variables for background, panels, lines, Ria, and Ian colors.
- Responsive layout rules for controls, persona cards, transcript, and trace panels.
- Stable button, textarea, status, and card styles.

**How it works**:

The styling aims for a focused private communication gym rather than a generic chatbot. The layout uses a broad control header, a main practice column, and a sticky trace preview on desktop.

The mobile rules collapse the room into one column and keep controls usable by turning action rows into two-column grids where appropriate.

### `src/lib/rian/types.ts`

**Purpose**: Defines the shared domain model for Rian v1.

**Key Types**:

- `PersonaId`
- `PracticeMode`
- `SessionStatus`
- `TranscriptTurn`
- `TraceEvent`
- `RianSession`
- `RouterDecision`

**How it works**:

These types are the contract between the UI, router, session helpers, and provider mocks. They make the one-speaker routing rule explicit by separating `primaryPersonaId` from the optional `secondaryPersonaId`.

```ts
export interface RouterDecision {
  primaryPersonaId: PersonaId;
  secondaryPersonaId?: PersonaId;
  reason: string;
}
```

### `src/lib/rian/personas.ts`

**Purpose**: Defines Ria and Ian as structured persona constants.

**Key Constants**:

- `RIA` - social, playful, expressive coach.
- `IAN` - strategic, direct, founder-minded coach.
- `PERSONAS` - lookup by persona id.
- `DEFAULT_ACTIVE_PERSONA_ID` - defaults to Ria.

**How it works**:

The UI reads these constants to render persona cards, while routing/session logic uses the ids to avoid duplicating strings. This keeps character details centralized as the prompt and voice work grows.

### `src/lib/rian/router.ts`

**Purpose**: Implements deterministic persona routing for v1.

**Key Functions**:

- `routePersona()` - chooses the active speaker and records a reason.
- `defaultPersonaForMode()` - maps casual to Ria and self-introduction to Ian.
- `includesAny()` - checks user text against routing patterns.

**How it works**:

The router honors explicit phrases like "Ria, take this" and "Ian, sharpen this." If the user asks for both perspectives, the router still refuses a second speaker unless `allowBoth` is true.

```ts
if (asksForBoth) {
  const primaryPersonaId = input.mode === "self-introduction" ? "ian" : "ria";
  return {
    primaryPersonaId,
    secondaryPersonaId: primaryPersonaId === "ria" ? "ian" : "ria",
    reason: "User explicitly asked for both perspectives.",
  };
}
```

This preserves the core Rian rule: one active AI speaker by default.

### `src/lib/rian/router.test.ts`

**Purpose**: Verifies deterministic routing behavior.

**Key Tests**:

- Casual mode defaults to Ria.
- Self-introduction mode defaults to Ian.
- Explicit Ria and Ian routing phrases are honored.
- Second speaker is blocked unless both speakers are allowed and requested.

**How it works**:

The tests protect the behavior most likely to regress once real LLM prompts arrive. They are intentionally deterministic and avoid provider calls.

### `src/lib/rian/session.ts`

**Purpose**: Provides immutable helpers for local session lifecycle, transcript turns, active persona, and trace events.

**Key Functions**:

- `createSession()` - starts a local practice session.
- `appendTurn()` - adds a transcript turn.
- `appendTrace()` - records trace events.
- `setActivePersona()` - updates active speaker and records a routing trace.
- `endSession()` - closes the session and records final metadata.

**How it works**:

The helpers return new session objects instead of mutating existing state. That makes them predictable in React state and simple to test.

```ts
export function appendTurn(
  session: RianSession,
  input: { speaker: SpeakerId; text: string; personaId?: PersonaId },
  options: SessionFactoryOptions = {},
): RianSession {
  const turn: TranscriptTurn = {
    id: makeId("turn"),
    speaker: input.speaker,
    text: input.text,
    createdAt: now(),
    personaId: input.personaId,
  };
```

The helper options allow tests to inject stable clocks and ids.

### `src/lib/rian/session.test.ts`

**Purpose**: Verifies session lifecycle behavior.

**Key Tests**:

- Session starts active with the expected default persona.
- Self-introduction starts with Ian active.
- Transcript turns append without mutation.
- Persona changes create trace events.
- Ending a session records final trace metadata.

**How it works**:

The tests inject deterministic ids and timestamps, which keeps the session assertions stable. They cover the local state model that the UI uses.

### `src/lib/providers/types.ts`

**Purpose**: Defines provider contracts for future voice runtime, STT, LLM, and TTS integrations.

**Key Interfaces**:

- `VoiceRuntimeAdapter`
- `SttAdapter`
- `LlmAdapter`
- `TtsAdapter`
- `ProviderResult<T>`

**How it works**:

Each provider call returns both `data` and a trace-like object with provider metadata. This is the foundation for the future developer dashboard and latency tracing.

```ts
export interface ProviderResult<T> {
  data: T;
  trace: Omit<TraceEvent, "id" | "createdAt"> & {
    metadata: {
      provider: string;
      providerKind: ProviderKind;
      latencyMs: number;
      mocked: boolean;
    };
  };
}
```

### `src/lib/providers/mock-voice.ts`

**Purpose**: Provides a mock voice runtime boundary for future LiveKit integration.

**Key Functions/Components**:

- `mockVoiceRuntime.startSession()` - returns a mock room id and trace.
- `mockVoiceRuntime.endSession()` - returns the same room id and trace.

**How it works**:

The mock adapter gives the app a place to call when LiveKit room lifecycle work starts. It already records provider kind, provider name, mock status, and latency metadata.

### `src/lib/providers/mock-stt.ts`

**Purpose**: Provides a mock STT boundary for future Groq, Deepgram, or OpenAI transcription.

**Key Functions/Components**:

- `mockStt.transcribe()` - returns predictable text for an audio id and trace metadata.

**How it works**:

The adapter does not connect to a microphone or audio file yet. It exists so future STT work can swap implementation behind the same contract without forcing UI changes.

### `src/lib/providers/mock-llm.ts`

**Purpose**: Provides a mock LLM response boundary for live conversation behavior.

**Key Functions/Components**:

- `mockLlm.respond()` - generates a short Ria or Ian response from a router decision.

**How it works**:

The mock LLM reads the router decision and creates a persona-specific response. Ria gives warmth-oriented phrasing, while Ian gives structure-oriented phrasing.

This keeps the UI flow realistic enough for v1 while avoiding real model calls.

### `src/lib/providers/mock-tts.ts`

**Purpose**: Provides a mock TTS boundary for future OpenAI, ElevenLabs, or Cartesia voices.

**Key Functions/Components**:

- `mockTts.synthesize()` - returns a mock audio id, estimated duration, and trace metadata.

**How it works**:

There is no audio playback in v1. The mock adapter exists so the conversation flow can record where audio synthesis will happen and how first-audio latency should later be traced.

### `src/components/voice-room.tsx`

**Purpose**: Coordinates the local voice room UI and mock conversation flow.

**Key Functions/Components**:

- `VoiceRoom` - main client component for the root app.
- `handleStart()` - creates a local session.
- `handleEnd()` - ends the local session.
- `handleSubmit()` - routes a mock utterance through router, mock LLM, mock TTS, transcript, and traces.

**How it works**:

`VoiceRoom` owns local React state for practice mode, session, draft utterance, elapsed time, and response loading. When the user submits text, the component appends a user turn, routes to one persona, records trace events, appends the mock assistant turn, and records mock TTS metadata.

```tsx
const decision = routePersona({ mode: session.mode, userText });
let next = appendTurn(session, { speaker: "user", text: userText });
next = appendTrace(next, "user_turn", "User mock utterance recorded.");
next = setActivePersona(next, decision.primaryPersonaId);
next = appendTrace(next, "router_decision", decision.reason, {
  primaryPersonaId: decision.primaryPersonaId,
  secondaryPersonaId: decision.secondaryPersonaId ?? null,
});
```

The component stays deliberately local in v1. Later sprints can replace the mock submit path with live microphone, STT, LLM, and TTS calls.

### `src/components/session-controls.tsx`

**Purpose**: Renders session mode, status, elapsed time, and start/end controls.

**Key Functions/Components**:

- `SessionControls` - UI for session lifecycle.
- `formatElapsed()` - formats elapsed seconds as `MM:SS`.

**How it works**:

The component disables mode switching once a session is active, which keeps session state coherent. It exposes `data-testid` attributes on controls that will be useful once browser tests are added.

### `src/components/persona-cards.tsx`

**Purpose**: Renders Ria and Ian cards with an active speaker indicator.

**Key Functions/Components**:

- `PersonaCards` - maps `PERSONAS` into visible coach cards.

**How it works**:

The component reads centralized persona constants instead of hardcoding copy locally. The active card uses `aria-current` and `data-testid` so it is both accessible and testable.

### `src/components/transcript-panel.tsx`

**Purpose**: Displays local transcript turns.

**Key Functions/Components**:

- `TranscriptPanel` - renders transcript count and ordered turn list.
- `labelForTurn()` - maps turns to `You`, `Ria`, `Ian`, or `Rian`.

**How it works**:

The transcript is a plain ordered list. User turns and assistant turns receive different classes, which lets the UI distinguish practice input from Rian's response.

### `src/components/trace-preview.tsx`

**Purpose**: Displays recent trace events for developer visibility.

**Key Functions/Components**:

- `TracePreview` - shows the latest six traces in reverse chronological order.

**How it works**:

This is a small version of the future developer dashboard. It makes routing and provider calls visible immediately, which supports Rian's principle that internals should be inspectable.

### `sprints/v1/PRD.md`

**Purpose**: Defines the v1 sprint scope and architecture.

**Key Sections**:

- Sprint overview
- Goals
- User stories
- Technical architecture
- Out of scope
- Dependencies

**How it works**:

The PRD intentionally chooses a scaffold-first implementation sprint. It pushes real provider integration, Supabase storage, critique generation, interruption handling, and advanced dashboard work out of v1.

### `sprints/v1/TASKS.md`

**Purpose**: Tracks the v1 implementation checklist.

**Key Functions/Components**:

- Nine sprint tasks, all marked complete.
- Completion notes with date and summary.
- File lists for each task.

**How it works**:

The task file is now the sprint execution record. It shows that v1 progressed from app scaffold to domain model, routing, provider mocks, session helpers, UI, mock flow, styling, and README.

## Data Flow

1. User opens `/`.
2. `src/app/page.tsx` renders `VoiceRoom`.
3. User chooses `Casual` or `Intro`, then clicks `Start`.
4. `createSession()` creates a local active session with default active persona.
5. User enters a mock practice line and submits it.
6. `appendTurn()` records the user turn.
7. `routePersona()` selects Ria or Ian and returns a routing reason.
8. `setActivePersona()` updates the visible active speaker and records a trace.
9. `mockLlm.respond()` generates a persona-specific mock reply.
10. `appendTurn()` records the assistant response.
11. `mockTts.synthesize()` records where future audio synthesis will happen.
12. `TranscriptPanel` renders turns and `TracePreview` renders recent trace events.
13. User clicks `End`, and `endSession()` closes the session with final trace metadata.

## Test Coverage

- Unit: 11 tests - persona routing defaults, explicit routing, one-speaker behavior, session start, self-introduction active persona, transcript immutability, active persona trace events, and session ending.
- Integration: 0 tests - provider integration is mocked and real provider wiring is out of scope for v1.
- E2E: 0 tests - browser E2E is deferred until the UI stabilizes around real or semi-real voice behavior.

## Security Measures

- No hidden memory was implemented.
- No user data is persisted in v1.
- Provider adapters are mocked, so no external API keys or credentials are used.
- `npm audit` reports zero vulnerabilities after the PostCSS override.
- Semgrep completed with no findings against `src/`.
- `.env` and `.env.*` are ignored by default.

## Known Limitations

- This is not a real voice room yet; there is no microphone capture, LiveKit room, STT, TTS playback, or audio storage.
- The mock LLM response is deterministic and simplistic; it only proves the routing and UI flow.
- Trace preview is local UI state, not a real developer dashboard or persisted trace log.
- There is no Supabase database or storage layer yet.
- There is no post-call critique report yet.
- There is no browser E2E coverage yet.
- The dev server uses polling and webpack mode to avoid local file-watcher limits, which is reliable but less elegant than the default Next dev path.

## What's Next

Sprint v2 should move from a text-based mock room toward the first real voice-room slice. The strongest next priority is adding browser microphone capture and a LiveKit-compatible voice runtime boundary while preserving the current session, transcript, trace, and one-speaker routing contracts.

After that, the project should add one real provider at a time: STT first, then live LLM response generation, then TTS playback with Ria/Ian voice selection and latency tracing.
