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

## Publishing updates

- Permanent website: https://luminore-jewelry.vercel.app
- GitHub repository: https://github.com/gufmansofia/luminore-jewelry
- Production branch: `main`.
- Vercel automatically builds and publishes successful pushes to `main` at the same website address. Local edits alone are not published.
- Commit approved website changes, run the relevant checks and build, then push to `origin/main`. Wait for the Vercel deployment to succeed and verify the permanent URL before reporting that an update is live.
- Keep local reports, screenshots, source documents and credentials out of Git. Only website assets in `public/` are deployed. Do not use a deployment-specific preview URL as the permanent link.

```sh
bun run check:assets
bun run build
git push origin main
```

## Enquiries and page layout

The enquiry forms validate locally and prepare a message for Telegram or WhatsApp. The visitor reviews and sends that message in the chosen messenger; the website does not send it automatically.

The approved atelier layout is the homepage at `/`. The complete collection is at `/collection`, with three cards per desktop row and two per mobile row. English, Russian and Ukrainian pages are built as static HTML, including product and journal routes. The older `/preview/atelier` route remains available as a design reference.
