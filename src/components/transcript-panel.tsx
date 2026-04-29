import { PERSONAS } from "@/lib/rian/personas";
import type { TranscriptTurn } from "@/lib/rian/types";

interface TranscriptPanelProps {
  turns: TranscriptTurn[];
}

function labelForTurn(turn: TranscriptTurn) {
  if (turn.speaker === "user") {
    return "You";
  }

  if (turn.personaId) {
    return PERSONAS[turn.personaId].name;
  }

  return "Rian";
}

export function TranscriptPanel({ turns }: TranscriptPanelProps) {
  return (
    <section className="room-panel transcript-panel" aria-label="Transcript">
      <div className="panel-heading">
        <p className="eyebrow">Transcript</p>
        <span>{turns.length} turns</span>
      </div>

      {turns.length === 0 ? (
        <p className="empty-state">Start a session and send a practice line.</p>
      ) : (
        <ol className="transcript-list">
          {turns.map((turn) => (
            <li className={`turn turn-${turn.speaker}`} key={turn.id}>
              <span>{labelForTurn(turn)}</span>
              <p>{turn.text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
