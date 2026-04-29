"use client";

import type { PracticeMode, SessionStatus } from "@/lib/rian/types";

interface SessionControlsProps {
  status: SessionStatus;
  mode: PracticeMode;
  elapsedSeconds: number;
  onModeChange: (mode: PracticeMode) => void;
  onStart: () => void;
  onEnd: () => void;
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function SessionControls({
  status,
  mode,
  elapsedSeconds,
  onModeChange,
  onStart,
  onEnd,
}: SessionControlsProps) {
  const active = status === "active";

  return (
    <section className="control-panel" aria-label="Session controls">
      <div>
        <p className="eyebrow">Practice room</p>
        <h1>Rian</h1>
      </div>

      <div className="session-meta" aria-live="polite">
        <span className={`status-dot status-${status}`} />
        <span>{status === "active" ? "Session active" : "Ready"}</span>
        <span>{formatElapsed(elapsedSeconds)}</span>
      </div>

      <div className="mode-row" aria-label="Practice mode">
        <button
          className={mode === "casual" ? "mode-button active" : "mode-button"}
          data-testid="mode-casual"
          disabled={active}
          onClick={() => onModeChange("casual")}
          type="button"
        >
          Casual
        </button>
        <button
          className={mode === "self-introduction" ? "mode-button active" : "mode-button"}
          data-testid="mode-self-introduction"
          disabled={active}
          onClick={() => onModeChange("self-introduction")}
          type="button"
        >
          Intro
        </button>
      </div>

      <div className="action-row">
        <button
          className="primary-action"
          data-testid="start-session"
          disabled={active}
          onClick={onStart}
          type="button"
        >
          Start
        </button>
        <button
          className="secondary-action"
          data-testid="end-session"
          disabled={!active}
          onClick={onEnd}
          type="button"
        >
          End
        </button>
      </div>
    </section>
  );
}
