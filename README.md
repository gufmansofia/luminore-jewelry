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

## Current website

The approved atelier design is the homepage at `/`. It includes the hero video, category preview, manager contact icons, a compact collection preview (three cards on desktop and four on mobile), the bespoke film and enquiry form, and the journal. `/collection` contains the complete catalogue. The catalogue has category and sorting controls; the budget filter has been removed.

The hero uses the approved looping hand film at 1080p on desktop. On mobile, the supplied jewellery portrait fills the same 7:9 media frame, with the white header above it and compact uppercase Garamond collection and design links directly beneath it, without the introductory copy or playback icon. Desktop retains its introductory copy with Garamond action links. The five main homepage section headings share one responsive size.

Enquiry forms prepare a message for the customer to review and send through Telegram or WhatsApp. They do not send or store enquiries automatically.

## Publication

The existing Vercel project builds the GitHub `main` branch and serves `https://luminore-jewelry.vercel.app`. Push the complete approved working website, including its `src/`, `public/`, build scripts and lockfile. Vercel installs the locked dependencies and builds `dist/` from those sources.

Before publishing, run the asset check, build and relevant tests. After deployment, verify that the deployment commit matches the pushed commit and compare its JavaScript, CSS and media with the local build. Check the current desktop and mobile homepage; do not use an older branch or design preview as the source. Local review output, rollback copies and source video edits remain outside Git.
