# Running & Deployment

## Prerequisites

- Any static HTTP server (service workers require HTTP/HTTPS; `file://` will not work reliably).
- A modern mobile browser for full feature support:
  - Web Share API for photo sharing (`navigator.share`) ([index.html:L1406-L1423](file:///workspace/index.html#L1406-L1423))

## Run locally

From the repository root:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/`

## PWA path configuration (important)

The PWA manifest and service worker are currently configured to run under the subpath:

- `/CONTROLEFLVFILIAL-18/`

See:

- `start_url` + `scope` in [manifest.json](file:///workspace/manifest.json)
- `APP_FILES` cache list in [sw.js](file:///workspace/sw.js)

If you serve the app at `/` (common for local development), installation/offline caching may not behave as intended because the cached URLs do not match the served paths.

Options:

- Serve the app at the expected subpath (deploy into `/CONTROLEFLVFILIAL-18/`).
- Or update both [manifest.json](file:///workspace/manifest.json) and [sw.js](file:///workspace/sw.js) to use `/` paths for local/dev deployments.

## Common tasks

### Reset local data

The app stores all data in the browser. To reset:

- Clear site data in the browser settings, or
- Open DevTools → Application → Local Storage and delete the keys described in [Data Model & Storage](data.md).

### Premium unlocking

Premium is enabled by an expiry timestamp in `localStorage`:

- User code: `FLV15` (31 days) ([index.html:L1521-L1538](file:///workspace/index.html#L1521-L1538))
- Admin panel: click the logo 5 times to reveal controls ([index.html:L1542-L1556](file:///workspace/index.html#L1542-L1556))

## Tests

No automated test suite is present in this repository. Validation is currently manual:

- Run the static server
- Exercise major flows:
  - Cadastro de Produtos (cost calculation + persistence)
  - Quebra do Dia (add/edit/delete)
  - Resultado Tratativa (approve/partial/reject)
  - Venda do Dia (add/edit/delete)
  - Dashboard and monthly results
  - Offline load (after first visit) if deployed under the configured subpath

