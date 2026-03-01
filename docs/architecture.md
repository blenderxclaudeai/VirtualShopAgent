# Arkitektur: VirtualShopAgent

## Mål

- Ge användaren realistisk förhandsvisning av produkter i personlig kontext.
- Fungera utan butiksintegration.
- Vara säker-by-design med tydlig dataseparation.

## Huvudkomponenter

### 1) Browser extension (klient)

**Ansvar:**
- Detektera produktsidor.
- Extrahera kandidatbild + metadata (titel, URL).
- Rendera knapp och overlay.
- Anropa backend med användarens token.

**Moduler:**
- `content.js`: DOM-scanning, CTA-injektion, overlay.
- `background.js`: tokenhantering, API-anrop.
- `popup.html`: enkel statusvy och inloggning.

### 2) Backend API (server)

**Ansvar:**
- Konto/autentisering.
- Lagring av användarens referensbilder.
- Orkestrering av AI-rendering.
- Returnera renderat resultat.

**Föreslagna endpoints:**
- `POST /auth/login`
- `GET /profile`
- `POST /profile/images`
- `POST /vto/render`
- `GET /health`

### 3) AI-render pipeline

**Ansvar:**
- Pre-processing av produkt- och användarbilder.
- Modellinferens (plagg/accessoar/rum).
- Post-processing + kvalitetskontroll.

## Dataflöde

1. Extensionen hittar produktbild på sidan.
2. Användaren klickar "Try with VTO".
3. Extensionen skickar payload till backend:
   - `product_url`
   - `product_title`
   - `product_image_url`
   - `category_hint`
4. Backend hämtar användarens uppladdade referensbilder.
5. Backend kör AI-pipeline och returnerar `result_image_url`.
6. Extensionen visar resultatet i overlay.

## Säkerhet & integritet

- Kryptera data i transit (TLS) och i vila.
- Minimerad datalagring (policy-baserad retention).
- Signed URL för bildaccess.
- Rollbaserad åtkomst och audit-loggar.
- Moderation och skydd mot prompt/image-abuse.

## Skalbarhet

- API-lager stateless bakom load balancer.
- Job queue för rendering (asynkront).
- Cache för vanliga produktbilder.
- CDN för resultatbilder.

## Mätetal

- `render_success_rate`
- `median_render_latency`
- `try_button_ctr`
- `conversion_lift_estimate`
- `return_rate_delta` (på sikt)
