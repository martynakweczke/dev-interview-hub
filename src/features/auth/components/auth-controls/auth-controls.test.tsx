import { useClerk, useUser } from "@clerk/nextjs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthControls } from "@/features/auth/components/auth-controls/auth-controls";

vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(),
  useClerk: vi.fn(),
}));

const signOut = vi.fn();

function mockUser(state: unknown) {
  vi.mocked(useUser).mockReturnValue(state as ReturnType<typeof useUser>);
}

const signedIn = {
  isLoaded: true,
  isSignedIn: true,
  user: {
    firstName: "Lexi",
    lastName: "Nowak",
    username: null,
    primaryEmailAddress: { emailAddress: "lexi@example.com" },
    hasImage: false,
    imageUrl: "https://img.clerk.com/default.png",
    publicMetadata: {},
  },
};

beforeEach(() => {
  signOut.mockReset();
  vi.mocked(useClerk).mockReturnValue({
    signOut,
  } as unknown as ReturnType<typeof useClerk>);
});

describe("AuthControls", () => {
  it("renders a silent placeholder until Clerk has loaded", () => {
    mockUser({ isLoaded: false, isSignedIn: undefined, user: undefined });
    render(<AuthControls />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("links to the sign-in page when signed out", () => {
    mockUser({ isLoaded: true, isSignedIn: false, user: null });
    render(<AuthControls />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in"
    );
  });

  it("shows the learner's initials and name when signed in", () => {
    mockUser(signedIn);
    render(<AuthControls />);
    const trigger = screen.getByRole("button", {
      name: "Account menu for Lexi",
    });

    expect(trigger).toHaveTextContent("LN");
    expect(trigger).toHaveTextContent("Lexi");
  });

  it("shows the learner's photo instead of initials when they have one", () => {
    mockUser({
      ...signedIn,
      user: {
        ...signedIn.user,
        hasImage: true,
        imageUrl: "https://img.clerk.com/lexi.png",
      },
    });
    render(<AuthControls />);
    const trigger = screen.getByRole("button", {
      name: "Account menu for Lexi",
    });
    const photo = trigger.querySelector("img");

    expect(photo?.getAttribute("src")).toContain(
      encodeURIComponent("https://img.clerk.com/lexi.png")
    );
    expect(trigger).not.toHaveTextContent("LN");
  });

  it("keeps the initials when the learner has no photo", () => {
    mockUser(signedIn);
    render(<AuthControls />);
    const trigger = screen.getByRole("button", {
      name: "Account menu for Lexi",
    });

    expect(trigger.querySelector("img")).toBeNull();
    expect(trigger).toHaveTextContent("LN");
  });

  it("signs out from the account menu and stays on the current page", async () => {
    mockUser(signedIn);
    render(<AuthControls />);

    await userEvent.click(
      screen.getByRole("button", { name: "Account menu for Lexi" })
    );

    expect(screen.getByText("lexi@example.com")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(signOut).toHaveBeenCalledWith({
      redirectUrl: window.location.pathname,
    });
  });

  it("links admins to the admin panel", async () => {
    mockUser({
      ...signedIn,
      user: { ...signedIn.user, publicMetadata: { role: "admin" } },
    });
    render(<AuthControls />);

    await userEvent.click(
      screen.getByRole("button", { name: "Account menu for Lexi" })
    );

    expect(screen.getByRole("menuitem", { name: "Admin" })).toHaveAttribute(
      "href",
      "/admin"
    );
  });

  it("hides the admin link from everyone else", async () => {
    mockUser(signedIn);
    render(<AuthControls />);

    await userEvent.click(
      screen.getByRole("button", { name: "Account menu for Lexi" })
    );

    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeVisible();
    expect(screen.queryByRole("menuitem", { name: "Admin" })).toBeNull();
  });
});
