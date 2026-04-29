import type { AudioPreview } from "./recorder";

export interface BrowserRecordingResult {
  preview: AudioPreview;
  blob: Blob;
}

export interface BrowserRecorder {
  start: () => Promise<void>;
  stop: () => Promise<BrowserRecordingResult>;
  cancel: () => void;
}

function assertRecordingSupport() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone capture is not supported in this browser.");
  }

  if (typeof MediaRecorder === "undefined") {
    throw new Error("Audio recording is not supported in this browser.");
  }
}

function stopStream(stream?: MediaStream) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function createBrowserRecorder(): BrowserRecorder {
  let stream: MediaStream | undefined;
  let recorder: MediaRecorder | undefined;
  let chunks: BlobPart[] = [];
  let startedAt = 0;

  return {
    async start() {
      assertRecordingSupport();
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      startedAt = Date.now();
      recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });
      recorder.start();
    },
    async stop() {
      if (!recorder || recorder.state === "inactive") {
        throw new Error("No active recording is available to stop.");
      }

      const stopped = new Promise<BrowserRecordingResult>((resolve) => {
        recorder?.addEventListener(
          "stop",
          () => {
            const mimeType = recorder?.mimeType || "audio/webm";
            const blob = new Blob(chunks, { type: mimeType });
            const url = URL.createObjectURL(blob);
            stopStream(stream);

            resolve({
              blob,
              preview: {
                id: `audio-${Date.now()}`,
                url,
                mimeType,
                size: blob.size,
                durationMs: Math.max(0, Date.now() - startedAt),
              },
            });
          },
          { once: true },
        );
      });

      recorder.stop();

      return stopped;
    },
    cancel() {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      stopStream(stream);
    },
  };
}
