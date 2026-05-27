const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmParams = Record<(typeof UTM_KEYS)[number], string>;

const STORAGE_KEY = "sar_utm_params";

export function captureUtmsFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const captured: Partial<UtmParams> = {};
    let any = false;
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) {
        captured[k] = v.slice(0, 100);
        any = true;
      }
    }
    if (any) {
      const existing = getStoredUtms();
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...captured }));
    }
  } catch {
    // ignore
  }
}

export function getStoredUtms(): Partial<UtmParams> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getAllUtms(): UtmParams {
  const stored = getStoredUtms();
  return {
    utm_source: stored.utm_source || "",
    utm_medium: stored.utm_medium || "",
    utm_campaign: stored.utm_campaign || "",
    utm_content: stored.utm_content || "",
    utm_term: stored.utm_term || "",
  };
}
