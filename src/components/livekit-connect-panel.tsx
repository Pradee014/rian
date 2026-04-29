"use client";

import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useState } from "react";

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

  return (
    <section className="livekit-panel" aria-label="LiveKit room connection">
      <div className="panel-heading livekit-heading">
        <div>
          <p className="eyebrow">LiveKit</p>
          <h2>{status === "connected" ? "Room connected" : "Realtime room"}</h2>
        </div>
        <span>{status}</span>
      </div>

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

      <div className="action-row livekit-actions">
        <button
          className="primary-action"
          data-testid="livekit-connect"
          disabled={status === "connecting" || status === "connected"}
          onClick={handleConnect}
          type="button"
        >
          Connect
        </button>
        <button
          className="secondary-action"
          data-testid="livekit-disconnect"
          disabled={status !== "connected"}
          onClick={handleDisconnect}
          type="button"
        >
          Disconnect
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
          <p className="livekit-room-meta">
            Joined {tokenResponse.roomName} as {tokenResponse.participantName}
          </p>
        </LiveKitRoom>
      ) : (
        <p className="livekit-room-meta">Mock practice remains available without a room.</p>
      )}
    </section>
  );
}
