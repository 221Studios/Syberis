import { describe, expect, it } from "vitest";
import { mailHref, telHref } from "@/lib/contact";
import {
  LITTERS,
  PARENTS,
  countByStatus,
  getCurrentLitter,
  getLitter,
  getParent,
  litterSlug,
} from "@/data/kennel";

describe("contact links", () => {
  it("normalizes a Polish phone number for a tel link", () => {
    expect(telHref("512 974 084")).toBe("tel:+48512974084");
  });

  it("creates a mailto link", () => {
    expect(mailHref("hello@example.com")).toBe("mailto:hello@example.com");
  });
});

describe("kennel data interface", () => {
  it("resolves each litter and its parents", () => {
    for (const litter of LITTERS) {
      expect(getLitter(litterSlug(litter))).toBe(litter);
      expect(getParent(litter.sireSlug)).not.toBeNull();
      expect(getParent(litter.damSlug)).not.toBeNull();
    }
  });

  it("has unique route slugs and one current litter", () => {
    const slugs = LITTERS.map(litterSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(LITTERS.filter(({ status }) => status === "current")).toHaveLength(
      1,
    );
    expect(getCurrentLitter()).toBe(
      LITTERS.find(({ status }) => status === "current"),
    );
  });

  it("keeps litter letters unique per dam and matches puppy initials", () => {
    const litterKeys = LITTERS.map(
      ({ damSlug, letter }) => `${damSlug}:${letter}`,
    );
    expect(new Set(litterKeys).size).toBe(litterKeys.length);

    for (const litter of LITTERS) {
      for (const puppy of litter.puppies) {
        expect(puppy.name.startsWith(litter.letter)).toBe(true);
      }
    }
  });

  it("accounts for every puppy in a litter by status", () => {
    for (const litter of LITTERS) {
      const counted = ["free", "reserved", "sold"].reduce(
        (total, status) => total + countByStatus(litter.puppies, status),
        0,
      );
      expect(counted).toBe(litter.puppies.length);
    }
  });

  it("keeps parent slugs unique", () => {
    const slugs = PARENTS.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
