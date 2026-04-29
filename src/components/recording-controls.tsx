"use client";

import type { RecorderState } from "@/lib/voice/recorder";

interface RecordingControlsProps {
  disabled: boolean;
  recorder: RecorderState;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function RecordingControls({
  disabled,
  recorder,
  onStartRecording,
  onStopRecording,
}: RecordingControlsProps) {
  const recording = recorder.status === "recording";
  const requesting = recorder.status === "requesting-permission";

  return (
    <section className="recording-panel" aria-label="Recording controls">
      <div>
        <p className="eyebrow">Microphone</p>
        <h2>{recording ? "Recording" : "Ready for a spoken turn"}</h2>
        <p className="recorder-status" aria-live="polite">
          {recorder.error ??
            (requesting
              ? "Requesting microphone permission"
              : recorder.permission === "granted"
                ? "Microphone permission granted"
                : "Microphone permission not requested")}
        </p>
      </div>

      <div className="recording-actions">
        <button
          className="primary-action"
          data-testid="start-recording"
          disabled={disabled || recording || requesting}
          onClick={onStartRecording}
          type="button"
        >
          Record
        </button>
        <button
          className="secondary-action"
          data-testid="stop-recording"
          disabled={disabled || !recording}
          onClick={onStopRecording}
          type="button"
        >
          Stop
        </button>
      </div>
    </section>
  );
}
