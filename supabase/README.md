# Supabase Functions

## tryon-request

- Path: `supabase/functions/tryon-request/index.ts`
- Auth: disabled for MVP (`verify_jwt = false` in `supabase/config.toml`)
- Response contract: `{ "resultImageUrl": "https://..." }`
- CORS: handles `OPTIONS` preflight and allows browser + extension calls.

### Deploy

```bash
supabase functions deploy tryon-request
```
