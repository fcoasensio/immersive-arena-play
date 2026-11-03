// Copia de src/lib/validacionEs.ts
export const PROVINCIAS: Record<string, string> = {
  "01": "Álava", "02": "Albacete", "03": "Alicante", "04": "Almería", "05": "Ávila", "06": "Badajoz",
  "07": "Illes Balears", "08": "Barcelona", "09": "Burgos", "10": "Cáceres", "11": "Cádiz", "12": "Castellón",
  "13": "Ciudad Real", "14": "Córdoba", "15": "A Coruña", "16": "Cuenca", "17": "Girona", "18": "Granada",
  "19": "Guadalajara", "20": "Gipuzkoa", "21": "Huelva", "22": "Huesca", "23": "Jaén", "24": "León",
  "25": "Lleida", "26": "La Rioja", "27": "Lugo", "28": "Madrid", "29": "Málaga", "30": "Murcia",
  "31": "Navarra", "32": "Ourense", "33": "Asturias", "34": "Palencia", "35": "Las Palmas", "36": "Pontevedra",
  "37": "Salamanca", "38": "Santa Cruz de Tenerife", "39": "Cantabria", "40": "Segovia", "41": "Sevilla",
  "42": "Soria", "43": "Tarragona", "44": "Teruel", "45": "Toledo", "46": "Valencia", "47": "Valladolid",
  "48": "Bizkaia", "49": "Zamora", "50": "Zaragoza", "51": "Ceuta", "52": "Melilla",
};

export function normalizarDocumento(doc: string): string {
  return doc.trim().toUpperCase().replace(/[\s.-]/g, "");
}

export function normalizarNombre(nombre: string): string {
  return nombre.trim().replace(/\s+/g, " ").toLocaleUpperCase("es-ES");
}

export function provinciaDesdeCP(cp: string): string | null {
  const c = cp.trim();
  if (!/^\d{5}$/.test(c)) return null;
  return PROVINCIAS[c.slice(0, 2)] ?? null;
}

const LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function validarDocumentoEspanol(doc: string): boolean {
  const d = normalizarDocumento(doc);
  let m = d.match(/^(\d{8})([A-Z])$/);
  if (m) return LETRAS[parseInt(m[1], 10) % 23] === m[2];
  m = d.match(/^([XYZ])(\d{7})([A-Z])$/);
  if (m) return LETRAS[parseInt({ X: "0", Y: "1", Z: "2" }[m[1] as "X"] + m[2], 10) % 23] === m[3];
  m = d.match(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/);
  if (m) {
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const n = parseInt(m[2][i], 10);
      if (i % 2 === 0) { const x = n * 2; sum += Math.floor(x / 10) + (x % 10); } else sum += n;
    }
    const dig = (10 - (sum % 10)) % 10;
    return m[3] === String(dig) || m[3] === "JABCDEFGHI"[dig];
  }
  return false;
}
