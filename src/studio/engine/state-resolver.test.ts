import { describe, expect, it } from "vitest";
import { getStudioAdapter } from "../adapters";
import {
  resolveStudioState,
  resolveTemplateFromUrl,
  serializeStudioStateToSearchParams,
} from "./state-resolver";

describe("resolveTemplateFromUrl", () => {
  it("uses blush as fallback template", () => {
    const url = new URL("https://example.com/dev/components/");
    expect(resolveTemplateFromUrl(url)).toBe("blush");
  });

  it("accepts known template id", () => {
    const url = new URL("https://example.com/dev/components/?template=default");
    expect(resolveTemplateFromUrl(url)).toBe("default");
  });
});

describe("resolveStudioState", () => {
  it("merges profile defaults with valid URL overrides", () => {
    const adapter = getStudioAdapter("default");
    const url = new URL(
      "https://example.com/dev/components/?template=default&hero=registry-centered&pricing=minimal&studio=pricing",
    );

    const resolved = resolveStudioState(url, adapter);

    expect(resolved.template).toBe("default");
    expect(resolved.state.hero).toBe("registry-centered");
    expect(resolved.state.pricing).toBe("minimal");
    expect(resolved.state.features).toBe("grid");
    expect(resolved.studioTab).toBe("pricing");
  });

  it("ignores invalid section variants", () => {
    const adapter = getStudioAdapter("blush");
    const url = new URL(
      "https://example.com/dev/components/?template=blush&features=unknown-layout",
    );

    const resolved = resolveStudioState(url, adapter);

    expect(resolved.state.features).toBe("grid");
  });
});

describe("serializeStudioStateToSearchParams", () => {
  it("serializes template, section state and active tab", () => {
    const state = {
      navbar: "centered",
      hero: "blush-lead",
      features: "cards-grid",
      pricing: "simple",
      cta: "centered",
      "section-pattern": "off",
      footer: "columns",
      theme: "blush",
    } as const;

    const params = serializeStudioStateToSearchParams("blush", state, "hero");

    expect(params.get("template")).toBe("blush");
    expect(params.get("hero")).toBe("blush-lead");
    expect(params.get("studio")).toBe("hero");
  });
});
