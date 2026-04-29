# Sprint v1 - PRD: Voice Room Foundation

## Sprint Overview

Sprint v1 creates the first buildable foundation for Rian's voice-first POC: a Next.js app with a usable voice-room shell, local session lifecycle, transcript display, persona state, and provider boundary placeholders. This sprint does not attempt real LiveKit, STT, LLM, or TTS integration yet; it creates the inspectable structure that future sprints can wire to real providers without reshaping the app.

## Goals

- User can open a Rian web app and see a focused voice practice room for casual conversation and self-introduction practice.
- User can start and end a local practice session with visible session state, elapsed time, and transcript history.
- The UI shows Ria and Ian persona cards, an active speaker indicator, and a clear "one active AI speaker" model.
- The codebase has provider-swappable boundaries for voice runtime, STT, LLM, and TTS, even if v1 uses local mock implementations.
- Deterministic tests verify session lifecycle and routing rules that should remain true as real providers are added.

## User Stories

- As the builder, I want a minimal Rian voice room, so that I can start testing the core practice loop without waiting for every provider integration.
- As a user practicing conversation, I want clear start and end controls, so that I know when Rian is listening and when the session is over.
- As a user, I want to see Ria and Ian as distinct coaches with one active speaker at a time, so that the interaction feels structured instead of chaotic.
- As a developer, I want provider boundaries and trace-friendly session state, so that LiveKit, STT, LLM, and TTS can be added later without rewriting the app.
- As a developer, I want deterministic tests for session and routing behavior, so that the core product rules do not regress.

## Technical Architecture

- **Frontend**: Next.js App Router with TypeScript.
- **Styling**: CSS modules or global CSS, kept simple for the first POC.
- **Voice runtime**: local mock voice room service in v1; LiveKit Agents integration deferred to v2.
- **STT / LLM / TTS**: provider interface files with mock implementations for v1.
- **State**: local React state for session lifecycle, active persona, transcript turns, and trace events.
- **Tests**: Vitest for deterministic logic tests; UI/browser E2E deferred unless the app scaffold makes it cheap to add.

```text
┌──────────────────────────────────────────────────────────┐
│ Browser                                                  │
│                                                          │
│  /                                                       │
│  └─ VoiceRoom                                            │
│     ├─ SessionControls                                   │
│     ├─ PersonaCards                                      │
│     ├─ TranscriptPanel                                   │
│     └─ TracePreview                                      │
└──────────────────────────────┬───────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────┐
│ Rian App Layer                                           │
│  ├─ session state                                        │
│  ├─ persona router                                      │
│  └─ trace event collector                               │
└──────────────────────────────┬───────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────┐
│ Provider Boundaries                                      │
│  ├─ voice runtime adapter (mock in v1, LiveKit later)    │
│  ├─ STT adapter (mock in v1, Groq/Deepgram/OpenAI later) │
│  ├─ LLM adapter (mock in v1, Groq/OpenAI later)          │
│  └─ TTS adapter (mock in v1, OpenAI/ElevenLabs later)    │
└──────────────────────────────────────────────────────────┘
```

Data flow for v1:

```text
User clicks Start -> local session state opens -> trace event is recorded
User adds mock utterance -> mock router selects Ria or Ian -> transcript updates
User clicks End -> session closes -> summary-ready state is visible
```

## Out of Scope

- Real LiveKit room creation and server-side agent runtime.
- Real microphone capture, streaming STT, LLM responses, or TTS audio playback.
- Supabase database, object storage, and persistent audio storage.
- Post-call critique generation beyond a placeholder state.
- Interruption handling and barge-in behavior.
- Advanced memory, personal playbook, pgvector, or hidden long-term memory.
- Full developer dashboard, eval runner, provider comparison UI, or latency waterfall.
- Public product concerns such as auth, billing, teams, mobile app, or 3D avatars.

## Dependencies

- Existing product direction from `AGENTS.md` and `rian_voice_poc_pitch.md`.
- Node.js package tooling for the Next.js scaffold.
- Future provider credentials for LiveKit, STT, LLM, TTS, and Supabase are not required for v1.
- Later sprints will depend on the provider interfaces, session model, transcript shape, and routing tests introduced here.
