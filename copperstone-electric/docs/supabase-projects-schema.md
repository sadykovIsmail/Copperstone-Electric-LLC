# Supabase Projects Schema

This issue sets up the first backend content model for Copperstone's admin workflow.

## Goal

Move the homepage projects section toward a real editable backend model without switching the live site to runtime fetching yet.

## Table

`public.projects`

Fields:

- `id`: UUID primary key.
- `slug`: stable identifier for routing, updates, and image naming.
- `title`: public project title shown on the site.
- `project_type`: short label like `Industrial`, `Retail`, or `Commercial`.
- `location`: city/state label shown with the project type.
- `summary`: short admin-managed description for future cards, modal content, or SEO snippets.
- `image_path`: storage path or public file path for the project image.
- `image_alt`: alt text for accessibility and future image rendering.
- `is_featured`: lets the admin choose whether the project belongs in the homepage set.
- `is_published`: allows draft/unpublished projects without deleting them.
- `sort_order`: controls homepage ordering without depending on creation date.
- `completed_at`: optional completion date for future sorting/filtering.
- `created_at`: audit timestamp.
- `updated_at`: audit timestamp updated automatically by trigger.

## Storage

Bucket:

- `project-images`

Plan:

- store homepage-ready project images in Supabase Storage
- keep the bucket publicly readable because the final site images are public anyway
- reserve upload/update/delete permissions for the later admin-auth issue
- keep allowed file types limited to `jpg`, `png`, and `webp`
- keep a 5 MB per-file limit for now

## Public Read Rules

This schema includes public read access only for:

- published project rows
- project images in the `project-images` bucket

Write policies are intentionally not added yet. They belong in the admin-auth issue so we do not accidentally allow all authenticated users to edit content.

## Local Data Alignment

The local `PROJECTS` array in `src/content/siteContent.js` now mirrors the planned backend shape more closely:

- `slug`
- `title`
- `projectType`
- `location`
- `summary`
- `imagePath`
- `imageAlt`
- `isFeatured`
- `sortOrder`

That keeps the current static site working while reducing future migration churn.

## Next Step

After this schema step, the next issue should:

1. connect the project to Supabase config safely
2. add admin authentication and route protection
3. build project CRUD screens
4. replace the local project source with Supabase-backed build data
