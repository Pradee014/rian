# Sprint v7 - Walkthrough

## Summary

Sprint v7 made Ria and Ian real live worker profiles. The LiveKit/xAI worker still runs as one process and preserves one active speaker, but it can now hand off between Ria and Ian agent profiles when the user explicitly asks for a persona.

Ria uses the configured Ria xAI voice and warm social instructions. Ian uses the configured Ian xAI voice and direct strategic instructions. This is explicit routing, not autonomous multi-agent debate.

## Architecture Overview

```text
User speech
  -> xAI realtime transcription
  -> RianPersonaAgent.onUserTurnCompleted()
  -> chooseLivePersona()
  -> AgentSession.updateAgent(Ria or Ian)
  -> selected persona replies through xAI realtime
```

## Files Created/Modified

### `src/agent/persona-routing.ts`

**Purpose**: Detects explicit live Ria/Ian routing phrases.

**Key Functions**:
- `chooseLivePersona()` - returns the selected persona and reason.

**How it works**:

The helper recognizes direct phrases such as `Ria, ...`, `Ian, ...`, `Only Ria`, and `Only Ian`. If no explicit route exists, it keeps the current persona.

### `src/agent/persona-routing.test.ts`

**Purpose**: Tests deterministic live persona routing.

**Key Tests**:
- explicit Ria routes to Ria
- explicit Ian routes to Ian
- only-Ria/only-Ian routes work
- no explicit route keeps current persona
- decisions never include a second persona

**How it works**:

The tests enforce the one-active-speaker rule at the routing helper level.

### `src/agent/instructions.ts`

**Purpose**: Generates persona-specific live instructions.

**Key Changes**:
- `buildRianAgentInstructions()` now accepts a `leadPersona`.
- Ria instructions emphasize warmth and social naturalness.
- Ian instructions emphasize directness, clarity, and founder-minded pushback.

**How it works**:

The shared Rian safety/product rules remain in every prompt, while a lead-persona line changes the active response style.

### `src/agent/agent.ts`

**Purpose**: Creates persona-specific LiveKit agents and performs live handoff.

**Key Functions/Classes**:
- `createRealtimeModelOptions()` - selects Ria or Ian xAI voice.
- `RianPersonaAgent` - LiveKit `voice.Agent` subclass with handoff logic.
- `createRianVoiceAgent()` - creates a Ria or Ian profile.

**How it works**:

`RianPersonaAgent.onUserTurnCompleted()` inspects the user message text before generation. If the user explicitly asks for the other persona, the agent calls `this.session.updateAgent()` with the selected persona profile.

```ts
const decision = chooseLivePersona(newMessage.textContent, this.personaId);

if (decision.personaId !== this.personaId) {
  this.session.updateAgent(createRianVoiceAgent(this.config, decision.personaId));
}
```

The new persona profile includes its own xAI realtime model configured with that persona's voice.

### `src/agent/agent.test.ts`

**Purpose**: Tests worker construction for persona-specific agents.

**Key Tests**:
- Ria model options use `XAI_RIA_VOICE`
- Ian model options use `XAI_IAN_VOICE`
- Ria agent gets Ria instructions
- Ian agent gets Ian instructions
- worker still exports a LiveKit entrypoint

**How it works**:

The tests remain no-network. They verify construction seams without opening LiveKit or xAI connections.

### `src/agent/config.test.ts`

**Purpose**: Keeps config and instruction behavior covered.

**Key Change**:
- Confirms default Rian instructions include the Ria lead line.

### `README.md`

**Purpose**: Documents live persona routing.

**Key Section**:
- `Live Persona Routing`

**How it works**:

The README lists supported phrases and clarifies that asking for both personas still results in one active speaker for now.

### `sprints/v7/PRD.md`

**Purpose**: Defines the live persona routing sprint.

### `sprints/v7/TASKS.md`

**Purpose**: Tracks v7 implementation and verification status.

### `sprints/v7/WALKTHROUGH.md`

**Purpose**: This sprint review.

## Data Flow

1. Worker starts as Ria.
2. User speaks in the LiveKit room.
3. xAI realtime produces user input for the agent session.
4. `RianPersonaAgent.onUserTurnCompleted()` receives the completed user turn.
5. `chooseLivePersona()` checks explicit routing phrases.
6. If the requested persona differs, `AgentSession.updateAgent()` hands off to the new persona profile.
7. The selected persona replies through xAI realtime with that persona's instructions and voice.

## Test Coverage

- Unit: 6 tests for live persona routing.
- Worker construction: tests for Ria/Ian voice options and instructions.
- Full test suite passed after v7.
- Typecheck and production build pass.
- Semgrep passes.

## Security Measures

- No secrets are exposed.
- No persistence or hidden memory was added.
- Routing is explicit and local to the active session.
- The worker still enforces one active persona per turn.

## Known Limitations

- Browser debug panel does not yet show selected persona or routing reason from the worker.
- Handoff depends on the realtime transcript text reaching `onUserTurnCompleted()`.
- The implementation is explicit-route only; it does not infer subtle persona switches yet.
- Asking for both personas does not produce two responses.
- No post-call critique or persistence yet.

## What's Next

Sprint v8 should expose worker routing traces to the browser debug panel. The next useful debug rows are selected persona, routing reason, active voice, and first-audio latency. After that, persist transcripts and generate the first post-call critique.
