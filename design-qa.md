# Bespoke pencil sketches — design QA

Date: 2026-10-04

final result: passed

## Scope and visual truth

Adapt two jewelry illustrations to the existing bespoke section and guided enquiry. The references are illustration assets, not complete interface mockups. Surrounding typography and form behavior follow the existing site. Prior About-section QA is preserved in `output/verification/bespoke-sketches/before/design-qa.md`.

Source visual truth:
- `public/bespoke-art/desktop-pencil.png`: 1672 × 941 pixels.
- `public/bespoke-art/mobile-pencil.png`: 1254 × 1254 pixels.
- User photographs: `/Users/sofia.personal/Desktop/d1cc5fa9faec958b-1600.webp` and `/Users/sofia.personal/Desktop/ec5404264ed6d4a0-1500.webp`.

Implementation: `http://localhost:3000/ru/bespoke` and the shared section on `/ru`.

## Captures and normalization

Evidence directory: `output/verification/bespoke-sketches/`.

Desktop uses a 1440 × 1000 CSS viewport. Full-page initial-selection capture `desktop-piece.jpg` is 1440 × 1617 pixels. Illustration measures 566.664 × 318.914 CSS pixels. `desktop-contact.jpg` shows the contact state.

Mobile uses the actual page in a 390 × 844 CSS-pixel iframe. Surrounding verification canvas was removed from `mobile-review-full.jpg` to produce `mobile-intro.jpg`, 390 × 844 pixels. Illustration measures 330 × 330 CSS pixels and loads the mobile source. `mobile-shape.jpg`, `mobile-contact.jpg`, and `mobile-contact-bottom.jpg` show the other states.

Narrow mobile uses a 320 × 844 CSS-pixel iframe. Content-only captures are `mobile-320.jpg` and `mobile-320-contact.jpg`. Illustration measures 280 × 280 CSS pixels. DOM scroll width equals viewport width at both mobile sizes.

Screenshots have one image pixel per CSS pixel. Assets were scaled to their measured slots for focused comparison, without artwork edits. `desktop-asset-comparison.jpg` and `mobile-asset-comparison.jpg` place the normalized source beside its browser crop. Both comparisons were opened with the source assets and rendered full-page views before this report. `responsive-preview.jpg` combines the desktop and mobile captures for presentation; unscaled captures were used to assess text and controls. `homepage-bespoke.jpg` records the shared homepage section and its lazy-loaded art.

## Findings

No actionable P0/P1/P2 differences remain within this change.

Fonts and typography: existing Cormorant Garamond display type and site body font remain in use. Bespoke heading is limited to 38–54 px with 1.08 line height, balancing the left column against the selection form. Russian heading wraps cleanly at 390 and 320 px. Labels remain legible without truncation.

Spacing and layout: desktop retains two columns with a 90 px gap. Illustration sits between the introduction and two-column process steps. Mobile stacks story, illustration, steps, and enquiry; artwork is capped at 330 px. White space separates drawings and controls. Art does not overlap fields or buttons. No horizontal overflow at either mobile width.

Colors and tokens: white drawing backgrounds blend with the existing section. Graphite pencil lines complement charcoal headings, muted body text, and pale gray enquiry surface. No new decorative colors or effects.

Image quality and fidelity: generated raster illustrations are used directly. Normalized comparison crops retain full subjects, construction lines, shading, and enlarged connectors. Mobile top stones are recognizable and fastening details have sufficient scale. No cropping, stretching, opacity reduction, or code-drawn replacements. Images are decorative and hidden from assistive technology; form controls retain their labels.

Copy and content: existing localized copy, process explanations, selection labels, and form instructions are retained. No tiny illustration labels compete with the interface.

## Interactions and validation

Desktop: earrings → laboratory diamonds → custom piece → contact form. Summary and focused name field inspected.

Mobile 390: rings → pear cut → natural diamonds → custom piece → contact form → locally prepared message. Jewelry, cut, and stone choices appear correctly in the message. No external message sent.

Mobile 320: direct discussion shortcut opens contact form; inputs remain inside viewport. Initial Next button is disabled before selection. Selection controls, shape icons, summary, focus state, fields, consent, and prepared-message state inspected. Desktop and mobile console error logs: none captured.

Asset check passed: 757 references. Experience tests: 6 passed, 2092 assertions. Interaction tests: 5 passed, 369 assertions. Isolated production build passed, prerendering 453 pages.

## Comparison history

The first source-to-rendered comparison found no actionable mismatch after matching illustration-slot size and removing verification canvas. No visual fixes were made after the comparison. Browser viewport-control timeouts were resolved using measured responsive iframes containing the actual site. This verifies responsive layout, not a physical device or its keyboard.

## Implementation checklist

- [x] Drawings saved as production assets and served locally.
- [x] Responsive source selection, intrinsic dimensions, and loading behavior set.
- [x] Desktop and mobile visually compared with source assets.
- [x] Selection and enquiry exercised in browser.
- [x] Build and relevant existing checks passed.

## Follow-up polish

No blocking polish issues. Physical-device keyboard behavior was outside this illustration and layout change.
