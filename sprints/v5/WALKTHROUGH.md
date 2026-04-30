# Sprint v5 - Walkthrough

## Summary

Sprint v5 made the live conversation flow usable from the browser instead of leaving it as an engineering-only LiveKit panel. The user can now see the exact worker command for the selected room, join the browser room, use visible LiveKit mic controls, and understand that local mock practice is separate from the real LiveKit/xAI voice path.

The sprint does not add transcript persistence, post-call critique, or live Ria/Ian switching. It focuses on making the working v4 provider path discoverable and testable.

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────────┐
│ Browser                                                      │
│                                                              │
│ LiveKitConnectPanel                                          │
│ ├─ live guidance from helper                                 │
│ ├─ room + participant inputs                                 │
│ ├─ exact worker command                                      │
│ ├─ Join / Leave browser room                                 │
│ └─ LiveKitRoom                                               │
│    ├─ RoomAudioRenderer                                      │
│    └─ ControlBar mic controls                                │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ LiveKit Room                                                 │
│ ├─ Browser participant with mic                              │
│ └─ rian-agent worker from npm run agent:connect              │
└──────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### `sprints/v5/PRD.md`

**Purpose**: Defines the sprint scope for the usable live conversation surface.

**Key Sections**:
- Sprint Overview
- Goals
- User Stories
- Technical Architecture
- Out of Scope
- Dependencies

**How it works**:

The PRD keeps v5 focused on the UI and helper logic needed to start a real conversation. It explicitly defers bigger product loops like Supabase persistence and post-call critique.

### `sprints/v5/TASKS.md`

**Purpose**: Tracks the v5 task checklist and verification notes.

**Key Items**:
- Task 1 - live conversation helpers and tests
- Task 2 - LiveKit panel upgrade
- Task 3 - README flow update
- Task 4 - walkthrough

**How it works**:

The task file records exactly what was completed and why. This keeps the sprint bounded: the UI is easier to operate, but it does not claim to be a full coaching loop yet.

### `src/lib/livekit/live-conversation.ts`

**Purpose**: Centralizes UI helper logic for live conversation guidance and worker command generation.

**Key Functions**:
- `normalizeRoomNameForCommand()` - trims room names and falls back to `rian-room`.
- `makeAgentConnectCommand()` - creates the exact terminal command for the selected room.
- `getLiveConversationGuidance()` - returns status-specific user guidance.

**How it works**:

The helper prevents the README, UI, and tests from drifting. The same room name shown in the browser becomes the command used to start the worker:

```ts
export function makeAgentConnectCommand(roomName: string) {
  const normalizedRoomName = normalizeRoomNameForCommand(roomName);

  return `npm run agent:connect -- --room ${shellQuoteIfNeeded(normalizedRoomName)}`;
}
```

Room names with spaces are shell-quoted, while simple room names remain easy to read.

### `src/lib/livekit/live-conversation.test.ts`

**Purpose**: Tests the live conversation helper behavior.

**Key Tests**:
- blank room names fall back to `rian-room`
- simple room names generate the expected worker command
- room names with spaces are quoted
- idle guidance tells the user to join the browser room first
- connected guidance includes the selected room name
- error guidance points the user back to LiveKit/token checks

**How it works**:

These are pure unit tests. They do not call LiveKit or xAI, but they protect the workflow copy that the user depends on when starting a live conversation.

### `src/components/livekit-connect-panel.tsx`

**Purpose**: Upgrades the LiveKit connection panel into the main live conversation panel.

**Key Components/Behavior**:
- `LiveKitConnectPanel` - manages token request, room state, guidance, and LiveKit room rendering.
- `ControlBar` - LiveKit-provided microphone/call controls.
- `RoomAudioRenderer` - plays remote agent audio.
- `makeAgentConnectCommand()` - renders the exact worker command.
- `getLiveConversationGuidance()` - renders state-specific next steps.

**How it works**:

The panel now walks the user through the live flow: join the browser room, run the worker command, then use mic controls. The button labels were changed from generic `Connect`/`Disconnect` to `Join browser room` and `Leave room`.

After a token is created, `LiveKitRoom` renders both audio playback and call controls:

```tsx
<LiveKitRoom audio connect serverUrl={tokenResponse.url} token={tokenResponse.token}>
  <RoomAudioRenderer />
  <div className="livekit-call-controls">
    <ControlBar controls={{ screenShare: false, chat: false }} />
  </div>
</LiveKitRoom>
```

This makes the microphone state visible instead of relying on browser permission prompts alone.

### `src/app/globals.css`

**Purpose**: Styles the upgraded live conversation panel.

**Key Classes**:
- `.live-status`
- `.livekit-steps`
- `.worker-command-card`
- `.livekit-call-controls`

**How it works**:

The styles create a clearer call setup sequence: a status pill, numbered steps, a dark terminal command block, and a bordered call-control area. The UI stays aligned with the existing Rian visual language rather than introducing a separate generic LiveKit look.

### `README.md`

**Purpose**: Documents the browser-led live conversation flow.

**Key Sections**:
- `Have A Live Conversation`
- `Current Worker Limitations`
- updated sprint summary

**How it works**:

The README now mirrors what the UI shows: start the Next app, open the browser, join the room, copy the command from the panel, run it in a second terminal, use mic controls, and speak.

### `sprints/v5/WALKTHROUGH.md`

**Purpose**: This sprint review document.

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

This walkthrough gives the next sprint enough context to build persistence, live transcript surfaces, or persona routing without rediscovering the v5 UI decisions.

## Data Flow

1. User starts the app with `npm run dev`.
2. User opens `/` and sees the Live conversation panel.
3. The panel shows a room name, participant name, and exact worker command.
4. User clicks `Join browser room`.
5. The app requests a LiveKit token from `/api/livekit-token`.
6. `LiveKitRoom` connects the browser to the room and renders `ControlBar`.
7. User runs the displayed `npm run agent:connect -- --room ...` command.
8. The v4 worker joins the same LiveKit room as `rian-agent`.
9. User unmutes through LiveKit controls and speaks to Rian.

The mock practice UI below remains separate and usable. It is still valuable for deterministic routing and transcript tests that do not require provider calls.

## Test Coverage

- Unit: 6 tests in `src/lib/livekit/live-conversation.test.ts` cover room normalization, shell-safe command generation, and status-specific guidance.
- Existing LiveKit/token tests still cover token request validation and env parsing.
- Typecheck passed with `npm run lint`.
- Full test suite passed with 43 tests after v5.
- Production build passed with `npm run build`.

No browser E2E test verifies actual audio yet. The manual v4 smoke test already proved that LiveKit and xAI can connect and generate audio, but v5 still needs a human browser check to confirm audible playback and mic behavior.

## Security Measures

- The UI shows a command only; it does not expose LiveKit or xAI secrets.
- Token creation still happens through the server route.
- Room command generation quotes room names that require shell quoting.
- The UI warns that live provider mode is separate from local mock practice.
- No hidden memory, transcript persistence, or audio storage was added.

## Known Limitations

- The browser now has mic controls, but there is no custom live transcript timeline for xAI/LiveKit transcripts.
- The UI cannot start the worker process for the user; it can only show the command.
- Ria is still the initial live voice; Ian switching is not live yet.
- Post-call critique is not implemented.
- Supabase persistence is not wired.
- Developer dashboard traces are not emitted from the live worker yet.

## What's Next

Sprint v6 should add either live transcript/trace visibility or live persona routing. The highest-leverage next slice is probably trace visibility: show selected room, worker status expectations, transcript events, and basic latency markers so we can debug real conversations before building post-call critique.

After that, add Ria/Ian routing inside the live worker, then persist sessions and generate the first post-call review.
