# Luminore Jewelry

React and Tailwind website served and built with Bun 1.3.9.

```sh
bun install --frozen-lockfile
bun run dev
```

Development runs at http://localhost:3000. Use `PORT=3001 bun run dev` for another port.

```sh
bun run check:assets
bun run build
bun run start
```

`start` runs the Bun server in production mode. Vercel uses the static `dist/` build and the routing rules in `vercel.json`.

## Project layout

- `src/components/`: site components and page views.
- `src/data/`: curated product and blog content.
- `src/i18n/`: language state and translations.
- `public/`: deployable website assets only. Existing product and blog URLs are preserved.
- `docs/`: brand documentation.
- `scripts/`: asset validation and the legacy inventory importer.
- `source-materials/`: local, ignored originals, inventory documents, design drafts, and unused assets. Back these up separately; they are not included in Git or deployment.

Use Bun exclusively and commit `bun.lock` whenever dependencies change. Generated output, dependencies, credentials, and personal tool settings are ignored.

## Asset changes

Keep all product gallery images, including secondary views. Match paths and filename casing exactly. Run `bun run check:assets` and `bun run build` after asset edits. The build rejects unexpected public file types and hidden files, preventing source documents from being published.

Before committing, inspect `git diff --check`, `git diff --stat`, and `git status --short`. Verify desktop and mobile homepages, product galleries, blog pages, language switching, direct page navigation, and mobile video playback.

## Inventory importer

`src/data/products.ts` is the curated source of truth. The legacy Python importer requires `openpyxl` and the original spreadsheet schema. It produces a draft for manual comparison; it must not overwrite curated content directly.

```sh
python3 scripts/convert_excel_to_ts.py source-materials/inventory/Jewelry_Inventory_Final11.xlsx /tmp/products-draft.ts
```

## Current limitation

The contact form validates input and displays a success state locally, but does not send or store inquiries. Connect a submission service before relying on it for customer messages. Existing email and messenger links are separate contact options.

## Atelier design preview

The selected white atelier direction is isolated at `/preview/atelier` on branch `codex/atelier-preview`. Its component and styles live in `src/previews/`; the existing homepage remains at `/`. Collection and bespoke actions return to the existing site sections. The generated hero is concept photography, not an inventory product image. This preview is not linked from the main navigation.
