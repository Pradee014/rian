"use client";

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useState } from "react";
import {
  getLiveConversationGuidance,
  makeAgentConnectCommand,
} from "@/lib/livekit/live-conversation";

interface LiveKitTokenResponse {
  token: string;
  url: string;
  roomName: string;
  participantName: string;
}

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export function LiveKitConnectPanel() {
  const [roomName, setRoomName] = useState("rian-room");
  const [participantName, setParticipantName] = useState("pradeep");
  const [tokenResponse, setTokenResponse] = useState<LiveKitTokenResponse | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    setStatus("connecting");
    setError(null);

    try {
      const response = await fetch("/api/livekit-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName, participantName }),
      });
      const payload = (await response.json()) as Partial<LiveKitTokenResponse> & {
        error?: string;
      };

      if (!response.ok || !payload.token || !payload.url) {
        throw new Error(payload.error ?? "Could not create LiveKit token.");
      }

      setTokenResponse({
        token: payload.token,
        url: payload.url,
        roomName: payload.roomName ?? roomName,
        participantName: payload.participantName ?? participantName,
      });
      setStatus("connected");
    } catch (connectError) {
      setStatus("error");
      setError(
        connectError instanceof Error
          ? connectError.message
          : "Could not connect to LiveKit.",
      );
    }
  }

  function handleDisconnect() {
    setTokenResponse(null);
    setStatus("idle");
  }

  const workerCommand = makeAgentConnectCommand(roomName);
  const guidance = getLiveConversationGuidance(status, tokenResponse?.roomName ?? roomName);

  return (
    <section className="livekit-panel live-conversation-panel" aria-label="LiveKit room connection">
      <div className="panel-heading livekit-heading">
        <div>
          <p className="eyebrow">Live conversation</p>
          <h2>{status === "connected" ? "Rian room is live" : "Start a real voice room"}</h2>
        </div>
        <span className={`live-status live-status-${status}`}>{status}</span>
      </div>

      <p className="livekit-guidance" data-testid="livekit-guidance">
        {guidance}
      </p>

      <ol className="livekit-steps" aria-label="Live conversation steps">
        <li>Join the browser room.</li>
        <li>Run the worker command in a second terminal.</li>
        <li>Use the mic controls below and speak to Rian.</li>
      </ol>

      <div className="livekit-form">
        <label>
          Room
          <input
            data-testid="livekit-room-name"
            disabled={status === "connected" || status === "connecting"}
            onChange={(event) => setRoomName(event.target.value)}
            value={roomName}
          />
        </label>
        <label>
          Participant
          <input
            data-testid="livekit-participant-name"
            disabled={status === "connected" || status === "connecting"}
            onChange={(event) => setParticipantName(event.target.value)}
            value={participantName}
          />
        </label>
      </div>

      {error ? <p className="livekit-error">{error}</p> : null}

      <div className="worker-command-card">
        <div>
          <p className="eyebrow">Worker command</p>
          <code data-testid="agent-connect-command">{workerCommand}</code>
        </div>
        <p>Keep this running while you talk. Stop it with Ctrl+C when the call ends.</p>
      </div>

      <div className="action-row livekit-actions">
        <button
          className="primary-action"
          data-testid="livekit-connect"
          disabled={status === "connecting" || status === "connected"}
          onClick={handleConnect}
          type="button"
        >
          Join browser room
        </button>
        <button
          className="secondary-action"
          data-testid="livekit-disconnect"
          disabled={status !== "connected"}
          onClick={handleDisconnect}
          type="button"
        >
          Leave room
        </button>
      </div>

      {tokenResponse ? (
        <LiveKitRoom
          audio
          connect
          onDisconnected={handleDisconnect}
          serverUrl={tokenResponse.url}
          token={tokenResponse.token}
        >
          <RoomAudioRenderer />
          <div className="livekit-call-controls" data-testid="livekit-call-controls">
            <ControlBar controls={{ screenShare: false, chat: false }} />
          </div>
          <p className="livekit-room-meta">
            Joined {tokenResponse.roomName} as {tokenResponse.participantName}
          </p>
        </LiveKitRoom>
      ) : (
        <p className="livekit-room-meta">
          Local mock practice remains available below, but it is separate from the live
          LiveKit/xAI voice path.
        </p>
      )}
    </section>
  );
}
