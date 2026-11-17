import { describe, expect, it } from "vitest";
import { tagZombiMonthlyIdentity, tagZombiMonthKey } from "./tagZombiMonthly";

describe("límite mensual de Tag Zombi", () => {
  it("identifica a la misma persona aunque escriba el email con espacios o mayúsculas", () => {
    const date = new Date("2026-11-17T12:00:00+01:00");
    expect(tagZombiMonthlyIdentity(" Pedro@Example.com ", date)).toBe(tagZombiMonthlyIdentity("pedro@example.com", date));
  });

  it("cambia la identidad mensual al cambiar de mes natural en Madrid", () => {
    const email = "pedro@example.com";
    expect(tagZombiMonthlyIdentity(email, new Date("2026-11-30T23:30:00+01:00"))).not.toBe(
      tagZombiMonthlyIdentity(email, new Date("2026-12-01T00:30:00+01:00")),
    );
  });

  it("no confunde a dos personas distintas en el mismo mes", () => {
    const date = new Date("2026-11-17T12:00:00+01:00");
    expect(tagZombiMonthlyIdentity("uno@example.com", date)).not.toBe(tagZombiMonthlyIdentity("dos@example.com", date));
  });

  it("usa el mes de Madrid también al cruzar un día UTC", () => {
    expect(tagZombiMonthKey(new Date("2026-11-30T23:30:00Z"))).toBe("2026-12");
  });
});
