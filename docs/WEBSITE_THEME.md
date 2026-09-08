# Website theme

The website uses a refined monochrome palette, with Satoshi typography and the existing layout.

| Role | Color |
| --- | --- |
| Ink / dark surfaces | `#111111` |
| White / light surfaces | `#f5f5f5` |
| Graphite / secondary text | `#525252` |
| Silver / dark-section accents | `#d4d4d4` |
| Charcoal / light-section accents | `#333333` |

Tokens live in `src/index.css`. Light sections use `data-theme="light"` to switch accent and action colors. Filled actions pair white with ink on dark sections, and charcoal with white on light sections. Use semantic Tailwind colors (`ink`, `silver`, `graphite`, `accent`) rather than hex values in components.

Hero imagery and mobile video use a presentation-only grayscale filter. Catalog photography keeps its original colors so customers can judge the jewelry accurately. The SVG favicon uses neutral gray. Keyboard focus indicators and reduced-motion preferences are supported.

## Typography

Satoshi is served by the official Fontshare stylesheet in `src/index.html`. Headings, navigation, and body text share the `--font-site` stack in `src/index.css`; system sans-serif fonts cover missing glyphs, including Cyrillic. Existing logo artwork is unchanged. Fontshare requires network access; the system font stack is also the loading/offline fallback.
