# Luminore video placement preview

Prebuilt, standalone preview of three video placements on desktop and mobile.
Video is muted, plays automatically near the viewport, and loops with a soft transition.
No local server or build step is required on the hosting provider.

Open `/compare` to compare the three options, or `/compare?device=desktop` for desktop.
The variant pages are `/?videoOption=1`, `/?videoOption=2`, and `/?videoOption=3`.

On Vercel, import this directory with Framework Preset **Other**, no build or install
command, and Output Directory `.`. Verify the resulting link in a private browser
window; preview access may depend on the project's deployment protection settings.
