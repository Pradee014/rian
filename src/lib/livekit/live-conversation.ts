export type LiveConversationStatus = "idle" | "connecting" | "connected" | "error";

const DEFAULT_ROOM_NAME = "rian-room";

export function normalizeRoomNameForCommand(roomName: string) {
  return roomName.trim() || DEFAULT_ROOM_NAME;
}

function shellQuoteIfNeeded(value: string) {
  if (/^[A-Za-z0-9._-]+$/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '\\"')}"`;
}

export function makeAgentConnectCommand(roomName: string) {
  const normalizedRoomName = normalizeRoomNameForCommand(roomName);

  return `npm run agent:connect -- --room ${shellQuoteIfNeeded(normalizedRoomName)}`;
}

export function getLiveConversationGuidance(
  status: LiveConversationStatus,
  roomName = DEFAULT_ROOM_NAME,
) {
  const normalizedRoomName = normalizeRoomNameForCommand(roomName);

  if (status === "connected") {
    return `Browser joined ${normalizedRoomName}. Start the worker in another terminal, unmute your mic, then speak naturally.`;
  }

  if (status === "connecting") {
    return "Creating a LiveKit token and joining the room. Keep the worker terminal ready.";
  }

  if (status === "error") {
    return "Check LiveKit env values, room name, and token route errors before trying again.";
  }

  return "Join the browser room first. Then run the worker command shown here in a second terminal.";
}
