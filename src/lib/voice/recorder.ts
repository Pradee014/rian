export type RecorderStatus =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "recorded"
  | "error";

export type MicPermission = "unknown" | "granted" | "denied" | "unsupported";

export interface AudioPreview {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  durationMs?: number;
}

export interface RecorderState {
  status: RecorderStatus;
  permission: MicPermission;
  audio?: AudioPreview;
  error?: string;
}

export type RecorderAction =
  | { type: "request_permission" }
  | { type: "permission_granted" }
  | { type: "permission_denied"; error: string }
  | { type: "unsupported"; error: string }
  | { type: "recording_started" }
  | { type: "recording_stopped"; audio: AudioPreview }
  | { type: "reset" };

export const initialRecorderState: RecorderState = {
  status: "idle",
  permission: "unknown",
};

export function recorderReducer(
  state: RecorderState,
  action: RecorderAction,
): RecorderState {
  switch (action.type) {
    case "request_permission":
      return {
        ...state,
        status: "requesting-permission",
        error: undefined,
      };
    case "permission_granted":
      return {
        ...state,
        status: "idle",
        permission: "granted",
        error: undefined,
      };
    case "permission_denied":
      return {
        status: "error",
        permission: "denied",
        error: action.error,
      };
    case "unsupported":
      return {
        status: "error",
        permission: "unsupported",
        error: action.error,
      };
    case "recording_started":
      return {
        ...state,
        status: "recording",
        permission: "granted",
        audio: undefined,
        error: undefined,
      };
    case "recording_stopped":
      return {
        ...state,
        status: "recorded",
        permission: "granted",
        audio: action.audio,
        error: undefined,
      };
    case "reset":
      return initialRecorderState;
  }
}
