import { PERSONAS } from "@/lib/rian/personas";
import type { PersonaId } from "@/lib/rian/types";

interface PersonaCardsProps {
  activePersonaId: PersonaId;
}

export function PersonaCards({ activePersonaId }: PersonaCardsProps) {
  return (
    <section className="persona-grid" aria-label="Rian coaches">
      {Object.values(PERSONAS).map((persona) => {
        const active = persona.id === activePersonaId;

        return (
          <article
            aria-current={active ? "true" : undefined}
            className={active ? "persona-card active" : "persona-card"}
            data-testid={`persona-${persona.id}`}
            key={persona.id}
          >
            <div className="persona-card-header">
              <h2>{persona.name}</h2>
              <span>{active ? "Speaking" : "Standby"}</span>
            </div>
            <p>{persona.role}</p>
            <ul>
              {persona.strengths.slice(0, 3).map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
