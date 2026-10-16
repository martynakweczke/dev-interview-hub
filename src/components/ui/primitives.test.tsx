import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

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

describe("Input", () => {
  it("is named by its label", () => {
    render(
      <>
        <Label htmlFor="prompt">Question</Label>
        <Input id="prompt" />
      </>
    );

    expect(screen.getByRole("textbox", { name: "Question" })).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("switches to the incorrect tone when invalid", () => {
    render(<Input aria-label="Question" aria-invalid />);

    expect(screen.getByRole("textbox").className).toContain(
      "aria-invalid:tone-incorrect"
    );
  });
});

describe("Textarea", () => {
  it("shares the field styling and grows only vertically", () => {
    render(<Textarea aria-label="Question" />);
    const { className } = screen.getByRole("textbox");

    expect(className).toContain("rounded-control");
    expect(className).toContain("resize-y");
  });
});
