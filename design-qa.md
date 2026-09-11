# Atelier preview design QA

final result: passed

## Evidence
- Selected visual: second displayed concept, `exec-6d5fe570-603c-4fec-8ecb-fd5843ddfcb5.png` in the session's generated_images directory.
- Implementation: `/preview/atelier`; desktop capture `/tmp/atelier-desktop.png`; mobile capture `/tmp/atelier-mobile-viewport.png`.
- Desktop source: 1487 × 1058 pixels. Implementation: 1487 × 1058 CSS viewport and screenshot pixels; no rescaling required.
- Mobile: 390 × 844 CSS viewport and screenshot pixels. The full-page browser capture had a capture artifact, so the viewport capture was used for review.
- Source and implementation were opened together for direct visual comparison. State: English, page top.

## Findings
No remaining P0/P1/P2 findings. The white split composition, heading wrapping, hierarchy, image region, masthead, and closing divider match the selected direction.

### Required surfaces
- Typography: Cormorant Garamond display and descriptive text, Manrope navigation. Two-line headline and italic emphasis preserved. Real web-font metrics differ slightly from the generated concept.
- Spacing: 78px header, 24px hero gap, equal-width columns, 824px desktop image. Supporting text and CTA sit slightly lower than the mock (P3).
- Colors: white, charcoal, neutral gray dividers. Contrast preserved.
- Imagery: generated standalone ring photograph follows the source composition and stationery art direction; its ring angle and embossing differ slightly (P3). It is conceptual editorial imagery, not a catalog product record.
- Content: English source copy retained; Ukrainian and Russian translations available. Navigation and primary links connect to the existing homepage sections.
- Focused review: headline, CTA, and navigation are legible at full capture resolution; no separate crop was needed.

## Interaction checks
- Discover the collection navigates to the existing catalog, section top approximately 80px below viewport top.
- Create your own navigates to the existing custom-order section, top approximately 80px below viewport top.
- Language selector changes the visible heading/navigation to Ukrainian and back to English.
- Mobile English and Ukrainian layouts have no horizontal overflow (390px document width).
- Browser error log empty during verification.
- Production build and local asset check pass.

## Isolation
Separate branch `codex/atelier-preview`, separate route, scoped stylesheet. Main homepage components and global typography are unchanged. Preview adds a client-side noindex directive; it is not an access control mechanism.

## Comparison history
First desktop pass showed no blocking drift. Mobile viewport capture replaced a malformed full-page capture; DOM measurements confirmed no actual overflow. No P0/P1/P2 code corrections were required.

## Follow-up polish
- Optional: add the small directional icon from the reference to the collection button.
- Optional: refine photograph angle and the 15–20px CTA offset after feedback.

## Mobile refinement — 2026-09-09
User authorized a more luxurious mobile treatment after reviewing the original mobile screenshots. Updated only the mobile layout: one-row masthead with native disclosure menu, inset shorter image, centered serif headline, restrained full-width collection action, and finer rules. Desktop remains unchanged. Reviewed the new 390 × 844 viewport capture at `atelier-refined-mobile.png` in the session visualization directory against the earlier mobile capture. Headline and both actions now fit in the initial viewport. Native menu opens and closes and exposes all four navigation links. No horizontal overflow or browser errors. Intentional mobile departures from the desktop source are user-directed; no remaining P0/P1/P2 findings.

## Extended sections — 2026-09-09
Added collection, philosophy, bespoke, journal, and contact sections for user approval. Existing hero and three-line mobile menu preserved. Header and hero actions now use local preview anchors, superseding the original navigation checks above.

Reviewed desktop screenshots at 1200 × 900 and mobile collection/bespoke screenshots at 390 × 844. Desktop philosophy evidence: `/tmp/atelier-philosophy-desktop.png`. Mobile collection evidence: `/tmp/atelier-collection-mobile.png`. All images loaded; no horizontal overflow at 390 or 1440 pixels. Product images use contain to preserve the whole piece. Neutral gray philosophy panel and charcoal footer continue the selected typography and palette. No blocking visual findings in reviewed sections.

Verified Earrings filtering and expand/collapse (18 total products), local anchor navigation, and rendered product/article destinations. Browser error log empty. Production build, 86 local asset references, and diff whitespace check pass. Product and article detail pages retain their existing design. Changes remain isolated to the preview pending user approval.

final result: passed

## Restored graphite sections — 2026-09-11
User selected the latest atelier hero with the original graphite homepage sections. Reused the existing About, Products, CTA, Testimonials, Blogs, Contact, Footer, and BackToTop components outside the atelier CSS scope. Removed the rejected replacement sections and their unused CSS. Hero and menu appearance preserved. Browser verification found all anchor destinations and no horizontal overflow at 652px; hero screenshot reviewed. Production build and asset validation pass. Earlier extended-section QA is historical and no longer describes the current preview.
