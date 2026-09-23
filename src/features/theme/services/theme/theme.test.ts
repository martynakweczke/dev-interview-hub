import { afterEach, describe, expect, it } from "vitest";

import {
  parsePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeInitScript,
} from "@/features/theme/services/theme/theme";
import { installMatchMedia } from "@/test/match-media/match-media";

describe("parsePreference", () => {
  it("accepts the explicit themes", () => {
    expect(parsePreference("dark")).toBe("dark");
    expect(parsePreference("light")).toBe("light");
  });

  it("falls back to system for anything else", () => {
    expect(parsePreference("system")).toBe("system");
    expect(parsePreference("sepia")).toBe("system");
    expect(parsePreference(null)).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("follows the OS while in system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("ignores the OS when pinned", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("themeInitScript", () => {
  const root = document.documentElement;
  const run = () => new Function(themeInitScript)();

  afterEach(() => {
    localStorage.clear();
    root.removeAttribute("data-theme");
    root.style.colorScheme = "";
  });

  it("applies the OS scheme when nothing is stored", () => {
    installMatchMedia(false);
    run();
    expect(root.dataset.theme).toBe("light");
    expect(root.style.colorScheme).toBe("light");
  });

  it("applies a stored override over the OS scheme", () => {
    installMatchMedia(false);
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    run();
    expect(root.dataset.theme).toBe("dark");
  });

  it("treats an unrecognized stored value as system", () => {
    installMatchMedia(true);
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    run();
    expect(root.dataset.theme).toBe("dark");
  });
});
