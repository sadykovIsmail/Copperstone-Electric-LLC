import { normalizeSiteContent } from "./siteContentData";

const STORAGE_KEY = "copperstone-site-content-draft";
const CHANGE_EVENT = "copperstone-site-content-change";

export function readStoredSiteContent() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function readStoredSiteContentWithFallback(defaultDraft) {
  return normalizeSiteContent(defaultDraft, readStoredSiteContent()) ?? defaultDraft;
}

export function saveStoredSiteContent(nextContent) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearStoredSiteContent() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export { STORAGE_KEY, CHANGE_EVENT };