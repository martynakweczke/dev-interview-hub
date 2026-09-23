import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "@/features/theme/components/theme-toggle/theme-toggle";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY } from "@/features/theme/services/theme/theme";
import { installMatchMedia } from "@/test/match-media/match-media";

const root = document.documentElement;
const radio = (name: string) => screen.getByRole("radio", { name });

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    root.removeAttribute("data-theme");
  });

  it("lights the OS theme while following system", () => {
    installMatchMedia(true);
    render(<ThemeToggle />);

    expect(radio("Dark theme")).toHaveAttribute("aria-checked", "true");
    expect(radio("Light theme")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName(
      "Theme (following system setting)"
    );
  });

  it("pins a theme, persists it, and applies it to <html>", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(radio("Light theme"));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(root.dataset.theme).toBe("light");
    expect(radio("Light theme")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Theme");
  });

  it("returns to system when the lit segment is picked again", async () => {
    installMatchMedia(false);
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(radio("Dark theme"));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
    expect(root.dataset.theme).toBe("light");
    expect(radio("Light theme")).toHaveAttribute("aria-checked", "true");
  });

  it("tracks OS changes live only while in system", async () => {
    const media = installMatchMedia(false);
    const user = userEvent.setup();
    render(<ThemeToggle />);

    act(() => media.setPrefersDark(true));
    expect(root.dataset.theme).toBe("dark");

    await user.click(radio("Light theme"));
    act(() => media.setPrefersDark(false));
    act(() => media.setPrefersDark(true));
    expect(root.dataset.theme).toBe("light");
  });

  it("re-themes without remounting the tree", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(
      <main>
        <ThemeToggle />
        <Button>Next question →</Button>
      </main>
    );
    const button = screen.getByRole("button", { name: "Next question →" });
    const group = screen.getByRole("radiogroup");

    await user.click(radio("Light theme"));
    await user.click(radio("Dark theme"));

    expect(screen.getByRole("button", { name: "Next question →" })).toBe(
      button
    );
    expect(screen.getByRole("radiogroup")).toBe(group);
  });
});
