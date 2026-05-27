import { useEffect, useState } from "react";

const DISMISS_KEY = "sar_leadPopupDismissedUntil";
const SUBMIT_KEY = "sar_leadPopupSubmittedUntil";
const TIME_DELAY_MS = 8000;
const SCROLL_THRESHOLD = 0.4;
const DISMISS_DAYS = 7;
const SUBMIT_DAYS = 30;

const isSuppressed = (): boolean => {
  try {
    const now = Date.now();
    const d = localStorage.getItem(DISMISS_KEY);
    const s = localStorage.getItem(SUBMIT_KEY);
    if (d && parseInt(d, 10) > now) return true;
    if (s && parseInt(s, 10) > now) return true;
  } catch {
    // ignore
  }
  return false;
};

export function markDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400_000));
  } catch {/* ignore */}
}

export function markSubmitted() {
  try {
    localStorage.setItem(SUBMIT_KEY, String(Date.now() + SUBMIT_DAYS * 86400_000));
  } catch {/* ignore */}
}

export function useLeadPopupTrigger(enabled = true) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (isSuppressed()) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    };

    const timer = window.setTimeout(trigger, TIME_DELAY_MS);

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      if (scrollTop / docHeight > SCROLL_THRESHOLD) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return { open, setOpen };
}
