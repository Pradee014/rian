export interface ParticipantLike {
  identity: string;
}

export interface ParticipantSummary {
  count: number;
  agentPresent: boolean;
  identities: string[];
}

export interface TranscriptionLike {
  participantIdentity: string;
  text: string;
}

export interface FormattedTranscription {
  speaker: string;
  text: string;
}

const RIAN_AGENT_IDENTITY = "rian-agent";

export function hasRianAgentParticipant(participants: ParticipantLike[]) {
  return participants.some((participant) => participant.identity === RIAN_AGENT_IDENTITY);
}

export function summarizeParticipants(participants: ParticipantLike[]): ParticipantSummary {
  return {
    count: participants.length,
    agentPresent: hasRianAgentParticipant(participants),
    identities: participants.map((participant) => participant.identity),
  };
}

export function formatLiveDebugEvent(type: string, detail?: string) {
  const safeDetail = detail?.trim();

  if (type === "connected") {
    return "Browser connected to LiveKit.";
  }

  if (type === "disconnected") {
    return safeDetail ? `Browser disconnected: ${safeDetail}` : "Browser disconnected.";
  }

  if (type === "connection_state") {
    return safeDetail ? `Connection state: ${safeDetail}` : "Connection state changed.";
  }

  if (type === "participant_connected") {
    return safeDetail ? `Participant joined: ${safeDetail}` : "Participant joined.";
  }

  if (type === "participant_disconnected") {
    return safeDetail ? `Participant left: ${safeDetail}` : "Participant left.";
  }

  if (type === "track_subscribed") {
    return safeDetail ? `Audio track subscribed: ${safeDetail}` : "Audio track subscribed.";
  }

  return safeDetail ? `${type}: ${safeDetail}` : type;
}

export function formatTranscription(
  transcription: TranscriptionLike,
): FormattedTranscription {
  return {
    speaker: transcription.participantIdentity,
    text: transcription.text.trim(),
  };
}
