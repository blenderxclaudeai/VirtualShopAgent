(function initVirtualShopAgent() {
  if (window.__VSA_LOADED__) return;
  window.__VSA_LOADED__ = true;

  function getMetaValue(propertyName) {
    const node = document.querySelector(`meta[property='${propertyName}'], meta[name='${propertyName}']`);
    return node?.getAttribute("content")?.trim() || "";
  }

  function getLargestImage() {
    const images = Array.from(document.querySelectorAll("img"));
    let best = null;
    let bestScore = 0;

    for (const img of images) {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.width > 80 && rect.height > 80 && rect.bottom > 0 && rect.right > 0;
      if (!isVisible) continue;

      const naturalArea = (img.naturalWidth || rect.width) * (img.naturalHeight || rect.height);
      if (naturalArea > bestScore && img.src) {
        best = img;
        bestScore = naturalArea;
      }
    }

    return best;
  }

  function detectProductContext() {
    const ogImage = getMetaValue("og:image");
    const ogTitle = getMetaValue("og:title");
    const heading = document.querySelector("h1")?.textContent?.trim() || "";
    const priceNode = document.querySelector("[itemprop='price'], .price, [data-price]");
    const fallbackImage = getLargestImage();

    return {
      pageUrl: window.location.href,
      imageUrl: ogImage || fallbackImage?.currentSrc || fallbackImage?.src || "",
      title: ogTitle || heading || document.title,
      price: priceNode?.textContent?.trim() || "",
      retailerDomain: window.location.hostname
    };
  }

  const button = document.createElement("button");
  button.textContent = "Try with VTO";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 16px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    zIndex: "2147483647"
  });

  function createOverlay() {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0, 0, 0, 0.72)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "2147483647"
    });

    const panel = document.createElement("div");
    Object.assign(panel.style, {
      background: "#fff",
      color: "#111",
      borderRadius: "14px",
      padding: "16px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflow: "auto"
    });

    const status = document.createElement("p");
    status.textContent = "Loading preview...";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => overlay.remove());
    closeButton.style.marginBottom = "12px";

    panel.append(closeButton, status);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    return { overlay, panel, status };
  }

  button.addEventListener("click", () => {
    const payload = detectProductContext();
    if (!payload.imageUrl) {
      alert("Could not detect a product image on this page.");
      return;
    }

    const { panel, status } = createOverlay();

    chrome.runtime.sendMessage({ type: "VTO_RENDER", payload }, (response) => {
      if (!response?.ok || !response.resultImageUrl) {
        status.textContent = response?.error || "Failed to generate preview.";
        return;
      }

      status.remove();
      const image = document.createElement("img");
      image.src = response.resultImageUrl;
      image.alt = `AI try-on for ${payload.title}`;
      image.style.maxWidth = "80vw";
      image.style.maxHeight = "75vh";
      panel.appendChild(image);
    });
  });

  document.body.appendChild(button);
})();
