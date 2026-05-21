import { supabase } from "./supabase";

function resolveProjectImagePath(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  return supabase.storage.from("project-images").getPublicUrl(imagePath).data.publicUrl;
}

function mapProjectRow(row) {
  return {
    slug: row.slug,
    title: row.title,
    projectType: row.project_type,
    location: row.location,
    summary: row.summary ?? "",
    imagePath: resolveProjectImagePath(row.image_path),
    imageAlt: row.image_alt,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

export async function fetchFeaturedProjects() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("slug, title, project_type, location, summary, image_path, image_alt, is_featured, sort_order, created_at")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapProjectRow);
}
