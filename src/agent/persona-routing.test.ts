import { describe, expect, it } from "vitest";

import { chooseLivePersona } from "./persona-routing";

describe("chooseLivePersona", () => {
  it("routes explicit Ria requests to Ria", () => {
    expect(chooseLivePersona("Ria, make this sound warmer.", "ian")).toEqual({
      personaId: "ria",
      reason: "User explicitly asked for Ria.",
    });
  });

  it("routes explicit Ian requests to Ian", () => {
    expect(chooseLivePersona("Ian, sharpen this intro.", "ria")).toEqual({
      personaId: "ian",
      reason: "User explicitly asked for Ian.",
    });
  });

  it("routes only-ria requests to Ria", () => {
    expect(chooseLivePersona("Only Ria for this one.", "ian").personaId).toBe("ria");
  });

  it("routes only-ian requests to Ian", () => {
    expect(chooseLivePersona("Only Ian. Be direct.", "ria").personaId).toBe("ian");
  });

  it("keeps the current persona when no explicit route exists", () => {
    expect(chooseLivePersona("How do I introduce myself?", "ria")).toEqual({
      personaId: "ria",
      reason: "No explicit live persona route; keeping the current persona.",
    });
  });

  it("never returns both personas for a single live turn", () => {
    const decision = chooseLivePersona("Ria and Ian, both answer this.", "ria");

    expect(decision).not.toHaveProperty("secondaryPersonaId");
  });
});
