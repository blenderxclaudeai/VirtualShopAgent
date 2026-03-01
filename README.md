# VirtualShopAgent

AI-driven browser extension för visual try-on (VTO) och "see-in-your-space" direkt på e-handelssidor.

## Vad projektet gör

VirtualShopAgent lägger ett visuellt lager ovanpå befintliga e-handelswebbplatser utan att kräva integration från butiken. Extensionen:

1. Identifierar produktinformation på sidan (titel, URL, produktbild).
2. Visar en CTA ("Try with VTO").
3. Skickar produktdata + användarens profilbilder till backend.
4. Hämtar AI-genererad rendering.
5. Visar resultat i en overlay ovanpå butikens sida.

## Monorepo-struktur

- `extension/` – Browser extension (MV3) som injicerar UI och anropar backend.
- `backend/` – FastAPI-backend för auth, profilbilder och VTO-jobb.
- `docs/` – Arkitektur, roadmap och säkerhetsprinciper.

## MVP-flöde

1. Användaren skapar konto i extension-popup.
2. Användaren laddar upp bilder (ansikte/kropp/rum).
3. Extensionen detekterar produktsidor och visar knapp.
4. Klick startar VTO-anrop till backend.
5. Backend returnerar en renderad bild-URL.
6. Extensionen visar resultat i overlay.

## Nästa steg

- Koppla in riktig identitetsleverantör (Auth0/Clerk/Cognito).
- Byta mockad AI-render till produktionsmodell.
- Implementera robust produktdetektion per butikstyp.
- Bygga observability (trace-id, metrics, latency budgets).

Se `docs/architecture.md` för detaljerad systemdesign.
