# Rian Agent Guide

This file is the operating guide for coding agents working on Rian. The fuller product brief lives in `rian_voice_poc_pitch.md`; use that document when deeper product context is needed.

## Project Mission

Rian is a personal, voice-first communication training POC.

The core loop is:

```text
Speak -> live conversation with Ria/Ian -> post-call critique -> practice challenge -> repeat
```

The first proof of concept should help the user become more confident in casual conversation and self-introduction. Build Rian as a private communication gym, not a generic AI companion.

## Current Status

- Personal POC first.
- Portfolio or public product later.
- English-only for the first POC.
- One core mode first: casual conversation plus self-introduction practice.
- Keep implementation simple, inspectable, and phase-driven.

## Product Principles

- Voice first. Text supports transcripts, review, debugging, and history.
- One active AI speaker at a time unless there is a clear reason for both.
- Low latency matters and should be measured continuously.
- Critique after the conversation, not after every sentence, unless a direct training mode is active.
- Do not over-correct. Focus on the highest-leverage improvements.
- Ria and Ian must be useful, not sycophantic.
- The user UI should be simple; the developer dashboard should expose internals.
- Privacy first: no hidden memory, and deletion must be possible.

## Core Personas

### Ria

Ria is the social, playful, expressive coach.

Responsibilities:

- Make the user sound warmer, smoother, and more natural.
- Improve conversational flow, humor, playful language, and light banter.
- Notice awkwardness, warmth, timing, and emotional flow.
- Encourage without becoming sycophantic.
- Keep feedback friendly and usable.

Ria should sound energetic, human-like, socially sharp, and warm.

### Ian

Ian is the strategic, direct, founder-minded coach.

Responsibilities:

- Improve clarity, structure, and confidence.
- Push back on vagueness.
- Remove weak phrases and buried points.
- Help with self-introductions, founder pitch, employee pitch, marketing, and positioning.
- Challenge overthinking without being cruel.

Ian should sound deep, calm, practical, concise, and non-sycophantic.

### Rian Orchestrator

Rian is the hidden system, not a third public character.

Responsibilities:

- Decide whether Ria or Ian should speak.
- Decide whether the second persona should join.
- Track session mode, user goals, and recurring weaknesses.
- Apply safety, coaching, and privacy rules.
- Generate post-call critique.
- Store memories only with user approval.
- Log routing decisions, prompts, model outputs, latency, and trace metadata.

## Rian Orchestrator Rules

- Default to one active AI speaker per user turn.
- Let the user explicitly route with phrases like "Ria, take this," "Ian, sharpen this," "Only Ria," or "Only Ian."
- Allow the second persona to join only when:
  - the user asks for both perspectives;
  - the lead response is not enough;
  - both social warmth and strategic clarity are needed;
  - there is a useful counterpoint;
  - the session is ending and a joint review is useful;
  - Katta Kotta Techa mode is active.
- In casual conversation mode, Ria usually leads.
- In self-introduction mode, Ian leads for structure and Ria joins for warmth when useful.
- In Katta Kotta Techa mode, Ian sharpens the sentence, Ria makes it socially natural, and the user gets an immediate practice challenge.
- Do not add romantic or sexual behavior.
- Do not let Ria and Ian agree just to be nice.

## POC Must-Haves

Build the first POC around:

- Web voice room.
- Hotkey or clear control to start and stop conversation.
- Ria and Ian cards or simple avatars.
- Active speaker indicator.
- Distinct Ria and Ian voices.
- One active AI speaker at a time.
- Casual conversation and self-introduction practice.
- Transcript history.
- Stored audio.
- Post-call critique report.
- Optional audio recap of the review.
- Developer dashboard for traces and latency.
- Basic deterministic tests and AI evals.

## Explicit Non-Goals

Do not build these for the first POC:

- Public product.
- Payments.
- Complex account system.
- Full mobile app.
- 3D avatars.
- Teen mode.
- Complex emergency or SOS logic.
- Full romantic/flirting companion behavior.
- Full multilingual support.
- Fine-tuning.
- Advanced autonomous multi-agent debate.
- Advanced memory before the core voice loop works.

## Recommended Stack

Use this as the default first implementation path:

- Frontend: Next.js web app.
- Voice runtime: LiveKit Agents.
- LLM: Groq or OpenAI for live responses; OpenAI or another stronger reasoning model for post-call review. Keep provider boundaries swappable.
- STT: Groq Whisper first for cost-aware transcription experiments, with Deepgram Flux and OpenAI transcription available behind the same provider boundary.
- TTS: OpenAI TTS first, then test ElevenLabs or Cartesia for stronger character voices.
- Database: Supabase Postgres.
- Storage: Supabase Storage or equivalent object storage for audio.
- Memory later: pgvector.
- Evals: local eval scripts plus manual review during the early POC.
- Developer dashboard: separate internal route or dashboard.

## Provider Strategy

Keep STT, LLM, and TTS behind provider boundaries so the project can compare latency, quality, and cost.

Default POC pipeline:

```text
Browser mic
  -> LiveKit room
  -> LiveKit Agent
  -> Groq Whisper STT
  -> Rian Orchestrator
  -> Groq or OpenAI live LLM
  -> TTS provider
  -> LiveKit audio back to browser
```

### STT

Use a provider-swappable STT layer from the start.

- Groq Whisper: default first choice when cost matters and basic transcription quality is enough.
- Deepgram Flux: keep as the low-latency conversational candidate, especially for turn-taking, partial transcript quality, and interruption experiments.
- OpenAI transcription: keep as the simplest option when the rest of the stack is OpenAI-heavy.

Log STT latency, transcript quality, partial/final transcript behavior, and cost assumptions.

### LLM

- Use a fast Groq or OpenAI conversational model for live responses.
- Use a stronger reasoning model for post-call critique when useful.
- Keep live responses concise to protect latency and conversational feel.
- Preserve persona consistency and non-sycophancy through prompt versions and evals.

### TTS

- Start with OpenAI TTS for simplicity.
- Keep a voice registry so Ria and Ian voices can be swapped without changing orchestration logic.
- Test ElevenLabs or Cartesia later for expressive, low-latency character voices.
- Log first-audio latency, total playback duration, selected voice, and cancellation events.

## Implementation Phases

Build phase by phase. Do not start by building a large app.

1. Product and behavior spec
   - Finalize Ria, Ian, orchestrator, Katta Kotta Techa, report format, interruption modes, and eval criteria.

2. Single voice room
   - Build web voice room, hotkey/control, mic capture, one AI voice, live transcript, end session, and audio/transcript storage.

3. Two voices, one speaker at a time
   - Add Ria voice, Ian voice, active speaker indicator, persona router, Ria-only/Ian-only preferences, and basic trace logging.

4. Post-call critique report
   - Generate summary, strengths, improvements, line rewrites, filler words, pace/pause notes, next challenge, and optional audio recap.

5. Interruption handling
   - Support user barge-in, stop AI audio when the user speaks, clear queued TTS, log interruption events, and add intentional coaching interruptions for training modes.

6. Voice analytics
   - Add filler word count, talk/listen ratio, speaking rate, pause count, long pause detection, average volume, and basic pitch analysis if feasible.

7. Memory and personal playbook
   - Add memory candidates, user approval, strong lines, weak patterns, skill progress, and delete/forget controls.

8. Developer dashboard and evals
   - Add trace viewer, latency waterfall, prompt/version viewer, provider comparison, eval runner, and persona eval dashboard.

## Testing and Eval Expectations

Use deterministic tests for rules that should always hold:

- Hotkey/control starts and stops recording.
- Session is created.
- Audio and transcript attach to a session.
- Only one persona speaks unless both are explicitly allowed.
- Ria-only mode does not make Ian speak.
- Ian-only mode does not make Ria speak.
- Report is generated after session end.
- Delete session removes audio/transcript/report references.
- Developer dashboard receives trace data.

Use AI evals for behavior and quality:

- Persona consistency.
- Speaker routing.
- Non-sycophancy.
- Conversation naturalness.
- No over-critiquing.
- Post-call report usefulness.
- Interruption handling.
- Voice latency.
- STT accuracy.
- TTS character fit.

The POC demo succeeds when the user can speak, get a natural response, interrupt the AI, end the session, receive a useful critique, and feel more confident afterward.

## Privacy and Memory Rules

- Do not store hidden memories.
- Store long-term memory only after user approval.
- Memory should be useful, not creepy.
- The user must be able to delete sessions, audio, transcripts, reports, and memories.
- For the POC, implement deletion for session, audio, and memory/report first.
- Do not use a session for future coaching if the user marks it as excluded.
- Keep personal-only assumptions until the POC proves value.

## Developer Dashboard Requirements

The developer dashboard is the engineering control center. It should help answer why the system behaved a certain way.

It must show:

- Session timeline.
- Audio events.
- STT partial and final transcripts.
- Turn boundaries.
- Interruption events.
- Selected persona.
- Router decision and reason.
- LLM prompt version.
- LLM output.
- TTS voice used.
- Latency waterfall.
- Error logs.
- Eval results.

Always preserve enough trace data to debug latency, routing, persona drift, and over-critiquing.

## Agent Working Rules

- Prefer the simplest implementation that proves the current phase.
- Keep the POC personal-only.
- Build the voice room before advanced memory.
- Build one mode before many modes.
- Enforce one active AI speaker at a time.
- Log every routing decision.
- Add tests before adding complex features.
- Do not over-engineer avatars.
- Do not add romantic or sexual behavior.
- Do not store hidden memories.
- Keep the developer dashboard in mind during all architecture decisions.
- Preserve provider-swappable boundaries for STT, LLM, and TTS.
- If unsure, choose the simpler, more inspectable implementation.

## Reference Source

Use `rian_voice_poc_pitch.md` as the canonical long-form product and architecture brief.

Use current official provider docs when implementing voice APIs because they change quickly.
