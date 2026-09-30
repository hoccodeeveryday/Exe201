import { describe, it, expect } from "vitest";
import { NAV, ADMIN_NAV } from "@/data/mock/nav";

describe("Navigation", () => {
  it("user NAV has 8 items", () => {
    expect(NAV).toHaveLength(8);
  });

  it("admin NAV has 5 items", () => {
    expect(ADMIN_NAV).toHaveLength(5);
  });

  it("admin NAV items only allow admin role", () => {
    ADMIN_NAV.forEach(item => {
      expect(item.roles).toContain("admin");
      expect(item.roles).not.toContain("user");
    });
  });

  it("user NAV items allow both user and admin", () => {
    NAV.forEach(item => {
      expect(item.roles).toContain("user");
      expect(item.roles).toContain("admin");
    });
  });

  it("all nav items have valid paths starting with /", () => {
    [...NAV, ...ADMIN_NAV].forEach(item => {
      expect(item.path).toMatch(/^\//);
    });
  });
});