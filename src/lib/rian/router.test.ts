import { describe, expect, it } from "vitest";
import { routePersona } from "./router";

describe("routePersona", () => {
  it("defaults casual conversation to Ria", () => {
    expect(
      routePersona({ mode: "casual", userText: "I want to practice a normal chat." }),
    ).toMatchObject({ primaryPersonaId: "ria" });
  });

  it("defaults self-introduction practice to Ian", () => {
    expect(
      routePersona({
        mode: "self-introduction",
        userText: "Help me introduce myself.",
      }),
    ).toMatchObject({ primaryPersonaId: "ian" });
  });

  it("honors explicit Ria routing", () => {
    expect(
      routePersona({ mode: "self-introduction", userText: "Ria, take this." }),
    ).toMatchObject({ primaryPersonaId: "ria" });
  });

  it("honors explicit Ian routing", () => {
    expect(
      routePersona({ mode: "casual", userText: "Ian, sharpen this pitch." }),
    ).toMatchObject({ primaryPersonaId: "ian" });
  });

  it("does not include a second speaker unless both are allowed and requested", () => {
    expect(
      routePersona({ mode: "casual", userText: "Give me both perspectives." }),
    ).not.toHaveProperty("secondaryPersonaId");
  });

  it("includes both speakers only when explicitly allowed", () => {
    expect(
      routePersona({
        mode: "casual",
        userText: "Give me both perspectives.",
        allowBoth: true,
      }),
    ).toMatchObject({
      primaryPersonaId: "ria",
      secondaryPersonaId: "ian",
    });
  });
});
