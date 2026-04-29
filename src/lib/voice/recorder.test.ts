import { describe, expect, it } from "vitest";
import { initialRecorderState, recorderReducer } from "./recorder";

const audio = {
  id: "audio-1",
  url: "blob:http://localhost/audio-1",
  mimeType: "audio/webm",
  size: 2048,
};

describe("recorderReducer", () => {
  it("moves from idle to requesting permission", () => {
    expect(
      recorderReducer(initialRecorderState, { type: "request_permission" }),
    ).toMatchObject({
      status: "requesting-permission",
      permission: "unknown",
    });
  });

  it("records granted permission", () => {
    expect(
      recorderReducer(
        { status: "requesting-permission", permission: "unknown" },
        { type: "permission_granted" },
      ),
    ).toMatchObject({
      status: "idle",
      permission: "granted",
    });
  });

  it("records unsupported browser state", () => {
    expect(
      recorderReducer(initialRecorderState, {
        type: "unsupported",
        error: "MediaRecorder is not available.",
      }),
    ).toMatchObject({
      status: "error",
      permission: "unsupported",
      error: "MediaRecorder is not available.",
    });
  });

  it("moves into recording state", () => {
    expect(
      recorderReducer(initialRecorderState, { type: "recording_started" }),
    ).toMatchObject({
      status: "recording",
      permission: "granted",
    });
  });

  it("stores recorded audio preview metadata", () => {
    expect(
      recorderReducer(
        { status: "recording", permission: "granted" },
        { type: "recording_stopped", audio },
      ),
    ).toMatchObject({
      status: "recorded",
      permission: "granted",
      audio,
    });
  });

  it("captures permission denial", () => {
    expect(
      recorderReducer(initialRecorderState, {
        type: "permission_denied",
        error: "Microphone permission denied.",
      }),
    ).toMatchObject({
      status: "error",
      permission: "denied",
      error: "Microphone permission denied.",
    });
  });
});
