"use client";

import { FormEvent, useEffect, useReducer, useRef, useState } from "react";
import { AudioPreview } from "@/components/audio-preview";
import { RecordingControls } from "@/components/recording-controls";
import { mockLlm } from "@/lib/providers/mock-llm";
import { mockTts } from "@/lib/providers/mock-tts";
import { mockStt } from "@/lib/providers/mock-stt";
import { routePersona } from "@/lib/rian/router";
import {
  appendTrace,
  appendTurn,
  createSession,
  endSession,
  setActivePersona,
} from "@/lib/rian/session";
import type { PracticeMode, RianSession } from "@/lib/rian/types";
import {
  createBrowserRecorder,
  type BrowserRecorder,
} from "@/lib/voice/browser-recorder";
import { initialRecorderState, recorderReducer } from "@/lib/voice/recorder";
import { PersonaCards } from "./persona-cards";
import { SessionControls } from "./session-controls";
import { TracePreview } from "./trace-preview";
import { TranscriptPanel } from "./transcript-panel";

export function VoiceRoom() {
  const [mode, setMode] = useState<PracticeMode>("casual");
  const [session, setSession] = useState<RianSession | null>(null);
  const [draft, setDraft] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isResponding, setIsResponding] = useState(false);
  const [recorder, dispatchRecorder] = useReducer(recorderReducer, initialRecorderState);
  const browserRecorderRef = useRef<BrowserRecorder | null>(null);

  const status = session?.status ?? "idle";
  const activePersonaId =
    session?.activePersonaId ?? (mode === "self-introduction" ? "ian" : "ria");

  useEffect(() => {
    if (!session?.startedAt || session.status !== "active") {
      return;
    }

    const startedAt = new Date(session.startedAt).getTime();
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [session?.startedAt, session?.status]);

  function handleStart() {
    setElapsedSeconds(0);
    setSession(createSession(mode));
  }

  function handleEnd() {
    browserRecorderRef.current?.cancel();
    browserRecorderRef.current = null;
    setSession((current) => (current ? endSession(current) : current));
  }

  async function completePracticeTurn(baseSession: RianSession, userText: string) {
    const decision = routePersona({ mode: baseSession.mode, userText });
    let next = appendTurn(baseSession, { speaker: "user", text: userText });
    next = appendTrace(next, "user_turn", "User mock utterance recorded.");
    next = setActivePersona(next, decision.primaryPersonaId);
    next = appendTrace(next, "router_decision", decision.reason, {
      primaryPersonaId: decision.primaryPersonaId,
      secondaryPersonaId: decision.secondaryPersonaId ?? null,
    });

    const response = await mockLlm.respond({
      userText,
      decision,
      transcript: next.transcript,
    });
    next = appendTrace(next, response.trace.type, response.trace.message, response.trace.metadata);
    next = appendTurn(next, {
      speaker: "system",
      personaId: response.data.personaId,
      text: response.data.text,
    });

    const audio = await mockTts.synthesize({
      personaId: response.data.personaId,
      text: response.data.text,
    });
    next = appendTrace(next, audio.trace.type, audio.trace.message, audio.trace.metadata);

    setSession(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session || session.status !== "active" || draft.trim().length === 0) {
      return;
    }

    const userText = draft.trim();
    setDraft("");
    setIsResponding(true);

    try {
      await completePracticeTurn(session, userText);
    } finally {
      setIsResponding(false);
    }
  }

  async function handleStartRecording() {
    if (!session || session.status !== "active") {
      return;
    }

    dispatchRecorder({ type: "request_permission" });

    try {
      const browserRecorder = createBrowserRecorder();
      await browserRecorder.start();
      browserRecorderRef.current = browserRecorder;
      dispatchRecorder({ type: "recording_started" });
      setSession((current) =>
        current
          ? appendTrace(current, "audio_recording_started", "Browser recording started.")
          : current,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start recording.";
      dispatchRecorder({
        type: message.includes("not supported") ? "unsupported" : "permission_denied",
        error: message,
      });
    }
  }

  async function handleStopRecording() {
    if (!session || session.status !== "active" || !browserRecorderRef.current) {
      return;
    }

    setIsResponding(true);

    try {
      const recording = await browserRecorderRef.current.stop();
      browserRecorderRef.current = null;
      dispatchRecorder({ type: "recording_stopped", audio: recording.preview });

      let next = appendTrace(session, "audio_recording_stopped", "Browser recording stopped.", {
        audioId: recording.preview.id,
        mimeType: recording.preview.mimeType,
        size: recording.preview.size,
        durationMs: recording.preview.durationMs ?? null,
      });
      const transcript = await mockStt.transcribe({ audioId: recording.preview.id });
      next = appendTrace(next, transcript.trace.type, transcript.trace.message, transcript.trace.metadata);

      await completePracticeTurn(next, transcript.data.text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not stop recording.";
      dispatchRecorder({ type: "permission_denied", error: message });
    } finally {
      setIsResponding(false);
    }
  }

  return (
    <main className="voice-room">
      <SessionControls
        elapsedSeconds={elapsedSeconds}
        mode={mode}
        onEnd={handleEnd}
        onModeChange={setMode}
        onStart={handleStart}
        status={status}
      />

      <div className="room-grid">
        <div className="room-main">
          <PersonaCards activePersonaId={activePersonaId} />

          <RecordingControls
            disabled={status !== "active" || isResponding}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            recorder={recorder}
          />

          <AudioPreview audio={recorder.audio} />

          <form className="utterance-form" onSubmit={handleSubmit}>
            <label htmlFor="utterance">Practice line</label>
            <div className="utterance-row">
              <textarea
                data-testid="mock-utterance"
                disabled={status !== "active" || isResponding}
                id="utterance"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Try: Ian, sharpen this self-introduction."
                rows={3}
                value={draft}
              />
              <button
                className="primary-action"
                data-testid="send-utterance"
                disabled={status !== "active" || isResponding || draft.trim().length === 0}
                type="submit"
              >
                Send
              </button>
            </div>
          </form>

          <TranscriptPanel turns={session?.transcript ?? []} />
        </div>

        <TracePreview traces={session?.traces ?? []} />
      </div>
    </main>
  );
}
