importScripts("config.js");

const API_BASE_URL = `${VSA_CONFIG.supabaseUrl}/functions/v1/${VSA_CONFIG.tryonFunctionName}`;

function buildTryOnPayload(rawPayload = {}) {
  return {
    pageUrl: rawPayload.pageUrl || "",
    imageUrl: rawPayload.imageUrl || "",
    title: rawPayload.title || "",
    price: rawPayload.price || "",
    retailerDomain: rawPayload.retailerDomain || ""
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "VTO_RENDER") return;

  (async () => {
    try {
      const payload = buildTryOnPayload(message.payload);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || `Render request failed: ${response.status}`);
      }

      if (!data?.resultImageUrl) {
        throw new Error("Invalid function response: missing resultImageUrl");
      }

      sendResponse({ ok: true, resultImageUrl: data.resultImageUrl });
    } catch (error) {
      sendResponse({ ok: false, error: String(error) });
    }
  })();

  return true;
});
