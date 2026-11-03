import { describe, it, expect } from "vitest";
import { validarDocumentoEspanol, provinciaDesdeCP, normalizarNombre } from "./validacionEs";

describe("validacionEs", () => {
  it("acepta DNI con letra correcta y rechaza letra incorrecta", () => {
    expect(validarDocumentoEspanol("12345678Z")).toBe(true);
    expect(validarDocumentoEspanol("12345678A")).toBe(false);
  });
  it("acepta NIE válido", () => {
    expect(validarDocumentoEspanol("X1234567L")).toBe(true);
    expect(validarDocumentoEspanol("X1234567A")).toBe(false);
  });
  it("acepta CIF válido", () => {
    expect(validarDocumentoEspanol("B12345674")).toBe(true);
    expect(validarDocumentoEspanol("B12345670")).toBe(false);
  });
  it("CP 30820 es Murcia; 53000 no existe", () => {
    expect(provinciaDesdeCP("30820")).toBe("Murcia");
    expect(provinciaDesdeCP("53000")).toBeNull();
    expect(provinciaDesdeCP("3082")).toBeNull();
  });
  it("nombre en mayúsculas sin espacios dobles", () => {
    expect(normalizarNombre("  josé   pérez ")).toBe("JOSÉ PÉREZ");
  });
});
