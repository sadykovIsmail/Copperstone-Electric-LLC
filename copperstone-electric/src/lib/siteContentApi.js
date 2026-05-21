import { supabase, hasSupabaseConfig } from "./supabase";
import { SITE_CONTENT_PAGE_ID, createDefaultSiteContent, normalizeSiteContent } from "./siteContentData";

const PUBLISH_EVENT = "copperstone-site-content-published";

export async function readPublishedSiteContent() {
  if (!hasSupabaseConfig || !supabase) return createDefaultSiteContent();

  const defaults = createDefaultSiteContent();
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", SITE_CONTENT_PAGE_ID)
    .maybeSingle();

  if (error || !data?.content) {
    return defaults;
  }

  return normalizeSiteContent(defaults, data.content);
}

export async function savePublishedSiteContent(content) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const defaults = createDefaultSiteContent();
  const normalized = normalizeSiteContent(defaults, content);
  const { error } = await supabase.from("site_content").upsert({
    id: SITE_CONTENT_PAGE_ID,
    content: normalized,
  });

  if (error) {
    throw error;
  }

  window.dispatchEvent(new Event(PUBLISH_EVENT));
  return normalized;
}

export { PUBLISH_EVENT };