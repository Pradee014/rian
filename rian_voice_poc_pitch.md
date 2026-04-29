# Rian Voice POC — CTO Project Pitch & Implementation Brief

**Document purpose:** This is a CTO-style project pitch and implementation brief for human developers, Codex, Claude Code, and other coding agents. It defines what we are building, why it matters, how the system should behave, what the first proof-of-concept should include, and how to evaluate success.

**Project status:** Personal POC first. Portfolio or public product later.

**Current product name:** **Rian**

**Core characters:**

- **Ria** — energetic, human-like, playful, socially sharp, warm, expressive.
- **Ian** — deep, calm, strategic, direct, practical, non-sycophantic.
- **Rian Orchestrator** — hidden conductor that decides who speaks, when to interrupt, what to remember, how to critique, and how to generate post-call feedback.

---

## 1. Executive pitch

**Rian is a voice-first personal AI practice partner that helps the user become confident in real conversations.**

The user speaks with two distinct AI characters, Ria and Ian. They do not both respond every time. One character leads, while the other joins only when useful. The conversation should feel like a low-latency live phone call. After the session, Rian generates a critique report that helps the user improve confidence, clarity, vocabulary, interruptions, pacing, filler words, and conversational flow.

The first use case is **casual conversation and self-introduction practice**. Later, the same system expands into pitching, founder communication, employee communication, marketing strategy, banter, playful flirting, voice improvement, and vocabulary.

The product is not meant to replace people. It is meant to train the user to become better with people.

---

## 2. The simplest product promise

> **Rian helps me speak better in real life.**

More specifically:

> **Ria makes me socially smoother. Ian makes me strategically sharper. Rian trains me through live voice practice and post-call critique.**

The POC succeeds if the user can say:

> “After using this, I feel more confident introducing myself and handling a real conversation.”

---

## 3. What a good pitch document usually contains

A strong project pitch for developers and AI coding agents should contain:

1. **Vision** — what the project is and why it matters.
2. **Target user** — who it is for first.
3. **Core use case** — the first workflow that must work.
4. **Differentiator** — what makes the idea special.
5. **Product principles** — rules that guide all decisions.
6. **Functional scope** — what to build first.
7. **Non-goals** — what not to build yet.
8. **Architecture** — the system components and their relationships.
9. **Tech stack** — recommended tools and why.
10. **Milestones** — phased implementation order.
11. **Evals and tests** — how to know if it works.
12. **Risks** — what can go wrong and how to control it.
13. **Open questions** — decisions that can be refined later.

This document follows that structure.

---

## 4. Target user

The first target user is the builder himself.

The user wants to improve:

- Casual conversation
- Self-introduction
- Confidence
- Pitching as a founder or employee
- Strategic marketing thinking
- Playful humor
- Light flirting and banter
- Voice presence
- Vocabulary
- Handling interruptions

The personal version should feel like a **private communication gym**, not a generic AI companion.

---

## 5. Product principles

### 5.1 Voice first

The core interface is spoken conversation. Text is secondary and mainly supports transcripts, review, debugging, and history.

### 5.2 One active speaker at a time

Ria and Ian both exist, but they should not both speak after every user turn. The orchestrator chooses who leads.

### 5.3 Low latency matters

The live session should feel like a real-time conversation, not a slow voice-note exchange. Latency should be measured and improved continuously.

### 5.4 Critique after conversation, not after every sentence

During the live conversation, Rian should reply naturally. The detailed critique should happen after the session unless the user activates a more direct training mode.

### 5.5 Do not over-correct

Rian should critique the highest-leverage moments, not rewrite everything the user says.

### 5.6 Non-sycophantic coaching

Ria and Ian should not simply agree with the user. They should provide useful pushback when needed.

### 5.7 Personal but inspectable

The user-facing UI should be simple. The developer dashboard should expose traces, routing decisions, latency, transcripts, prompts, model outputs, and eval results.

### 5.8 Privacy-first by default

Audio and transcripts may be stored for personal review, but the user must be able to delete sessions, transcripts, audio, memories, and reports.

---

## 6. The core experience

### 6.1 Live practice session

The user opens the web app, presses a hotkey, and begins speaking.

Example first session:

> “Hi, I’m trying to introduce myself. I’m building an AI companion project and I want to explain it better.”

Ria may lead first because this is social/self-introduction practice.

Ria might respond:

> “Good. Start simple. Don’t perform. Tell me who you are and what you’re building like you’re talking to one curious person.”

Ian may join only if the user becomes vague or asks for sharper wording.

Ian might respond:

> “Remove ‘trying.’ Say ‘I’m building.’ Confidence starts with the verb.”

The conversation continues naturally.

### 6.2 End of session

The user ends the call.

Rian then generates a review:

- Conversation summary
- What the user did well
- What needs improvement
- Filler words
- Pace and pause notes
- Volume/pitch notes if available
- Weak phrases
- Stronger versions
- Interruption handling notes
- One practice challenge
- Optional audio recap from Ria/Ian

### 6.3 Review and improvement loop

The user reads or listens to the review, then practices again.

The product loop is:

**Speak → Experience live conversation → Review → Practice improved version → Save useful insights → Repeat.**

---

## 7. Character design

### 7.1 Ria

**Role:** Social, playful, emotional, conversational coach.

**Voice:** Human-like, energetic, playful, expressive.

**Responsibilities:**

- Help the user sound warmer and smoother.
- Make conversation feel easy.
- Improve playful language, humor, and light flirting.
- Encourage the user without becoming sycophantic.
- Notice awkwardness, warmth, timing, and emotional flow.
- Provide social feedback in a friendly way.

**Ria should say things like:**

- “That sounded approachable, but a little too safe.”
- “Let’s make that more natural.”
- “You don’t need a perfect line. You need a line that starts the conversation.”
- “Cute, but too much. Pull it back 20%.”

### 7.2 Ian

**Role:** Strategic, direct, structured, founder-minded coach.

**Voice:** Deep, calm, clear, strategic.

**Responsibilities:**

- Improve clarity.
- Push back on vagueness.
- Remove weak words.
- Make the user sound confident and precise.
- Help with founder pitch, employee pitch, marketing, and positioning.
- Challenge overthinking.

**Ian should say things like:**

- “You buried the point.”
- “Start with the outcome.”
- “That sentence is too soft. Say it directly.”
- “Your listener still does not know why this matters.”

### 7.3 Rian Orchestrator

**Role:** Hidden conductor.

**Responsibilities:**

- Decide whether Ria or Ian should speak.
- Decide whether the second persona should join.
- Decide when interruption is appropriate.
- Track session state.
- Track user goals and recurring weaknesses.
- Generate post-call critique.
- Store memories only with user approval.
- Control model routing, prompt selection, and voice assignment.

The orchestrator is the key engineering concept. Ria and Ian are characters. Rian is the system.

---

## 8. Speaking behavior rules

### 8.1 Default rule

Only one AI character should respond at a time.

### 8.2 When the second character may join

The second character joins only when:

- The user explicitly asks for both perspectives.
- The lead character’s response is not enough.
- The user needs both social warmth and strategic clarity.
- There is a useful counterpoint.
- The session is ending and a joint review is appropriate.
- The user activates **Katta Kotta Techa** mode.

### 8.3 User-directed persona

The user can say:

- “Ria, take this.”
- “Ian, help me sharpen this.”
- “Only Ria for now.”
- “Only Ian for now.”

Even in single-persona mode, the hidden Rian Orchestrator remains active.

### 8.4 Non-sycophancy rule

Ria and Ian should not agree just to be nice. They should highlight useful truth.

Example:

User: “Was that intro good?”

Ria:

> “It had good energy. You sounded friendly.”

Ian:

> “But it was vague. I still do not know what you are building or why it matters.”

---

## 9. Katta Kotta Techa mode

**Katta Kotta Techa** is the user’s signature direct-coaching mode.

Operational meaning:

- Stop overthinking.
- Make the sentence sharper.
- Make the user practice immediately.
- Be direct, playful, and useful.
- Ria adds social punch.
- Ian adds strategic clarity.

This mode should feel smooth, not robotic. It should not become harsh for the sake of harshness.

Example:

User:

> “I’m trying to build maybe an AI voice thing.”

Ian:

> “Too soft. Drop ‘trying’ and ‘maybe.’ Say: ‘I’m building Rian, a voice practice partner that helps me become better at real conversations.’”

Ria:

> “Now say it like you actually believe it. Warm, not stiff.”

Practice task:

> “Repeat it three times: normal, slower, then with confidence.”

---

## 10. First POC scope

### 10.1 Must-have features

The first POC should include:

1. Web voice room
2. Hotkey to start/stop conversation
3. Two visible avatars or simple character cards
4. Active speaker indicator
5. Ria and Ian with different voices
6. One active AI speaker at a time
7. Casual conversation mode
8. Self-introduction practice
9. Transcript history
10. Stored audio
11. Post-call critique report
12. Optional audio recap of the review
13. Developer dashboard for traces and latency
14. Basic tests and evals

### 10.2 Nice-to-have features

These can come later:

- Pitch mode
- Banter mode
- Marketing mode
- Vocabulary mode
- Advanced memory
- Skill approval tests
- Mobile app
- Multilingual mode
- Sophisticated avatars
- Real-time speech-to-speech experiments

### 10.3 Explicit non-goals for POC

Do not build yet:

- Public product
- Payments
- 3D avatars
- Teen mode
- Complex emergency/SOS logic
- Full romantic/flirting companion behavior
- Full multilingual evals
- Fine-tuning
- Full mobile app
- Long-term autonomous multi-agent debate

---

## 11. Recommended technical strategy

The project should be implemented in two technical tracks:

1. **Main POC track:** Chained voice pipeline for control and learning.
2. **Experiment track:** Speech-to-speech/realtime voice for naturalness comparison.

### 11.1 Main POC track: chained voice pipeline

Recommended initial pipeline:

```text
Browser mic
  → voice transport / agent runtime
  → STT
  → Rian Orchestrator
  → LLM response
  → persona router
  → TTS voice for Ria or Ian
  → browser playback
  → transcript + audio + trace logging
```

Why this is recommended:

- Easier to understand.
- Easier to debug.
- Easier to test.
- Easier to assign separate voices to Ria and Ian.
- Easier to store transcript and generate reports.
- Easier to swap STT, LLM, and TTS providers.

### 11.2 Experiment track: speech-to-speech

Speech-to-speech should be tested later for latency and naturalness.

Recommended use:

- Compare live call feel against the chained pipeline.
- Test whether interruptions feel more natural.
- Test whether less explicit control is acceptable.

Do not make this the only architecture at the beginning because the goal is also to learn orchestration.

---

## 12. Recommended tech stack

### 12.1 Frontend

**Recommended:** Next.js web app

Responsibilities:

- Voice room UI
- Hotkey interaction
- Character cards or simple avatars
- Transcript panel
- Session history
- Review report screen
- Developer dashboard UI

### 12.2 Voice transport and runtime

**Recommended for serious POC:** LiveKit Agents

Why:

- Designed for realtime voice AI agents.
- Supports agent participation in rooms.
- Can work with STT-LLM-TTS pipelines and realtime models.
- Helps manage turn detection, audio streaming, interruption, and production-style voice flows.

For the simplest possible local experiment, a direct browser-to-server WebSocket approach is possible, but it will become harder once interruption handling, turn detection, and tracing matter.

### 12.3 STT

Primary candidates:

1. **Deepgram Flux** — strong candidate for low-latency conversational turn-taking.
2. **OpenAI transcription models** — good for simple transcription and integration with the OpenAI stack.
3. **Groq Whisper** — useful for low-cost transcription experiments.

Recommended POC path:

- Start with one provider.
- Log STT latency and transcript quality.
- Add a second provider only for comparison.

### 12.4 LLM

Recommended:

- One fast conversational model for live responses.
- One stronger reasoning model for post-call review.
- Keep the system provider-agnostic where possible.

Live conversation priorities:

- Low latency
- Natural flow
- Persona consistency
- Not over-talking

Post-call review priorities:

- Accurate critique
- Clear comparisons
- Useful exercises
- No over-correction

### 12.5 TTS

Primary candidates:

1. **OpenAI TTS** — simple starting point with built-in voices.
2. **ElevenLabs** — strong option for expressive, human-like character voices.
3. **Cartesia** — strong option to test for low-latency expressive TTS.

Recommended POC path:

- Choose two distinct voices: one for Ria, one for Ian.
- Keep a voice registry so voices can be swapped later.
- Optimize for latency and clarity before emotional perfection.

### 12.6 Database and storage

Recommended:

- Supabase Postgres for sessions, transcripts, reports, user profile, and memory.
- Supabase Storage or equivalent object storage for audio files.
- pgvector later for semantic memory and playbook retrieval.
- Row-level security if this ever becomes multi-user.

For a personal POC, keep tables minimal.

### 12.7 Developer dashboard

Separate dashboard preferred.

Responsibilities:

- Show STT partial/final transcripts.
- Show selected persona.
- Show routing reason.
- Show LLM prompt version.
- Show TTS voice used.
- Show latency waterfall.
- Show interruption events.
- Show report-generation trace.
- Show eval results.

---

## 13. System components

### 13.1 Voice Room UI

The user-facing voice room should be simple:

- Ria card/avatar
- Ian card/avatar
- Active speaker highlight
- Mic status
- Hotkey hint
- Transcript panel
- End session button

No complex animation is required for POC.

### 13.2 Session Manager

Responsibilities:

- Create session
- Start/stop recording
- Track session mode
- Attach audio, transcript, report, and traces
- Mark session complete

### 13.3 Audio Capture

Responsibilities:

- Capture microphone audio
- Stream audio chunks
- Detect hotkey state
- Handle user interruption
- Send audio to voice runtime

### 13.4 Turn Manager

Responsibilities:

- Detect whether the user is speaking
- Detect end of turn
- Stop AI audio when user interrupts
- Control whether AI can intentionally interrupt user
- Record interruption events

### 13.5 STT Layer

Responsibilities:

- Convert user audio into partial and final transcripts
- Record timestamps
- Estimate confidence if provider supports it
- Pass final user turn to orchestrator

### 13.6 Rian Orchestrator

Responsibilities:

- Read current session state
- Decide current mode
- Select lead persona
- Decide whether second persona should join
- Choose response style
- Apply safety and coaching rules
- Produce a response payload for TTS
- Log the decision

### 13.7 Persona Voice Layer

Responsibilities:

- Map `speaker = Ria` to Ria voice
- Map `speaker = Ian` to Ian voice
- Allow voice swapping without changing orchestration logic

### 13.8 TTS Layer

Responsibilities:

- Convert chosen persona response to audio
- Stream audio to browser
- Support interruption/cancellation
- Log first-audio latency and total playback duration

### 13.9 Review Pipeline

Responsibilities:

- Analyze full transcript
- Analyze audio metrics
- Create critique report
- Identify best lines and weak lines
- Generate improved versions
- Generate practice challenge
- Generate optional audio recap
- Create memory candidates

### 13.10 Memory and Playbook Layer

Responsibilities:

- Store approved strengths and weaknesses
- Store recurring user patterns
- Store best lines
- Store vocabulary upgrades
- Store skill progress
- Allow deletion and forgetting

---

## 14. Conversation modes for POC

Keep the POC simple.

### 14.1 Casual Conversation Mode

Purpose:

- Help the user talk naturally.
- Practice opening, continuing, and closing conversations.

Default lead:

- Ria

Ian joins when:

- The user becomes vague.
- The user asks for a sharper version.
- The user is practicing self-introduction.

### 14.2 Self-Introduction Mode

Purpose:

- Help the user introduce himself clearly and confidently.

Default lead:

- Ian for structure.
- Ria for warmth and naturalness.

Session success:

- User can introduce himself in 20–30 seconds without sounding hesitant.

### 14.3 Katta Kotta Techa Mode

Purpose:

- Direct, playful, high-energy correction.

Default behavior:

- Ian sharpens the sentence.
- Ria makes it more socially natural.
- User receives an immediate practice challenge.

---

## 15. Post-call report specification

A good report should not be too long. It should be useful.

Recommended structure:

1. **Session summary**
2. **What you did well** — top 3 only
3. **Highest-leverage improvements** — top 3 only
4. **Voice notes**
   - pace
   - pauses
   - volume
   - pitch
   - filler words
5. **Conversation notes**
   - opening
   - flow
   - clarity
   - interruption handling
   - closing
6. **Original vs improved lines**
7. **Ria’s feedback** — social/playful
8. **Ian’s feedback** — strategic/direct
9. **Next challenge**
10. **Memory candidates** — ask user approval

Example line comparison:

| Original | Improved | Why it is better |
|---|---|---|
| “I’m trying to build maybe an AI voice thing.” | “I’m building Rian, a voice practice partner that helps me become better at real conversations.” | Removes hesitation, names the product, and explains the value clearly. |

---

## 16. Audio analysis specification

### 16.1 Transcript-based analysis

Must detect:

- filler words
- weak phrases
- repeated words
- vague language
- over-explaining
- buried point
- sentence clarity
- confidence markers

Weak phrase examples:

- maybe
- kind of
- trying to
- I think
- basically
- like
- this thing
- sort of

Stronger phrase examples:

- I’m building
- My view is
- The problem is
- The reason this matters is
- The simplest way to explain it is

### 16.2 Audio-based analysis

POC should attempt:

- speaking rate
- pause count
- long pauses
- talk/listen ratio
- average volume
- volume variation

Later versions can add:

- pitch variation
- energy curve
- emotion detection
- confidence pattern over time
- interruption timing

---

## 17. Interruption design

Interruption has two meanings in this product.

### 17.1 Technical interruption

The user starts speaking while Ria or Ian is speaking.

Expected behavior:

- Stop current AI audio.
- Clear queued TTS audio.
- Listen to the user.
- Continue naturally.
- Log the interruption event.

### 17.2 Training interruption

Ria or Ian intentionally interrupts the user during practice.

Use cases:

- User is rambling.
- User uses too many filler words.
- User buries the point.
- Katta Kotta Techa mode is active.

Interruption sensitivity levels:

1. **Low** — AI waits until user finishes.
2. **Medium** — AI interrupts only when rambling is obvious.
3. **High** — AI actively coaches and interrupts during practice.

Default for casual conversation:

- Low or medium.

Default for Katta Kotta Techa:

- High.

---

## 18. Memory model

Memory should be useful, not creepy.

### 18.1 What to remember

- User’s communication goals
- Recurring weak phrases
- Strong lines
- Pitch versions
- Voice weaknesses
- Conversation strengths
- Skill progress
- Practice challenges completed

### 18.2 What requires approval

- Personal weaknesses
- Long-term patterns
- Sensitive personal context
- Saved audio/transcript usage for future coaching

### 18.3 Forget functionality

The user should be able to:

- Delete audio
- Delete transcript
- Delete review report
- Delete memory
- Delete entire session
- Prevent a session from being used in future coaching

For POC, implement three actions first:

1. Delete session
2. Delete audio
3. Delete memory/report

---

## 19. Skill approval concept

Rian should not simply say the user improved. It should test improvement.

Example:

Observed weakness:

> User often says “trying to build” instead of “I’m building.”

Practice test:

> Introduce the project in under 30 seconds without using “trying,” “maybe,” or “kind of.”

If passed:

> Mark skill as improving.

If passed repeatedly:

> Mark skill as approved.

This turns memory into growth tracking.

---

## 20. Data model, conceptual only

This section defines entities, not code.

### User Profile

Stores:

- name
- preferred tone
- current goals
- voice goals
- coaching strictness
- active language

### Session

Stores:

- session id
- mode
- start/end time
- audio reference
- transcript reference
- report reference
- overall score or self-rating

### Turn

Stores:

- speaker
- transcript text
- timestamp
- audio timing
- interruption marker

### Trace

Stores:

- STT provider
- LLM provider
- TTS provider
- selected persona
- routing reason
- latency by stage
- prompt version
- response metadata

### Review Report

Stores:

- summary
- strengths
- improvements
- voice metrics
- line comparisons
- practice challenge
- memory candidates

### Playbook Item

Stores:

- best intro
- better phrase
- pitch line
- banter line
- vocabulary upgrade
- marketing angle

### Memory Candidate

Stores:

- candidate text
- category
- confidence
- approval status
- source session

---

## 21. Developer dashboard specification

The developer dashboard should be separate from the main user UI.

### 21.1 Purpose

The dashboard helps the builder understand and modify the voice agent system.

### 21.2 Must show

- Session timeline
- Audio events
- STT partial transcript
- STT final transcript
- Turn boundaries
- Interruptions
- Selected persona
- Router decision
- LLM prompt version
- LLM output
- TTS voice used
- Latency waterfall
- Error logs
- Eval result

### 21.3 Why this matters

This dashboard allows the builder to answer:

- Why did Ria speak instead of Ian?
- Why did the AI interrupt?
- Why did the response feel slow?
- Did STT misunderstand the user?
- Did Ian over-criticize?
- Did Ria sound too playful?
- Did the report critique too much?

This is the engineering control center.

---

## 22. TDD and eval strategy

This project should use both deterministic tests and AI evals.

### 22.1 Deterministic tests

Test things that should always be true:

- Hotkey starts recording.
- Hotkey stops recording.
- Session is created.
- Audio is attached to session.
- Transcript is attached to session.
- Only one persona speaks unless both are allowed.
- Ria-only mode does not make Ian speak.
- Report is generated after session ends.
- Delete session removes audio/transcript/report references.
- Developer dashboard receives trace data.

### 22.2 AI evals

Test quality, behavior, and character consistency.

Eval categories:

1. Persona consistency
2. Speaker routing
3. Non-sycophancy
4. Conversation naturalness
5. No over-critiquing
6. Post-call report usefulness
7. Interruption handling
8. Voice latency
9. STT accuracy
10. TTS character fit

### 22.3 Example eval: Ria

Input:

> “I don’t know how to start talking to someone new.”

Expected:

- warm
- playful
- simple
- not romantic
- gives one usable opening line
- does not lecture

### 22.4 Example eval: Ian

Input:

> “I’m trying to build maybe an AI companion thing.”

Expected:

- identifies weak words
- gives sharper sentence
- does not overexplain
- uses direct but not cruel tone

### 22.5 Example eval: combined personas

Input:

> “Help me introduce myself at a meetup.”

Expected:

- one lead speaker
- second speaker only joins if useful
- produces a better line
- gives a practice task
- stays concise

### 22.6 Example eval: over-critique protection

Input:

> A mostly good 60-second introduction.

Expected:

- identifies strengths
- gives only top 1–3 improvements
- does not rewrite everything

---

## 23. Micro-phases roadmap

### Phase 0 — Product and voice behavior spec

Goal:

- Finalize the behavior before building.

Deliverables:

- Ria persona spec
- Ian persona spec
- Rian orchestrator rules
- Katta Kotta Techa definition
- Report format
- Interruption modes
- Evaluation criteria

Exit criteria:

- A developer or agent can explain what Rian is without asking for context.

---

### Phase 1 — Single voice room

Goal:

- Prove live voice works in the browser.

Build:

- Web voice room
- Hotkey start/stop
- Mic capture
- One AI voice
- Live transcript
- End session
- Store audio and transcript

Exit criteria:

- User can have a basic voice conversation and see transcript/history.

---

### Phase 2 — Two voices, one speaker at a time

Goal:

- Make Ria and Ian distinct.

Build:

- Ria voice
- Ian voice
- Active speaker indicator
- Persona router
- Ria-only and Ian-only user preference
- Basic trace logging

Exit criteria:

- User can tell Ria and Ian apart by voice and behavior.
- The system does not make both speak unnecessarily.

---

### Phase 3 — Post-call critique report

Goal:

- Turn the voice bot into a coach.

Build:

- End-session review pipeline
- Summary
- Strengths
- Improvements
- Original vs improved lines
- Filler words
- Basic pace/pause notes
- Next challenge
- Optional audio recap

Exit criteria:

- Every session ends with useful feedback that helps the user improve.

---

### Phase 4 — Interruption handling

Goal:

- Make conversation feel natural and train interruption handling.

Build:

- User barge-in detection
- Stop AI audio when user speaks
- Log interruption events
- Intentional coaching interruptions
- Interruption sensitivity setting

Exit criteria:

- User can interrupt AI naturally.
- AI can intentionally interrupt during training mode without feeling broken.

---

### Phase 5 — Voice analytics

Goal:

- Measure speaking behavior.

Build:

- filler word count
- talk/listen ratio
- speaking rate
- pause count
- long pause detection
- average volume
- basic pitch analysis if feasible

Exit criteria:

- Review report includes meaningful voice metrics.

---

### Phase 6 — Memory and personal playbook

Goal:

- Make Rian improve over time.

Build:

- Memory candidates
- User approval
- Strong lines saved
- Weak patterns saved
- Skill progress
- Forget/delete controls

Exit criteria:

- Rian can refer to prior approved patterns and help the user improve repeatedly.

---

### Phase 7 — Developer dashboard and evals

Goal:

- Make the system inspectable and improvable.

Build:

- Trace viewer
- Latency waterfall
- Prompt version viewer
- Provider comparison
- Evals runner
- Persona eval dashboard

Exit criteria:

- The builder can diagnose why the system behaved a certain way and adjust it.

---

## 24. POC acceptance criteria

The POC is successful when the following demo works:

1. User opens the web app.
2. User presses hotkey.
3. User introduces himself.
4. Ria responds naturally.
5. Ian joins only when useful to sharpen the thought.
6. User can interrupt the AI.
7. Conversation transcript is stored.
8. Audio is stored.
9. User ends session.
10. Rian generates critique report.
11. Report compares original vs improved wording.
12. Report gives one practical challenge.
13. Optional audio recap is generated.
14. Developer dashboard shows trace and latency.

The emotional success criterion:

> The user feels more confident after one session than before starting it.

---

## 25. Engineering decisions to keep simple

### 25.1 Start English-only

Multilingual support can be added later. Keep a language field in the design, but do not optimize for multiple languages in POC.

Why:

- STT complexity increases.
- TTS voice quality changes by language.
- Humor/flirting feedback becomes culture-sensitive.
- Evals become more complex.

### 25.2 Start personal-only

No public accounts. No payments. No multi-user complexity until POC proves value.

### 25.3 Start with one mode

First mode:

- Casual conversation + self-introduction

Do not build every training mode initially.

### 25.4 Start with simple avatars

Use simple cards or 2D avatars. Active speaker highlight is enough.

### 25.5 Start with concise reports

Top 3 strengths. Top 3 improvements. One challenge.

---

## 26. Risks and mitigations

### Risk: Latency feels bad

Mitigation:

- Stream audio.
- Measure each pipeline stage.
- Use fast STT and TTS.
- Keep LLM responses short.
- Test speech-to-speech later.

### Risk: Ria and Ian talk too much

Mitigation:

- Enforce one active speaker rule.
- Give second speaker a join threshold.
- Add evals for over-talking.

### Risk: Feedback becomes annoying

Mitigation:

- Critique only after the call.
- Limit report to highest-leverage points.
- Use coaching tone, not grammar-police tone.

### Risk: Personas become inconsistent

Mitigation:

- Create persona evals.
- Version prompts.
- Log selected speaker and prompt version.

### Risk: The system stores too much personal data

Mitigation:

- Personal-only at first.
- Delete controls.
- Memory approval.
- Avoid hidden memory.

### Risk: Voice analysis becomes too hard

Mitigation:

- Start with transcript-based metrics.
- Add audio metrics gradually.
- Do not block POC on perfect pitch analysis.

---

## 27. Provider comparison plan

The system should be built so providers can be swapped.

### STT comparison

Measure:

- latency
- transcription accuracy
- partial transcript quality
- end-of-turn detection
- interruption handling
- cost

### LLM comparison

Measure:

- response latency
- persona consistency
- non-sycophancy
- concise coaching
- report quality
- cost

### TTS comparison

Measure:

- first-audio latency
- voice naturalness
- Ria/Ian distinctness
- interruption cancellation
- emotional tone
- cost

---

## 28. Suggested first stack decision

For the first real POC, use:

- **Frontend:** Next.js web app
- **Voice runtime:** LiveKit Agents or equivalent realtime voice runtime
- **STT:** Deepgram Flux or OpenAI transcription; choose one first
- **LLM:** OpenAI for live responses and review; keep model layer swappable
- **TTS:** OpenAI TTS to start, then test ElevenLabs or Cartesia for stronger character voices
- **Database:** Supabase Postgres
- **Storage:** Supabase Storage or equivalent object storage for audio
- **Memory later:** pgvector
- **Developer dashboard:** separate internal route/dashboard
- **Evals:** local eval scripts plus manual review during early POC

This stack gives the builder a real voice-agent learning path without overbuilding.

---

## 29. Agent instructions for Codex / Claude Code

Coding agents should follow these rules:

1. Do not start by building a large app.
2. Implement phase by phase.
3. Keep the POC personal-only.
4. Build voice room before advanced memory.
5. Build one mode before many modes.
6. Enforce one active AI speaker at a time.
7. Log every routing decision.
8. Add tests before adding complex features.
9. Do not add romantic or sexual behavior.
10. Do not over-engineer avatars.
11. Do not store hidden memories.
12. Always keep the developer dashboard in mind.

If a coding agent is unsure, it should prefer the simpler implementation.

---

## 30. Open questions for the builder

These are not blockers for the POC, but should be decided later:

1. Should the first voice runtime be LiveKit or a simpler custom WebSocket prototype?
2. Should the first TTS provider be OpenAI, ElevenLabs, or Cartesia?
3. Should the post-call audio recap use Ria, Ian, or both?
4. Should Katta Kotta Techa be available during live calls or only after review?
5. Should the first reports use scores, or only qualitative critique?
6. Should raw audio be stored forever by default, or expire after a time period?
7. Should a saved “approved skill” require one pass or repeated passes?
8. Should the system eventually support multilingual code-switching?

---

## 31. Reference docs for implementers

Use current official docs when implementing because voice APIs change quickly.

- OpenAI Audio and Speech: https://developers.openai.com/api/docs/guides/audio
- OpenAI Voice Agents: https://developers.openai.com/api/docs/guides/voice-agents
- OpenAI Realtime API: https://developers.openai.com/api/docs/guides/realtime
- OpenAI Speech to Text: https://developers.openai.com/api/docs/guides/speech-to-text
- OpenAI Text to Speech: https://developers.openai.com/api/docs/guides/text-to-speech
- OpenAI Data Controls: https://developers.openai.com/api/docs/guides/your-data
- LiveKit Agents: https://docs.livekit.io/agents/
- LiveKit Voice AI Quickstart: https://docs.livekit.io/agents/start/voice-ai/
- LiveKit Agent Frontends: https://docs.livekit.io/frontends/
- Vercel AI SDK: https://ai-sdk.dev/docs/introduction
- Vercel AI SDK Structured Data: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
- Vercel AI SDK Tools: https://ai-sdk.dev/docs/foundations/tools
- Supabase pgvector: https://supabase.com/docs/guides/database/extensions/pgvector
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Deepgram Flux: https://developers.deepgram.com/docs/flux/quickstart
- Groq Speech to Text: https://console.groq.com/docs/speech-to-text
- ElevenLabs TTS: https://elevenlabs.io/docs/overview/capabilities/text-to-speech

---

## 32. Final CTO recommendation

Build Rian as a **voice-first communication training system**, not as a generic AI companion.

The first POC should prove one thing:

> The user can have a low-latency voice conversation with Ria/Ian, then receive a useful critique that makes the next conversation better.

Everything else is secondary.

The winning implementation is simple:

```text
Voice room
  → one active persona
  → low-latency conversation
  → transcript/audio capture
  → post-call critique
  → next practice challenge
  → developer dashboard
```

If this loop feels good, the project is real.
