# Rian

Rian is a personal, voice-first communication training POC. The product goal is simple:
help the user become more confident in casual conversation and self-introduction through
live practice, post-call critique, and repeatable coaching challenges.

## Current Sprint

Sprint v1 is the voice room foundation. It includes:

- Next.js App Router with TypeScript
- a local Rian voice room shell
- Ria and Ian persona cards
- start/end session controls
- transcript and trace preview surfaces
- deterministic persona routing
- mock provider boundaries for voice runtime, STT, LLM, and TTS

Sprint v2 adds the first browser microphone capture surface:

- browser `MediaRecorder` helper
- recording controls inside an active session
- microphone permission and error states
- local audio preview through a browser object URL
- recorded audio routed through mock STT, persona routing, mock LLM, mock TTS, transcript, and traces

Sprint v3 adds the first LiveKit room scaffold:

- server-side LiveKit token generation through `POST /api/livekit-token`
- browser LiveKit room connection controls
- `@livekit/components-react` room connection surface
- xAI realtime env placeholders with model selection left optional for LiveKit plugin defaults

Sprint v4 adds the first server-side realtime voice worker:

- LiveKit Agents worker entrypoint
- xAI realtime model wiring through `@livekit/agents-plugin-xai`
- Rian-specific agent instructions
- `.env.local` loading for the worker process
- no-network tests for agent config and worker construction helpers

Real microphone capture, LiveKit rooms, STT, LLM calls, TTS playback, Supabase storage,
and post-call critique generation were deferred in v1. In v2, microphone capture is local
only; cloud providers and durable storage are still deferred. In v3, the browser can join
a LiveKit room. In v4, a local worker can join through LiveKit Agents, but persona
handoff, durable transcripts, and post-call critique are still deferred.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The `dev` script uses webpack plus polling because this machine hit file-watcher limits
with the default watcher:

```bash
WATCHPACK_POLLING=true next dev --webpack
```

## Run The Voice Worker

The realtime worker is a separate Node process from the Next.js app. Run the web app in
one terminal:

```bash
npm run dev
```

Run the LiveKit/xAI worker in a second terminal:

```bash
npm run agent:dev
```

For a focused local smoke test against a known room, use LiveKit Agents' `connect`
command. The room name should match the room shown in the browser LiveKit panel:

```bash
npm run agent:connect -- --room rian-room
```

For a production-style worker process:

```bash
npm run agent:start
```

The worker loads `.env.local` first, then `.env`. Do not prefix these commands with
secret values in the shell, because that can leak credentials into terminal history.

## Checks

```bash
npm run lint
npm run test
npm run build
npm audit
```

## Environment

Create `.env.local` from `.env.example`. For the browser room and agent worker, these
values are required:

```bash
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
XAI_API_KEY=
```

Voice config is optional but recommended:

```bash
XAI_RIA_VOICE=ara
XAI_IAN_VOICE=rex
```

`XAI_REALTIME_MODEL` should stay blank for now so the LiveKit xAI plugin can use its
default model.

## Project Structure

```text
src/app/                 Next.js app entry and global styling
src/components/          Voice room UI surfaces
src/lib/rian/            Rian domain types, personas, routing, session state
src/lib/providers/       Swappable provider interfaces and v1 mock adapters
src/lib/livekit/         LiveKit env and token request helpers
src/agent/               LiveKit Agents worker, xAI realtime config, prompt tests
sprints/v1/              Sprint plan and task checklist
```

## Mocked in v1

- `src/lib/providers/mock-voice.ts`: stand-in for future LiveKit room lifecycle.
- `src/lib/providers/mock-stt.ts`: stand-in for Groq Whisper, Deepgram Flux, or OpenAI transcription.
- `src/lib/providers/mock-llm.ts`: stand-in for live Groq/OpenAI conversation responses.
- `src/lib/providers/mock-tts.ts`: stand-in for OpenAI TTS, ElevenLabs, or Cartesia audio.

The mock flow is text-based: start a session, enter a practice line, route it to Ria or
Ian, generate a mock response, and record trace events.

The browser mic flow is local: start a session, click Record, grant microphone access,
click Stop, preview the captured audio, and let the app send the audio id through mock
STT. No audio leaves the browser in v2.

The LiveKit flow now has two pieces: the browser connects to a LiveKit room, and the
server-side worker can join the room as `rian-agent`. The local mock practice UI still
exists so frontend development does not require provider calls.

## Current Worker Limitations

- Ria is the initial xAI voice used by the worker; dynamic Ria/Ian switching is planned
  for the next routing sprint.
- The worker uses LiveKit/xAI realtime behavior for turn detection; barge-in tuning is
  not customized yet.
- Transcripts, audio, trace events, and post-call critique are not persisted yet.
- Supabase storage is still planned but not wired into the live voice path.
- `npm audit` currently reports a no-fix moderate `uuid` advisory through
  `@livekit/agents`; this repo does not call the affected UUID APIs directly.

## Next Provider Wiring

The next implementation sprint should replace one mock boundary at a time:

1. Add live Ria/Ian routing inside the worker while preserving one active speaker.
2. Emit trace events for selected persona, router reason, model output, and latency.
3. Persist sessions, transcripts, trace events, and later audio through Supabase.
4. Generate post-call critique from the saved transcript.
5. Add deletion paths for sessions, audio, transcripts, reports, and future memories.

Keep Rian's core rules intact while wiring providers: one active AI speaker by default,
visible traceability, no hidden memory, and deletion paths for stored personal data.
