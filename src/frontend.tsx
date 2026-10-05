/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot, hydrateRoot } from "react-dom/client";
import {pathLanguage} from "./lib/locale-path";
import { App } from "./App";

async function start() {
  const element = document.getElementById("root")!;
  const query = new URLSearchParams(window.location.search);
  const legacyLanguage = query.get('lang');
  if (legacyLanguage === 'ru' || legacyLanguage === 'uk' || legacyLanguage === 'en') {
    query.delete('lang');
    const { localePath } = await import('./lib/locale-path');
    const search = query.toString();
    window.location.replace(localePath(window.location.pathname, legacyLanguage) + (search ? '?' + search : '') + window.location.hash);
    return;
  }
  if (element.dataset.prerendered === 'true' && document.documentElement.lang === pathLanguage(window.location.pathname)) hydrateRoot(element, <App />, {identifierPrefix:'luminore-'});
  else createRoot(element, {identifierPrefix:'luminore-'}).render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
