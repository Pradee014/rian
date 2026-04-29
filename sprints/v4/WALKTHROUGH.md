# Sprint v4 - Walkthrough

## Summary

Sprint v4 moved Rian from a browser-only LiveKit room scaffold to a two-process realtime voice architecture. The Next.js app can still run the local mock practice flow, and a separate LiveKit Agents worker can now join a LiveKit room as `rian-agent` using xAI's realtime plugin.

This sprint intentionally keeps the agent simple: Ria is the initial live voice, the xAI realtime model can stay blank to use the plugin default, and dynamic Ria/Ian routing, persistence, trace dashboards, and post-call critique remain future work.

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────────┐
│ Browser / Next.js App                                        │
│                                                              │
│ VoiceRoom                                                    │
│ ├─ LiveKitConnectPanel                                       │
│ │  └─ POST /api/livekit-token                                │
│ ├─ Local mock practice flow                                  │
│ └─ Transcript + trace preview                                │
└──────────────────────────────┬───────────────────────────────┘
                               │ joins room with browser token
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ LiveKit Room                                                 │
│ ├─ Browser participant                                       │
│ └─ rian-agent worker participant                             │
└──────────────────────────────┬───────────────────────────────┘
                               │ worker process
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Rian Agent Worker                                            │
│ src/agent/index.ts                                           │
│ ├─ loads .env.local                                          │
│ ├─ LiveKit ServerOptions                                     │
│ └─ src/agent/agent.ts                                        │
│    ├─ defineAgent                                            │
│    ├─ voice.AgentSession                                     │
│    ├─ xAI realtime model                                     │
│    └─ Rian prompt instructions                               │
└──────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### `package.json`

**Purpose**: Adds the runtime and scripts needed to run the LiveKit/xAI worker.

**Key Scripts/Packages**:
- `agent:dev` - runs the worker in LiveKit Agents development mode.
- `agent:connect` - connects the worker to a specific room for smoke tests.
- `agent:start` - runs the worker in production-style mode.
- `@livekit/agents` - LiveKit's Node worker framework.
- `@livekit/agents-plugin-xai` - xAI realtime model integration.
- `dotenv` - loads `.env.local` for the worker process.
- `tsx` - runs the TypeScript worker entrypoint directly.

**How it works**:

The Next app and the voice worker are separate processes. `npm run dev` starts the web UI, while `npm run agent:dev` starts the LiveKit worker. This split matters because LiveKit Agents is a server-side participant, not a browser component.

The scripts point to `src/agent/index.ts`, which constructs LiveKit `ServerOptions` and delegates job execution to `src/agent/agent.ts`. This keeps app runtime code and worker runtime code separated.

### `package-lock.json`

**Purpose**: Locks the dependency graph for the new worker packages.

**Key Dependencies**:
- `@livekit/agents`
- `@livekit/agents-plugin-xai`
- transitive LiveKit/OpenAI plugin dependencies
- `tsx`
- `dotenv`

**How it works**:

The lockfile now includes LiveKit Agents and its transitive plugin stack. `npm audit` currently reports a moderate `uuid` advisory through `@livekit/agents`, and npm reports no fix available. The repo does not directly call the affected UUID APIs, but this should be revisited when LiveKit publishes an updated dependency tree.

### `src/agent/config.ts`

**Purpose**: Reads and validates environment required by the Rian worker.

**Key Functions/Types**:
- `RianAgentConfig` - normalized worker config.
- `getRianAgentConfig()` - reads LiveKit/xAI env and applies safe defaults.
- `requireEnv()` - fails fast for missing required secrets.
- `optionalEnv()` - treats blank optional values as unset.

**How it works**:

The worker needs LiveKit credentials, an xAI API key, voice names, and an agent name. Required values throw immediately if missing, which prevents a worker from half-starting with unclear runtime failures.

The model field is intentionally optional:

```ts
xaiRealtimeModel: optionalEnv(env, "XAI_REALTIME_MODEL"),
riaVoice: optionalEnv(env, "XAI_RIA_VOICE") ?? "ara",
ianVoice: optionalEnv(env, "XAI_IAN_VOICE") ?? "rex",
agentName: optionalEnv(env, "RIAN_AGENT_NAME") ?? "rian-agent",
```

Leaving `XAI_REALTIME_MODEL` blank lets the LiveKit xAI plugin use its default model. This protects the project from prematurely hardcoding a model while the provider layer is still experimental.

### `src/agent/instructions.ts`

**Purpose**: Generates the Rian worker prompt and opening reply instructions.

**Key Functions**:
- `buildRianAgentInstructions()` - creates the main system-style behavior instructions.
- `buildOpeningReplyInstructions()` - asks the worker to greet briefly and offer practice modes.

**How it works**:

The instructions encode Rian's core product rules: private communication training, one active AI speaker by default, non-sycophantic coaching, no hidden memory, and no romantic or sexual behavior. Ria and Ian are represented as coaching modes and voice configuration, not as separate simultaneous agents yet.

The prompt also keeps live replies concise to protect latency:

```ts
"- Keep live responses concise to protect conversational latency.",
"- Start by inviting the user into casual conversation or self-introduction practice.",
"- Mention that they can ask for Ria, Ian, or both perspectives.",
```

This is the first place where the future live agent inherits Rian's product behavior instead of sounding like a generic realtime assistant.

### `src/agent/config.test.ts`

**Purpose**: Tests config parsing and prompt generation without calling LiveKit or xAI.

**Key Tests**:
- required LiveKit/xAI env is read correctly
- blank `XAI_REALTIME_MODEL` becomes `undefined`
- Ria/Ian voices default to `ara` and `rex`
- voice overrides work
- missing required secrets throw
- instructions include core Rian safety and behavior rules

**How it works**:

These tests keep provider configuration deterministic. They are deliberately no-network tests: the goal is to prove the repo's config and prompt behavior before any realtime provider is contacted.

### `src/agent/agent.ts`

**Purpose**: Defines the actual LiveKit agent worker used inside a room job.

**Key Functions**:
- `createRealtimeModelOptions()` - builds xAI realtime options without hardcoding a model.
- `createRianVoiceAgent()` - creates a LiveKit `voice.Agent` named `rian-agent`.
- `createRealtimeModel()` - instantiates `xai.realtime.RealtimeModel`.
- default export from `defineAgent()` - LiveKit job entrypoint.

**How it works**:

The worker reads config, creates an `AgentSession`, starts it in the assigned LiveKit room, and generates the first brief reply. The session uses the xAI realtime model as the LLM/audio model.

```ts
const session = new voice.AgentSession({
  llm: createRealtimeModel(config),
});

await session.start({
  agent: createRianVoiceAgent(config),
  room: ctx.room,
});
```

The model options only include `model` when `XAI_REALTIME_MODEL` is configured. Otherwise the plugin default remains in control:

```ts
return {
  apiKey: config.xaiApiKey,
  voice: config.riaVoice,
  ...(config.xaiRealtimeModel ? { model: config.xaiRealtimeModel } : {}),
};
```

### `src/agent/agent.test.ts`

**Purpose**: Tests the worker construction seams without connecting to LiveKit or xAI.

**Key Tests**:
- default export has a LiveKit agent `entry`
- xAI realtime options omit model by default
- explicit model is passed only when configured
- `createRianVoiceAgent()` creates `rian-agent` with Rian instructions

**How it works**:

These tests give confidence that the worker is built correctly while avoiding provider calls in CI or local verification. The actual room connection is still a manual smoke test because it depends on valid `.env.local` credentials and a LiveKit room.

### `src/agent/index.ts`

**Purpose**: CLI entrypoint for running the LiveKit Agents worker from npm scripts.

**Key Functions/Components**:
- `loadEnv({ path: ".env.local" })` - loads local secrets first.
- `loadEnv()` - optionally loads `.env` second.
- `cli.runApp()` - starts LiveKit Agents CLI handling.
- `ServerOptions` - passes agent path, agent name, LiveKit URL, and credentials.

**How it works**:

The worker must load `.env.local` because this project keeps provider credentials there. The entrypoint then reads normalized config and starts LiveKit Agents with the compiled runtime pointing at the TypeScript agent file.

```ts
cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(new URL("./agent.ts", import.meta.url)),
    agentName: config.agentName,
    wsURL: config.livekitUrl,
    apiKey: config.livekitApiKey,
    apiSecret: config.livekitApiSecret,
  }),
);
```

The CLI supports `dev`, `connect`, and `start`, which are exposed through npm scripts.

### `README.md`

**Purpose**: Documents the v4 two-process run flow and limitations.

**Key Sections**:
- `Run The Voice Worker`
- `Environment`
- `Project Structure`
- `Current Worker Limitations`
- `Next Provider Wiring`

**How it works**:

The README now tells a developer to run the Next app and worker in separate terminals. It also documents the room-specific smoke-test command:

```bash
npm run agent:connect -- --room rian-room
```

The limitations are intentionally candid: Ria is the initial voice, dynamic persona routing is not live yet, persistence is not wired, and the LiveKit dependency audit issue remains open upstream.

### `next-env.d.ts`

**Purpose**: Next.js-generated TypeScript reference file.

**Key Change**:
- route type import changed from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts`

**How it works**:

This changed when production build/type generation ran. It is not product logic, but it reflects the current generated Next.js type reference after `npm run build`.

### `sprints/v4/PRD.md`

**Purpose**: Defines Sprint v4 scope for the xAI realtime agent worker.

**Key Sections**:
- Sprint Overview
- Goals
- User Stories
- Technical Architecture
- Out of Scope
- Dependencies

**How it works**:

The PRD keeps the sprint limited to a runnable worker scaffold and agent configuration. It explicitly defers dynamic Ria/Ian handoff, persistence, post-call critique, barge-in tuning, and production deployment.

### `sprints/v4/TASKS.md`

**Purpose**: Tracks v4 execution status and verification notes.

**Key Items**:
- Task 1 - dependencies and scripts
- Task 2 - config and instruction tests
- Task 3 - worker entrypoint
- Task 4 - README run instructions
- Task 5 - walkthrough

**How it works**:

The task file records the practical verification for each step. It also repeats the known `npm audit` caveat wherever relevant so the dependency risk is visible rather than hidden.

### `sprints/v4/WALKTHROUGH.md`

**Purpose**: This self-contained sprint review.

**Key Sections**:
- Summary
- Architecture Overview
- Files Created/Modified
- Data Flow
- Test Coverage
- Security Measures
- Known Limitations
- What's Next

**How it works**:

This document explains what v4 added and what it did not add, so the next sprint can pick up live persona routing without rereading every source file.

## Data Flow

1. Developer starts the web app with `npm run dev`.
2. Browser opens `/` and uses the existing LiveKit panel to request a room token from `POST /api/livekit-token`.
3. Browser joins the LiveKit room as a participant.
4. Developer starts the worker with `npm run agent:dev`, or targets a room with `npm run agent:connect -- --room rian-room`.
5. `src/agent/index.ts` loads `.env.local`, reads LiveKit/xAI config, and starts LiveKit Agents.
6. LiveKit assigns a room job to `src/agent/agent.ts`.
7. The worker creates an xAI realtime model with Ria's configured voice and optional model override.
8. The worker starts an `AgentSession` in the LiveKit room as `rian-agent`.
9. The worker generates a short opening reply offering casual conversation or self-introduction practice.

The local mock flow remains available in the browser. That is intentional: frontend development and deterministic routing tests should not require a running LiveKit/xAI worker.

## Test Coverage

- Unit/config: 7 tests in `src/agent/config.test.ts` cover required env, optional model behavior, voice defaults, voice overrides, missing secrets, and prompt rules.
- Worker construction: 4 tests in `src/agent/agent.test.ts` cover the LiveKit agent export, xAI model option shaping, explicit model override, and `rian-agent` instructions.
- Existing project suite: 37 tests passed after v4, covering prior Rian routing/session/recording/LiveKit token behavior plus the new agent tests.
- Build/typecheck: `npm run lint` and `npm run build` pass.
- Security scan: Semgrep passed against `src/`.

No automated E2E test currently proves real browser-to-worker audio. That still requires a manual LiveKit/xAI smoke test with valid credentials.

## Security Measures

- Secrets stay server-side in `.env.local`; the worker never exposes `LIVEKIT_API_SECRET` or `XAI_API_KEY` to browser code.
- The worker loads `.env.local` from the server process, not from client-exposed `NEXT_PUBLIC_*` variables.
- `getRianAgentConfig()` fails fast if required credentials are missing.
- The prompt explicitly forbids hidden memory and requires user approval for long-term memory.
- The prompt excludes romantic or sexual behavior, matching the Rian product constraints.
- The README warns against prefixing commands with secret values, because shell history can leak credentials.
- Semgrep reported no findings in `src/`.

## Known Limitations

- Ria is currently the initial realtime voice. Ian's voice is configured but not dynamically selected in the live worker yet.
- The worker does not yet log routing decisions, prompts, model outputs, latency waterfalls, or trace metadata to a developer dashboard.
- Conversation transcripts, audio, and reports are not persisted to Supabase.
- Post-call critique and optional audio recap are not implemented.
- Barge-in/interruption handling uses provider/LiveKit defaults; Rian-specific tuning is not built.
- There is no automated Playwright/browser E2E that joins a room and confirms realtime audio.
- `npm audit` reports a moderate `uuid` advisory through `@livekit/agents`, with no fix currently available from npm.

## What's Next

Sprint v5 should make the live worker behave like Rian instead of just speaking as a single realtime agent. The best next slice is live persona routing and trace logging: parse explicit "Ria" and "Ian" requests, keep one active speaker, emit router reasons and latency events, and surface those traces in the developer dashboard.

After that, the project should persist sessions, transcripts, audio references, and trace events through Supabase. Post-call critique should come after the saved transcript exists, not before.
