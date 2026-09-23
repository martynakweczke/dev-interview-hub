import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

describe("Button", () => {
  it("is truly non-interactive when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Next question →
      </Button>
    );
    const button = screen.getByRole("button", { name: "Next question →" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("omits aria-disabled when enabled", () => {
    render(<Button>Retry quiz</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-disabled");
  });

  it("keeps size and color utilities when both are custom tokens", () => {
    render(<Button size="lg">Retry quiz</Button>);
    const { className } = screen.getByRole("button");

    expect(className).toContain("text-button-lg");
    expect(className).toContain("text-on-brand");
    expect(className).not.toMatch(/(^|\s)text-button(\s|$)/);
  });
});

describe("Progress", () => {
  it("exposes its value to assistive tech", () => {
    render(<Progress value={30} aria-label="Question 3 of 10" />);
    const bar = screen.getByRole("progressbar", { name: "Question 3 of 10" });

    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });
});

describe("Badge", () => {
  it("renders a decorative status dot", () => {
    render(
      <Badge tone="streak" size="md" dot>
        4-day streak
      </Badge>
    );
    const badge = screen.getByText("4-day streak");

    expect(badge.querySelector("[aria-hidden='true']")).not.toBeNull();
    expect(badge).toHaveClass("tone-streak");
  });
});
