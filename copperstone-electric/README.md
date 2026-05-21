# Copperstone Electric

Marketing site for Copperstone Electric LLC built with React and Vite.

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Current Content Structure

Homepage content currently lives in:

- `src/content/siteContent.js`

That file is the temporary source of truth until the admin workflow is connected to Supabase.

## Supabase Work

The project is being moved toward:

- admin-managed project content
- static rebuilds after content changes
- no per-visitor runtime content fetch for the public homepage

Issue `#4` adds the first Supabase schema artifacts:

- migration: `supabase/migrations/202605210001_create_projects.sql`
- schema notes: `docs/supabase-projects-schema.md`
- env template: `.env.example`

## Deployment

The site is deployed from the built `dist` folder.
