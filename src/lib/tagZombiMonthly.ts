export function normalizeTagZombiEmail(email: string) {
  return email.trim().toLowerCase();
}

export function tagZombiMonthKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  if (!year || !month) throw new Error("No se pudo calcular el mes");
  return `${year}-${month}`;
}

export function tagZombiMonthlyIdentity(email: string, date: Date) {
  return `${normalizeTagZombiEmail(email)}|${tagZombiMonthKey(date)}`;
}
