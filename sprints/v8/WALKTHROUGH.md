# Sprint v8 - Walkthrough

## Summary

Sprint v8 made live worker routing visible in the browser. When the worker starts or switches between Ria and Ian, it publishes a lightweight trace event over the LiveKit data channel, and the debug panel renders the selected persona, routing reason, active voice, and timestamp.

The traces are still ephemeral browser state. They are not persisted, and they are not yet part of a full developer dashboard.

## Architecture Overview

```text
RianPersonaAgent
  ├─ worker_started / persona_route event
  ├─ encodeWorkerTrace()
  └─ ctx.room.localParticipant.publishData(topic: rian.trace)
        │
        ▼
LiveConversationDebug
  ├─ useDataChannel("rian.trace")
  ├─ decodeWorkerTrace()
  └─ Worker routing column
```

## Files Created/Modified

### `src/lib/livekit/worker-trace.ts`

**Purpose**: Defines the worker trace wire format.

**Key Exports**:
- `RIAN_TRACE_TOPIC` - the LiveKit data topic, `rian.trace`.
- `WorkerTraceEvent` - trace payload shape.
- `encodeWorkerTrace()` - serializes a trace event.
- `decodeWorkerTrace()` - parses and validates a trace payload.

**How it works**:

The payload includes trace type, persona, reason, voice, and timestamp. The decoder rejects invalid JSON, unknown trace types, and invalid persona ids before UI rendering.

### `src/lib/livekit/worker-trace.test.ts`

**Purpose**: Tests the worker trace wire format.

**Key Tests**:
- topic name is stable
- trace payload round trip works
- invalid JSON returns `null`
- unknown trace types return `null`
- invalid persona ids return `null`

**How it works**:

These tests protect the data-channel contract between the worker and browser.

### `src/agent/agent.ts`

**Purpose**: Publishes worker routing trace events.

**Key Changes**:
- Adds a `publishTrace()` callback inside the worker entrypoint.
- Publishes `worker_started` after session start.
- Publishes `persona_route` before a Ria/Ian handoff.
- Passes the trace publisher into `RianPersonaAgent`.

**How it works**:

Trace events are sent reliably over the LiveKit data channel:

```ts
await ctx.room.localParticipant?.publishData(
  encodeWorkerTrace({
    type: reason === "Worker started." ? "worker_started" : "persona_route",
    personaId,
    reason,
    voice,
    createdAt: new Date().toISOString(),
  }),
  { reliable: true, topic: RIAN_TRACE_TOPIC },
);
```

### `src/agent/agent.test.ts`

**Purpose**: Keeps worker construction covered after adding the trace publisher seam.

**Key Change**:
- Verifies persona agents can accept a routing trace publisher.

### `src/components/live-conversation-debug.tsx`

**Purpose**: Renders browser-visible worker routing traces.

**Key Changes**:
- Subscribes to `useDataChannel(RIAN_TRACE_TOPIC, ...)`.
- Decodes trace payloads.
- Shows a `Worker routing` column.

**How it works**:

The panel keeps the latest eight worker traces in local state. Each row shows persona, reason, voice, and timestamp.

### `src/app/globals.css`

**Purpose**: Styles the new worker routing trace column.

**Key Changes**:
- Debug columns expand to three columns on desktop.
- Worker trace rows get a subtle Ria-colored treatment.
- Mobile layout collapses the debug columns to one column.

### `README.md`

**Purpose**: Documents browser-visible worker routing traces.

**Key Section**:
- `Worker Routing Traces`

**How it works**:

The README explains what the Worker routing column shows and clarifies that traces are not persisted yet.

### `sprints/v8/PRD.md`

**Purpose**: Defines the browser-visible routing trace sprint.

### `sprints/v8/TASKS.md`

**Purpose**: Tracks v8 implementation status.

### `sprints/v8/WALKTHROUGH.md`

**Purpose**: This sprint review document.

## Data Flow

1. Worker starts as Ria.
2. Worker publishes a `worker_started` trace with persona `ria`, reason, voice, and timestamp.
3. User asks for Ria or Ian explicitly.
4. `RianPersonaAgent` chooses the requested persona.
5. Worker publishes a `persona_route` trace before handoff.
6. Browser debug panel receives the `rian.trace` data message.
7. UI decodes the trace and renders it in the Worker routing column.

## Test Coverage

- Unit: 5 tests for worker trace encoding/decoding.
- Existing persona routing and worker construction tests still pass.
- Full suite passed after v8.
- Typecheck and production build pass.
- Semgrep passes.

## Security Measures

- Trace events include persona, reason, voice, and timestamp only.
- No secrets are sent over the data channel.
- Traces are ephemeral and not persisted.
- Malformed trace payloads are ignored by the browser decoder.

## Known Limitations

- Trace events are browser-local and disappear on refresh.
- No latency measurements are published yet.
- No durable developer dashboard exists yet.
- Post-call critique and Supabase persistence are still absent.
- The browser cannot force-start the worker; it still shows the command.

## What's Next

Sprint v9 should persist sessions and transcripts, or add a minimal post-call review if transcript capture proves reliable. The safer next step is Supabase persistence for session metadata, transcript rows, and worker traces so the critique generator has durable inputs.
