// extension/content.js

(function () {
  const BTN_ID = "vto-try-btn";
  const OVERLAY_ID = "vto-overlay";

  function getBestImageUrl() {
    // 1) Prefer og:image
    const og = document.querySelector('meta[property="og:image"]');
    if (og?.content) return og.content;

    // 2) Otherwise pick largest visible img
    const imgs = Array.from(document.images || []);
    let best = null;
    let bestScore = 0;

    for (const img of imgs) {
      const rect = img.getBoundingClientRect();
      const visible = rect.width > 80 && rect.height > 80 && rect.bottom > 0 && rect.right > 0;
      if (!visible) continue;

      const score = rect.width * rect.height;
      if (score > bestScore && img.currentSrc) {
        bestScore = score;
        best = img.currentSrc;
      } else if (score > bestScore && img.src) {
        bestScore = score;
        best = img.src;
      }
    }

    return best;
  }

  function getTitle() {
    const ogt = document.querySelector('meta[property="og:title"]');
    if (ogt?.content) return ogt.content;
    const h1 = document.querySelector("h1");
    if (h1?.textContent?.trim()) return h1.textContent.trim();
    return document.title || "Product";
  }

  function ensureButton() {
    if (document.getElementById(BTN_ID)) return;

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.textContent = "Try with VTO";
    btn.style.position = "fixed";
    btn.style.right = "18px";
    btn.style.bottom = "18px";
    btn.style.zIndex = "2147483647";
    btn.style.padding = "12px 14px";
    btn.style.borderRadius = "999px";
    btn.style.border = "0";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 10px 25px rgba(0,0,0,0.18)";
    btn.style.font = "600 14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    btn.style.background = "#111";
    btn.style.color = "#fff";

    btn.addEventListener("click", onTryClick);

    document.documentElement.appendChild(btn);
  }

  function showOverlay({ loadingText, imageUrl, errorText }) {
    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.zIndex = "2147483647";
      overlay.style.background = "rgba(0,0,0,0.55)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });

      document.documentElement.appendChild(overlay);
    }

    overlay.innerHTML = "";

    const card = document.createElement("div");
    card.style.width = "min(520px, 92vw)";
    card.style.maxHeight = "86vh";
    card.style.overflow = "auto";
    card.style.background = "#fff";
    card.style.borderRadius = "16px";
    card.style.boxShadow = "0 25px 60px rgba(0,0,0,0.35)";
    card.style.padding = "16px";
    card.style.font = "14px system-ui, -apple-system, Segoe UI, Roboto, Arial";

    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.alignItems = "center";
    top.style.marginBottom = "10px";

    const title = document.createElement("div");
    title.textContent = "VTO Preview";
    title.style.fontWeight = "700";

    const close = document.createElement("button");
    close.textContent = "✕";
    close.style.border = "0";
    close.style.background = "transparent";
    close.style.cursor = "pointer";
    close.style.fontSize = "18px";
    close.addEventListener("click", () => overlay.remove());

    top.appendChild(title);
    top.appendChild(close);
    card.appendChild(top);

    if (loadingText) {
      const p = document.createElement("div");
      p.textContent = loadingText;
      p.style.padding = "10px 0";
      card.appendChild(p);
    }

    if (errorText) {
      const p = document.createElement("div");
      p.textContent = errorText;
      p.style.padding = "10px 0";
      p.style.color = "crimson";
      p.style.fontWeight = "600";
      card.appendChild(p);
    }

    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "VTO Result";
      img.style.width = "100%";
      img.style.borderRadius = "12px";
      img.style.display = "block";
      card.appendChild(img);
    }

    overlay.appendChild(card);
  }

  async function onTryClick() {
    const imageUrl = getBestImageUrl();
    const title = getTitle();
    const pageUrl = location.href;
    const retailerDomain = location.hostname;

    if (!imageUrl) {
      showOverlay({ errorText: "Could not find a product image on this page." });
      return;
    }

    showOverlay({ loadingText: "Loading preview…" });

    chrome.runtime.sendMessage(
      {
        type: "VTO_TRYON_REQUEST",
        payload: {
          pageUrl,
          imageUrl,
          title,
          price: "",
          retailerDomain
        }
      },
      (resp) => {
        const err = chrome.runtime.lastError;
        if (err) {
          showOverlay({ errorText: `Extension error: ${err.message}` });
          return;
        }
        if (!resp?.ok) {
          showOverlay({ errorText: resp?.error || "Request failed" });
          return;
        }
        showOverlay({ imageUrl: resp.resultImageUrl });
      }
    );
  }

  // Inject button once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureButton);
  } else {
    ensureButton();
  }
})();
