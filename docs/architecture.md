# Architecture: VirtualShopAgent (Supabase-first MVP)

## Goal

Provide realistic try-on previews directly on ecommerce pages without merchant checkout integration.

## Components

### 1) Chrome Extension (`/extension`)

Responsibilities:
- Detect product context from page DOM/metadata.
- Inject `Try with VTO` CTA.
- Send payload to Supabase Edge Function.
- Render returned `resultImageUrl` in overlay.

Payload sent by extension:

```json
{
  "pageUrl": "...",
  "imageUrl": "...",
  "title": "...",
  "price": "",
  "retailerDomain": "..."
}
```

### 2) Supabase Edge Function (`/supabase/functions/tryon-request`)

Responsibilities:
- Handle CORS (`OPTIONS` + `POST`).
- Validate request payload.
- Return stable response contract:

```json
{
  "resultImageUrl": "https://..."
}
```

MVP mode allows anonymous requests (`verify_jwt = false`).

### 3) Web Dashboard (`/web`)

Responsibilities:
- Host future user profile/image upload UX.
- Display request history and account state (future phases).

## Data flow

1. User opens product page.
2. Extension extracts product metadata + image.
3. User clicks `Try with VTO`.
4. Extension `background.js` calls Supabase function.
5. Function responds with `resultImageUrl`.
6. Extension overlay renders image.

## Security & privacy (MVP)

- No secret keys in extension.
- CORS enabled for extension requests.
- Optional auth in later phases.
- Keep data minimization and retention controls for production rollout.
