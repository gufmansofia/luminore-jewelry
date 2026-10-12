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

The hero uses the supplied jewellery portrait on desktop and mobile in the same 7:9 media frame. Mobile keeps the white header above it and compact uppercase Garamond collection and design links directly beneath it, without the introductory copy or playback icon. Desktop retains its introductory copy with Garamond action links. The desktop jewellery spotlight has no gradient mask over the products, while mobile retains the approved fading. Desktop has 86px of space above the following category section. The five main homepage section headings share one responsive size.

Enquiry forms prepare a message for the customer to review and send through Telegram or WhatsApp. They do not send or store enquiries automatically.

## Publication

The existing Vercel project builds the GitHub `main` branch and serves `https://www.luminorejewelry.com`. The Vercel project address is `https://luminore-jewelry.vercel.app`. Push the complete approved working website, including its `src/`, `public/`, build scripts and lockfile. Vercel installs the locked dependencies and builds `dist/` from those sources.

Before publishing, run the asset check, build and relevant tests. After deployment, verify that the deployment commit matches the pushed commit and compare its JavaScript, CSS and media with the local build. Check the current desktop and mobile homepage; do not use an older branch or design preview as the source. Local review output, rollback copies and source video edits remain outside Git.

## SEO

English, Russian and Ukrainian use separate crawlable URLs with reciprocal `hreflang` links. Canonicals, sitemap entries, social URLs and structured data use the production origin in `src/lib/seo.ts`. Each public page is rendered to HTML before JavaScript runs; pagination keeps its own canonical. Preview and missing pages are excluded from the sitemap and marked `noindex`.

Search titles and descriptions are unique within each language. Products with matching names use their visible listed weights to distinguish search titles; page headings retain the approved product names. Product schema uses the listed USD price and specifications. Availability, review ratings, shipping prices and return deadlines must only be added when confirmed and reflected on the page. Article sitemap modification dates come from the recorded article revision date.

Run `bun run check:assets`, `bun run build`, `bun run test:seo` and `bun run test:catalogue` when changing SEO metadata or catalogue data. The SEO tests verify all public localized pages, canonical origin, unique metadata, product facts, catalogue order, article dates and crawlable links.

Search Console setup remains an account task: add the Domain property `luminorejewelry.com`, verify ownership with the TXT record Google supplies, and submit `https://www.luminorejewelry.com/sitemap.xml`. Do not replace existing DNS records. Use URL Inspection on the homepage, language variants, a category and a product; then review indexing, search queries and Core Web Vitals after data becomes available. Search Console ownership and sitemap submission have not been completed by the website build.

An alternative submission URL is `https://www.luminorejewelry.com/sitemap-index.xml`. It points to `sitemap-en.xml`, `sitemap-ru.xml` and `sitemap-uk.xml`, generated from the same public routes and language alternates as the combined sitemap. The index covers all public URLs without relying on a fetch of the combined `sitemap.xml`; use one submission URL for setup. A successful submission confirms registration of the URL, while the report's Success status confirms Google fetched and processed it.

The initial search topics follow the real catalogue: diamond jewellery; diamond rings, earrings, bracelets, pendants and necklaces; custom diamond jewellery; and the existing guides to care, certification and natural versus lab-grown diamonds, in all three languages. No search-volume estimates or country-specific claims have been assumed. Refine topics and content using Search Console data once the domain is verified.
