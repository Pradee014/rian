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

Real microphone capture, LiveKit rooms, STT, LLM calls, TTS playback, Supabase storage,
and post-call critique generation were deferred in v1. In v2, microphone capture is local
only; cloud providers and durable storage are still deferred. In v3, the browser can join
a LiveKit room, but the server-side xAI voice agent worker is still deferred.

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

## Checks

```bash
npm run lint
npm run test
npm run build
npm audit
```

## Environment

Create `.env.local` from `.env.example`. For the v3 LiveKit room scaffold, these values
are required:

```bash
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

For the next xAI realtime worker sprint, add:

```bash
XAI_API_KEY=
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

The LiveKit flow is room-only in v3: connect to a LiveKit room, then keep using the local
mock practice UI until the server-side agent worker is implemented.

## Next Provider Wiring

The next implementation sprint should replace one mock boundary at a time:

1. Add a LiveKit Agent worker that joins the room.
2. Add the LiveKit xAI realtime plugin with default model selection.
3. Map Ria/Ian voice choices through `XAI_RIA_VOICE` and `XAI_IAN_VOICE`.
4. Preserve one-active-speaker routing and trace events around agent decisions.
5. Persist sessions, transcripts, trace events, and later audio through Supabase.

Keep Rian's core rules intact while wiring providers: one active AI speaker by default,
visible traceability, no hidden memory, and deletion paths for stored personal data.
