import { describe, expect, it } from "bun:test";
import { formatDay, formatLocation, formatTemperature } from "../../src/utils/format.ts";

describe("formatLocation", () => {
  it("devuelve solo el nombre cuando no hay admin1 ni country", () => {
    expect(formatLocation({ name: "Lima" })).toBe("Lima");
  });

  it("une nombre, admin1 y country con comas", () => {
    expect(formatLocation({ name: "Madrid", admin1: "Comunidad de Madrid", country: "España" })).toBe(
      "Madrid, Comunidad de Madrid, España",
    );
  });

  it("omite los campos undefined", () => {
    expect(formatLocation({ name: "Lisboa", country: "Portugal" })).toBe("Lisboa, Portugal");
    expect(formatLocation({ name: "Oslo", admin1: "Oslo" })).toBe("Oslo, Oslo");
  });
});

describe("formatTemperature", () => {
  it("formatea en celsius", () => {
    expect(formatTemperature(21.5, "celsius")).toBe("21.5°C");
  });

  it("formatea en fahrenheit", () => {
    expect(formatTemperature(68.2, "fahrenheit")).toBe("68.2°F");
  });
});

describe("formatDay", () => {
  it("formatea la fecha en es-ES con la inicial en mayúscula", () => {
    expect(formatDay("2026-09-01")).toBe("Martes, 1 sept");
  });

  it("formatea otra fecha con día y mes distintos", () => {
    expect(formatDay("2026-12-25")).toBe("Viernes, 25 dic");
    expect(formatDay("2026-01-06")).toBe("Martes, 6 ene");
  });
});
