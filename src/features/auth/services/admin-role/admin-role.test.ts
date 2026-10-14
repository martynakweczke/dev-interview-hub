import { describe, expect, it } from "vitest";

import {
  ADMIN_ROLE,
  isAdmin,
} from "@/features/auth/services/admin-role/admin-role";

describe("isAdmin", () => {
  it("accepts the admin role from the session metadata", () => {
    expect(isAdmin({ metadata: { role: ADMIN_ROLE } })).toBe(true);
  });

  it("rejects any other role", () => {
    expect(isAdmin({ metadata: { role: "editor" } })).toBe(false);
    expect(isAdmin({ metadata: { role: "Admin" } })).toBe(false);
  });

  it("rejects metadata without a role", () => {
    expect(isAdmin({ metadata: {} })).toBe(false);
  });

  it("rejects claims without metadata", () => {
    expect(isAdmin({})).toBe(false);
    expect(isAdmin({ metadata: null })).toBe(false);
    expect(isAdmin({ metadata: "admin" })).toBe(false);
  });

  it("rejects a missing session", () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});
