const API_BASE_URL = "http://localhost:8000";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "VTO_RENDER") return;

  (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vto/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message.payload)
      });

      if (!response.ok) {
        throw new Error(`Render request failed: ${response.status}`);
      }

      const data = await response.json();
      sendResponse({ ok: true, data });
    } catch (error) {
      sendResponse({ ok: false, error: String(error) });
    }
  })();

  return true;
});
