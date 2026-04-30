"use client";

import { useParticipants, useRoomContext, useTranscriptions } from "@livekit/components-react";
import { ConnectionState, RoomEvent } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import {
  formatLiveDebugEvent,
  formatTranscription,
  summarizeParticipants,
} from "@/lib/livekit/live-debug";

interface LiveDebugEvent {
  id: string;
  createdAt: string;
  message: string;
}

function makeDebugEvent(type: string, detail?: string): LiveDebugEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    message: formatLiveDebugEvent(type, detail),
  };
}

function formatDebugTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

export function LiveConversationDebug() {
  const room = useRoomContext();
  const participants = useParticipants();
  const transcriptions = useTranscriptions();
  const [events, setEvents] = useState<LiveDebugEvent[]>(() => [
    makeDebugEvent("connection_state", room.state),
  ]);

  const participantSummary = useMemo(
    () =>
      summarizeParticipants(
        participants.map((participant) => ({
          identity: participant.identity,
        })),
      ),
    [participants],
  );

  const formattedTranscriptions = useMemo(
    () =>
      transcriptions
        .map((transcription) =>
          formatTranscription({
            participantIdentity: transcription.participantInfo.identity,
            text: transcription.text,
          }),
        )
        .filter((transcription) => transcription.text.length > 0)
        .slice(-6),
    [transcriptions],
  );

  useEffect(() => {
    function appendEvent(type: string, detail?: string) {
      setEvents((current) => [makeDebugEvent(type, detail), ...current].slice(0, 8));
    }

    function handleConnected() {
      appendEvent("connected");
    }

    function handleDisconnected(reason?: unknown) {
      appendEvent("disconnected", typeof reason === "string" ? reason : undefined);
    }

    function handleConnectionStateChanged(state: ConnectionState) {
      appendEvent("connection_state", state);
    }

    function handleParticipantConnected(participant: { identity: string }) {
      appendEvent("participant_connected", participant.identity);
    }

    function handleParticipantDisconnected(participant: { identity: string }) {
      appendEvent("participant_disconnected", participant.identity);
    }

    function handleTrackSubscribed(
      _track: unknown,
      _publication: unknown,
      participant: { identity: string },
    ) {
      appendEvent("track_subscribed", participant.identity);
    }

    room
      .on(RoomEvent.Connected, handleConnected)
      .on(RoomEvent.Disconnected, handleDisconnected)
      .on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged)
      .on(RoomEvent.ParticipantConnected, handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
      .on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => {
      room
        .off(RoomEvent.Connected, handleConnected)
        .off(RoomEvent.Disconnected, handleDisconnected)
        .off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged)
        .off(RoomEvent.ParticipantConnected, handleParticipantConnected)
        .off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
        .off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    };
  }, [room]);

  return (
    <section className="live-debug-panel" aria-label="Live voice debug panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live debug</p>
          <h2>Room trace</h2>
        </div>
        <span>{participantSummary.count} participants</span>
      </div>

      <div className="live-debug-grid">
        <div className="debug-card">
          <span className="debug-label">Agent</span>
          <strong>{participantSummary.agentPresent ? "rian-agent joined" : "waiting"}</strong>
          <p>{participantSummary.identities.join(", ") || "No participants yet."}</p>
        </div>

        <div className="debug-card">
          <span className="debug-label">Connection</span>
          <strong>{room.state}</strong>
          <p>Use this panel to confirm room, agent, audio, and transcript events.</p>
        </div>
      </div>

      <div className="debug-columns">
        <div>
          <h3>Recent events</h3>
          {events.length > 0 ? (
            <ol className="debug-event-list">
              {events.map((event) => (
                <li key={event.id}>
                  <span>{formatDebugTime(event.createdAt)}</span>
                  <p>{event.message}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No room events yet.</p>
          )}
        </div>

        <div>
          <h3>Transcriptions</h3>
          {formattedTranscriptions.length > 0 ? (
            <ol className="debug-event-list">
              {formattedTranscriptions.map((transcription, index) => (
                <li key={`${transcription.speaker}-${index}`}>
                  <span>{transcription.speaker}</span>
                  <p>{transcription.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No LiveKit transcription stream yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
