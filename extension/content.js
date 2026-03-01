(function initVirtualShopAgent() {
  if (window.__VSA_LOADED__) return;
  window.__VSA_LOADED__ = true;

  const productImage = document.querySelector('img');
  if (!productImage) return;

  const button = document.createElement('button');
  button.textContent = 'Try with VTO';
  button.style.position = 'fixed';
  button.style.bottom = '24px';
  button.style.right = '24px';
  button.style.padding = '12px 16px';
  button.style.background = '#111';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '2147483647';

  button.addEventListener('click', () => {
    const payload = {
      product_url: window.location.href,
      product_title: document.title,
      product_image_url: productImage.src,
      category_hint: 'auto'
    };

    chrome.runtime.sendMessage({ type: 'VTO_RENDER', payload }, (response) => {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.75)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '2147483647';

      const panel = document.createElement('div');
      panel.style.background = '#fff';
      panel.style.padding = '16px';
      panel.style.borderRadius = '12px';
      panel.style.maxWidth = '90vw';

      const close = document.createElement('button');
      close.textContent = 'Close';
      close.style.marginBottom = '8px';
      close.addEventListener('click', () => overlay.remove());

      const image = document.createElement('img');
      image.style.maxWidth = '80vw';
      image.style.maxHeight = '80vh';

      if (response?.ok && response.data?.result_image_url) {
        image.src = response.data.result_image_url;
      } else {
        const errorText = document.createElement('p');
        errorText.textContent = response?.error || 'Failed to generate preview';
        panel.appendChild(errorText);
      }

      panel.appendChild(close);
      panel.appendChild(image);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
    });
  });

  document.body.appendChild(button);
})();
