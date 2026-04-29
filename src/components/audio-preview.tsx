import type { AudioPreview as AudioPreviewData } from "@/lib/voice/recorder";

interface AudioPreviewProps {
  audio?: AudioPreviewData;
}

export function AudioPreview({ audio }: AudioPreviewProps) {
  if (!audio) {
    return null;
  }

  return (
    <section className="audio-preview" aria-label="Last recording preview">
      <div>
        <p className="eyebrow">Last recording</p>
        <p>
          {(audio.size / 1024).toFixed(1)} KB
          {audio.durationMs ? ` / ${(audio.durationMs / 1000).toFixed(1)}s` : ""}
        </p>
      </div>
      <audio controls src={audio.url}>
        <track kind="captions" />
      </audio>
    </section>
  );
}
