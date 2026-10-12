import { describe, expect, it } from "vitest";

import {
  getDisplayName,
  getInitials,
  type DisplayUser,
} from "@/features/auth/services/user-display/user-display";

const empty: DisplayUser = {
  firstName: null,
  lastName: null,
  username: null,
  email: null,
};

describe("getDisplayName", () => {
  it("prefers the first name", () => {
    expect(
      getDisplayName({
        firstName: "Lexi",
        lastName: "Nowak",
        username: "lexi-dev",
        email: "lexi@example.com",
      })
    ).toBe("Lexi");
  });

  it("falls back to the username, then the email name", () => {
    expect(getDisplayName({ ...empty, username: "lexi-dev" })).toBe("lexi-dev");
    expect(getDisplayName({ ...empty, email: "lexi@example.com" })).toBe(
      "lexi"
    );
  });

  it("ignores blank values", () => {
    expect(
      getDisplayName({ ...empty, firstName: "  ", username: "lexi" })
    ).toBe("lexi");
  });

  it("has a generic label when nothing is known", () => {
    expect(getDisplayName(empty)).toBe("Account");
  });
});

describe("getInitials", () => {
  it("uses first and last name", () => {
    expect(
      getInitials({ ...empty, firstName: "lexi", lastName: "nowak" })
    ).toBe("LN");
  });

  it("uses two letters of the display name otherwise", () => {
    expect(getInitials({ ...empty, firstName: "Lexi" })).toBe("LE");
    expect(getInitials({ ...empty, email: "martyna@example.com" })).toBe("MA");
    expect(getInitials(empty)).toBe("AC");
  });
});
