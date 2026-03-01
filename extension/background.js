// extension/background.js
import {
  SUPABASE_FUNCTIONS_BASE,
  SUPABASE_ANON_KEY,
  TRYON_FUNCTION
} from "./config.js";

/**
 * Calls Supabase Edge Function: POST /functions/v1/tryon-request
 * IMPORTANT: Supabase requires apikey + Authorization header.
 * For MVP, we use Authorization: Bearer <anon_key>
 */
async function callTryOn(payload) {
  const url = `${SUPABASE_FUNCTIONS_BASE}/${TRYON_FUNCTION}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore JSON parse fail, will handle below
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      text ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  if (!data || !data.resultImageUrl) {
    throw new Error("Backend response missing resultImageUrl");
  }

  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message?.type !== "VTO_TRYON_REQUEST") {
        sendResponse({ ok: false, error: "Unknown message type" });
        return;
      }

      // Expected payload from content script
      const payload = message.payload;

      // Minimal validation to avoid sending garbage
      if (!payload?.pageUrl || !payload?.imageUrl || !payload?.title || !payload?.retailerDomain) {
        sendResponse({ ok: false, error: "Missing required payload fields" });
        return;
      }

      const data = await callTryOn(payload);
      sendResponse({ ok: true, resultImageUrl: data.resultImageUrl, debug: data.inputEcho ?? null });
    } catch (err) {
      sendResponse({ ok: false, error: err?.message || String(err) });
    }
  })();

  // Keep the message channel open for async response
  return true;
});
