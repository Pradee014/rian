import type { TraceEvent } from "@/lib/rian/types";

interface TracePreviewProps {
  traces: TraceEvent[];
}

export function TracePreview({ traces }: TracePreviewProps) {
  const visibleTraces = traces.slice(-6).reverse();

  return (
    <section className="room-panel trace-panel" aria-label="Trace preview">
      <div className="panel-heading">
        <p className="eyebrow">Trace</p>
        <span>{traces.length} events</span>
      </div>

      {visibleTraces.length === 0 ? (
        <p className="empty-state">Routing and provider traces will appear here.</p>
      ) : (
        <ol className="trace-list">
          {visibleTraces.map((trace) => (
            <li key={trace.id}>
              <span>{trace.type.replaceAll("_", " ")}</span>
              <p>{trace.message}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
