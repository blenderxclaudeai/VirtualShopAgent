# VirtualShopAgent Monorepo

One repository containing:
- `extension/` Chrome Extension (Manifest V3)
- `supabase/` Supabase project config + Edge Functions
- `web/` dashboard app
- `docs/` architecture and roadmap

> Note: the old `backend/` FastAPI scaffold is deprecated and no longer used for primary VTO flow.

## End-to-end MVP flow

1. User opens an ecommerce product page.
2. Extension injects **Try with VTO** button.
3. Extension extracts product payload and sends it to Supabase Edge Function `tryon-request`.
4. Edge Function returns `{ "resultImageUrl": "..." }`.
5. Extension displays returned image in overlay.

## Project structure

```text
/extension
/supabase
/web
/docs
.env.example
README.md
```

## Configuration

Copy and configure env:

```bash
cp .env.example .env
```

Update:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_FUNCTIONS_BASE`
- `VTO_FUNCTION_TRYON`

For the extension, set values in `extension/config.js` (no secrets).

## Run dashboard (`/web`)

```bash
cd web
npm install
npm run dev
```

## Supabase Edge Functions

Install/login Supabase CLI, then deploy:

```bash
supabase functions deploy tryon-request
```

Local serve (optional):

```bash
supabase functions serve tryon-request --no-verify-jwt
```

## Run the extension

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click **Load unpacked** and choose `/extension`
4. Edit `extension/config.js` with your Supabase project URL
5. Visit a product page
6. Click **Try with VTO**

## E2E test (manual)

### A) Verify function directly

```bash
curl -i -X POST "https://<PROJECT>.supabase.co/functions/v1/tryon-request" \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl":"https://example.com/product/123",
    "imageUrl":"https://picsum.photos/640/640",
    "title":"Demo Product",
    "price":"$49",
    "retailerDomain":"example.com"
  }'
```

Expected:
- `HTTP/1.1 200 OK`
- JSON body contains `resultImageUrl`

### B) Verify extension-to-function flow

1. Open any product page with product images.
2. Open DevTools for that tab and filter Network by `tryon-request`.
3. Click **Try with VTO**.
4. Confirm request payload includes exactly:
   - `pageUrl`
   - `imageUrl`
   - `title`
   - `price`
   - `retailerDomain`
5. Confirm response includes `resultImageUrl`.
6. Confirm overlay renders returned image.

## Troubleshooting

### CORS error in browser console

Symptoms:
- `blocked by CORS policy`
- preflight (`OPTIONS`) fails

Checks/fix:
- Ensure `supabase/functions/tryon-request/index.ts` handles `OPTIONS`.
- Ensure CORS headers include:
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: ... content-type`
  - `Access-Control-Allow-Origin` supports extension origins.
- Current implementation allows all origins and echoes `chrome-extension://...` origin when present.

### 401 Unauthorized from tryon-request

Symptoms:
- Request succeeds to endpoint but returns 401.

Checks/fix:
- Ensure `supabase/config.toml` has:
  - `[functions.tryon-request]`
  - `verify_jwt = false`
- Redeploy function after config changes.

### "Could not detect a product image" in extension

Symptoms:
- Button appears, but click shows no-image alert.

Checks/fix:
- Page may lazy-load images or hide product image in shadow DOM.
- Confirm page exposes `og:image` meta tag or visible product `<img>`.
- Refresh page after images have loaded.

## MVP acceptance checklist

- [ ] Extension button appears on product pages
- [ ] Clicking button sends request to `tryon-request`
- [ ] Function responds with `resultImageUrl`
- [ ] Overlay displays result image

## Scope

Cashback/wallet is out of scope for this MVP. Focus is only extension ↔ try-on function ↔ overlay preview.

## GitHub troubleshooting: "Failed to update PR"

If GitHub shows **Failed to update PR**, it is usually one of these:

1. The branch is not pushed to `origin` yet.
2. Your local branch name is different from the PR branch.
3. You do not have push permission to the repo.
4. A network/proxy blocks git push.

Run:

```bash
git status --short --branch
git remote -v
git branch -vv
git push -u origin main
```

If push fails with a tunnel/proxy error (for example `CONNECT tunnel failed, response 403`),
perform the push from a machine with direct GitHub access.

If the PR still exists but won’t update, push to the exact source branch used by that PR.
You can verify source branch in GitHub PR UI under the PR header (e.g. `main <- feature-branch`).

