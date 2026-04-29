# Sprint v3 - Walkthrough

## Summary

Sprint v3 added the first real LiveKit room scaffold to Rian. The browser can request a server-generated LiveKit participant token, connect to a LiveKit room through LiveKit's React components, and keep the local mock practice flow available while the server-side xAI realtime agent remains a future sprint.

The sprint intentionally leaves `XAI_REALTIME_MODEL` blank so the LiveKit xAI plugin can use its default model. xAI voice selection is represented through Ria/Ian env placeholders, but no xAI worker is run yet.

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────────┐
│ Browser                                                      │
│                                                              │
│ VoiceRoom                                                    │
│ ├─ LiveKitConnectPanel                                       │
│ │  ├─ POST /api/livekit-token                                │
│ │  └─ LiveKitRoom + RoomAudioRenderer                        │
│ ├─ Local mock recording controls                             │
│ ├─ TranscriptPanel                                           │
│ └─ TracePreview                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Next.js API Route                                            │
│ /api/livekit-token                                           │
│ ├─ parseLiveKitTokenRequest                                  │
│ ├─ getLiveKitServerConfig                                    │
│ └─ livekit-server-sdk AccessToken                            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ LiveKit Room                                                 │
│ Browser participant now                                      │
│ xAI realtime agent worker joins in next sprint               │
└──────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### `.env.example`

**Purpose**: Documents environment variables needed by the app and upcoming providers.

**Key Variables**:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `NEXT_PUBLIC_LIVEKIT_URL`
- `XAI_API_KEY`
- `XAI_RIA_VOICE`
- `XAI_IAN_VOICE`
- `XAI_REALTIME_MODEL`

**How it works**:

The example now keeps `XAI_REALTIME_MODEL` blank. That is intentional: the next LiveKit xAI plugin integration should use the plugin's default model unless there is a clear reason to override it.

### `package.json` and `package-lock.json`

**Purpose**: Add LiveKit browser and server dependencies.

**Key Packages**:

- `@livekit/components-react`
- `@livekit/components-styles`
- `livekit-client`
- `livekit-server-sdk`

**How it works**:

The browser uses LiveKit React components for room connection. The server SDK signs participant tokens from the API route without exposing the LiveKit API secret to the client.

### `src/lib/livekit/config.ts`

**Purpose**: Reads and validates LiveKit environment variables.

**Key Functions**:

- `getLiveKitServerConfig()` - reads private server values.
- `getLiveKitPublicConfig()` - reads public client URL.

**How it works**:

The helper throws when required environment variables are missing. This keeps the API route small and avoids half-configured token generation.

```ts
export function getLiveKitServerConfig(env: EnvReader = process.env): LiveKitServerConfig {
  return {
    url: readRequiredEnv("LIVEKIT_URL", env.LIVEKIT_URL),
    apiKey: readRequiredEnv("LIVEKIT_API_KEY", env.LIVEKIT_API_KEY),
    apiSecret: readRequiredEnv("LIVEKIT_API_SECRET", env.LIVEKIT_API_SECRET),
  };
}
```

### `src/lib/livekit/token-request.ts`

**Purpose**: Validates token request input before a room token is generated.

**Key Functions**:

- `parseLiveKitTokenRequest()` - validates room and participant names.
- `makeDefaultRoomName()` - produces a simple default room name.
- `makeDefaultParticipantName()` - produces a simple default participant name.

**How it works**:

The parser only accepts safe room and participant names. It rejects path-like or script-like input before the API route reaches token signing.

### `src/lib/livekit/token-request.test.ts`

**Purpose**: Tests LiveKit config and token request parsing.

**Key Tests**:

- required server env reads correctly
- missing env throws
- public env reads correctly
- safe request input passes
- unsafe room names fail
- unsafe participant names fail

**How it works**:

These tests keep the token route's validation behavior deterministic. They do not call LiveKit.

### `src/app/api/livekit-token/route.ts`

**Purpose**: Creates LiveKit participant tokens from private server credentials.

**Key Functions/Components**:

- `POST()` - parses request JSON, signs an `AccessToken`, and returns token metadata.

**How it works**:

The route accepts a room name and participant name, validates both, reads LiveKit server config, and signs a token with room join, publish, subscribe, and data-publish grants.

```ts
token.addGrant({
  room: roomName,
  roomJoin: true,
  canPublish: true,
  canSubscribe: true,
  canPublishData: true,
});
```

The response returns the token and LiveKit URL but never returns `LIVEKIT_API_SECRET`.

### `src/components/livekit-connect-panel.tsx`

**Purpose**: Adds browser-side LiveKit room connection controls.

**Key Functions/Components**:

- `LiveKitConnectPanel` - room/participant form, connect/disconnect controls, LiveKit room component.
- `handleConnect()` - requests a token from `/api/livekit-token`.
- `handleDisconnect()` - clears local connection state.

**How it works**:

The panel posts room and participant names to the token endpoint. If the endpoint returns a token and URL, it renders `LiveKitRoom` with `RoomAudioRenderer`.

The local mock practice flow remains visible and usable beneath the LiveKit panel. This keeps development usable even without the future xAI worker running in the room.

### `src/app/layout.tsx`

**Purpose**: Loads LiveKit component styles globally.

**Key Functions/Components**:

- `@livekit/components-styles`
- `globals.css`

**How it works**:

LiveKit's React components depend on their styles being imported once. The root layout is the right app-wide location.

### `src/components/voice-room.tsx`

**Purpose**: Includes the LiveKit panel in the Rian room.

**Key Functions/Components**:

- `LiveKitConnectPanel`
- existing local mock session controls, recording controls, transcript, and traces

**How it works**:

The component now shows the LiveKit connection panel before the persona cards. This makes room readiness visible while preserving the v1/v2 mock flow.

### `src/app/globals.css`

**Purpose**: Adds styling for the LiveKit connection panel.

**Key Classes**:

- `.livekit-panel`
- `.livekit-form`
- `.livekit-actions`
- `.livekit-error`
- `.livekit-room-meta`

**How it works**:

The panel uses the same restrained dashboard-like styling as the rest of the room. Mobile styles collapse the form into two columns alongside other compact controls.

### `README.md`

**Purpose**: Documents v3 setup, LiveKit env vars, xAI default-model guidance, and next worker steps.

**Key Sections**:

- `Environment`
- `Next Provider Wiring`
- updated sprint summary

**How it works**:

The README now tells developers that LiveKit room connection exists, but the server-side xAI realtime agent worker is still the next step.

### `sprints/v3/PRD.md`

**Purpose**: Defines the LiveKit room scaffold sprint.

**Key Sections**:

- Sprint Overview
- Goals
- User Stories
- Technical Architecture
- Out of Scope
- Dependencies

**How it works**:

The PRD keeps v3 focused on token generation and browser room connection, while explicitly deferring the xAI worker implementation.

### `sprints/v3/TASKS.md`

**Purpose**: Tracks v3 implementation status.

**Key Functions/Components**:

- six tasks
- completion notes for LiveKit packages, helpers, token route, UI, README, and walkthrough

**How it works**:

This file is the sprint execution record for the LiveKit room scaffold.

## Data Flow

1. User opens `/`.
2. `VoiceRoom` renders `LiveKitConnectPanel`.
3. User enters room and participant names.
4. Browser posts to `POST /api/livekit-token`.
5. API route validates request input.
6. API route reads `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET`.
7. API route signs a LiveKit token with room join/publish/subscribe/data grants.
8. Browser receives token and LiveKit URL.
9. `LiveKitRoom` connects the browser participant to the room.
10. Mock practice controls remain available until the future xAI agent worker joins the room.

## Test Coverage

- Unit: 26 tests - router behavior, session lifecycle, recorder reducer, conversation turn pipeline, LiveKit env parsing, and token request validation.
- Integration: 0 tests - token route is typechecked/build-validated but not directly covered by an API integration test yet.
- E2E: 0 tests - browser room connection is manually reachable through the UI but not automated with Playwright yet.

## Security Measures

- LiveKit API secret stays server-side in the token route.
- Token request input is validated before signing.
- Invalid token requests return `400`.
- `.env.local` remains ignored.
- `.env.example` documents placeholders only.
- xAI API key is not exposed client-side.

## Known Limitations

- The app can connect to a LiveKit room, but no LiveKit Agent worker joins yet.
- xAI realtime is not invoked yet.
- Room token endpoint has no user authentication because this is still a personal POC.
- No automated API route test currently asserts token response shape.
- LiveKit room connection has not been browser-tested with a real remote participant in this sprint.

## What's Next

Sprint v4 should add a LiveKit Agent worker that joins the room and uses the xAI realtime plugin with its default model. The worker should preserve Rian's one-active-speaker rule, map Ria/Ian voices from env, and emit trace events for room join, prompt version, selected persona, first audio latency, and provider output.
