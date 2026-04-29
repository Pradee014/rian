export interface LiveKitTokenRequest {
  roomName: string;
  participantName: string;
}

const ROOM_NAME_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;
const PARTICIPANT_NAME_PATTERN = /^[a-zA-Z0-9 _.-]{1,64}$/;

export function makeDefaultRoomName() {
  return `rian-room-${new Date().toISOString().slice(0, 10)}`;
}

export function makeDefaultParticipantName() {
  return `rian-user-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseLiveKitTokenRequest(input: unknown): LiveKitTokenRequest {
  if (!input || typeof input !== "object") {
    throw new Error("Token request body must be an object.");
  }

  const maybeRequest = input as Partial<Record<keyof LiveKitTokenRequest, unknown>>;
  const roomName =
    typeof maybeRequest.roomName === "string"
      ? maybeRequest.roomName.trim()
      : makeDefaultRoomName();
  const participantName =
    typeof maybeRequest.participantName === "string"
      ? maybeRequest.participantName.trim()
      : makeDefaultParticipantName();

  if (!ROOM_NAME_PATTERN.test(roomName)) {
    throw new Error("Room name must be 1-64 characters and use letters, numbers, underscores, or hyphens.");
  }

  if (!PARTICIPANT_NAME_PATTERN.test(participantName)) {
    throw new Error("Participant name must be 1-64 safe display characters.");
  }

  return {
    roomName,
    participantName,
  };
}
