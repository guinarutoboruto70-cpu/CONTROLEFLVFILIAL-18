# Architecture

## High-level overview

The application is a browser-only single-page app (SPA) delivered as static files:

- [index.html](file:///workspace/index.html) contains:
  - All UI screens (HTML)
  - Styles (inline CSS)
  - All application logic (inline JavaScript in an IIFE)
- [manifest.json](file:///workspace/manifest.json) enables installation as a PWA (name, icons, start URL).
- [sw.js](file:///workspace/sw.js) provides offline caching (cache-first fallback when the network is unavailable).

There is no build step, no bundler, and no external dependencies.

## Runtime lifecycle

Application initialization happens on `DOMContentLoaded`:

- `carregarBase()` loads/migrates the product base into `localStorage` ([index.html:L519-L543](file:///workspace/index.html#L519-L543))
- `bind()` wires up all UI event handlers and feature gating ([index.html:L1539-L1640](file:///workspace/index.html#L1539-L1640))
- `registrarServiceWorker()` registers [sw.js](file:///workspace/sw.js) ([index.html:L1642-L1651](file:///workspace/index.html#L1642-L1651))

## UI architecture (“screens”)

UI is organized into multiple `<div class="screen" id="telaX">` sections. Navigation is done by toggling the `.active` CSS class:

- Router: `ir(t)` ([index.html:L338-L342](file:///workspace/index.html#L338-L342))

The “Menu” screen (tela1) links to other screens such as:

- tela2: Tratativa creation
- tela3: Envio (WhatsApp text + photo share)
- tela8: Cadastro de Produtos
- tela10: Quebra do Dia
- tela11: Venda do Dia
- tela12: Resultado Tratativa
- tela13: Resultado Mensal
- tela14: Dashboard

## Offline / PWA

The PWA behavior is provided by:

- Manifest configuration: `start_url` and `scope` are set to `/CONTROLEFLVFILIAL-18/` ([manifest.json](file:///workspace/manifest.json))
- Service worker cache list uses the same base path ([sw.js:L1-L9](file:///workspace/sw.js#L1-L9))

The service worker:

- Pre-caches a fixed set of URLs on install
- Deletes old caches on activate
- Responds to fetches with “network first, cache fallback” ([sw.js:L11-L33](file:///workspace/sw.js#L11-L33))

## Dependency relationships

- `index.html` depends on:
  - Browser Web APIs: `localStorage`, `fetch`, `caches`, `serviceWorker`, `navigator.share` (Web Share API), `window.open` (WhatsApp deep-link).
  - Static assets: `/icons/icon-192.png`, `/icons/icon-512.png`.
- `sw.js` depends on:
  - Cache Storage API (`caches.open`, `caches.match`)
  - Fetch API (`fetch(event.request)`)

There are no third-party libraries.

