(function () {
  const shells = document.querySelectorAll('.app-frame-shell[data-src]');

  shells.forEach(function (shell) {
    const frame = shell.querySelector('iframe');
    const loadingPanel = shell.querySelector('.loading-panel');
    const loadingMessage = shell.querySelector('[data-role="loading-message"]');
    const fallbackPanel = shell.querySelector('[data-role="fallback"]');
    const reloadButton = shell.closest('.app-shell')?.querySelector('[data-role="reload"]');
    const retryButton = shell.querySelector('[data-role="retry"]');

    if (!frame) {
      return;
    }

    const src = shell.dataset.src;
    const initialMessage = shell.dataset.loadingText || 'Waiting for the embedded app to respond.';
    const slowMessage = shell.dataset.slowText || 'The server is still waking up.';
    const timeoutMs = Number(shell.dataset.timeoutMs || 20000);

    let fallbackTimer = null;
    let messageTimer = null;
    let currentRequestId = 0;

    function clearTimers() {
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      if (messageTimer) {
        window.clearTimeout(messageTimer);
        messageTimer = null;
      }
    }

    function showLoadingPanel() {
      if (loadingPanel) {
        loadingPanel.hidden = false;
      }
      if (fallbackPanel) {
        fallbackPanel.hidden = true;
      }
    }

    function startLoadingState() {
      clearTimers();
      shell.dataset.state = 'loading';
      showLoadingPanel();
      frame.style.opacity = '0';

      if (loadingMessage) {
        loadingMessage.textContent = initialMessage;
      }

      messageTimer = window.setTimeout(function () {
        if (shell.dataset.state === 'loading' && loadingMessage) {
          loadingMessage.textContent = slowMessage;
        }
      }, 6000);

      fallbackTimer = window.setTimeout(function () {
        if (shell.dataset.state !== 'loading') {
          return;
        }

        shell.dataset.state = 'timeout';

        if (loadingPanel) {
          loadingPanel.hidden = true;
        }

        if (fallbackPanel) {
          fallbackPanel.hidden = false;
        }
      }, timeoutMs);
    }

    function handleLoadedState(requestId) {
      if (requestId !== currentRequestId) {
        return;
      }

      clearTimers();
      shell.dataset.state = 'loaded';

      if (loadingPanel) {
        loadingPanel.hidden = true;
      }

      if (fallbackPanel) {
        fallbackPanel.hidden = true;
      }

      frame.style.opacity = '1';
    }

    function reloadFrame() {
      currentRequestId += 1;
      const requestId = currentRequestId;

      startLoadingState();

      const glue = src.indexOf('?') > -1 ? '&' : '?';
      frame.src = src + glue + 'cacheBust=' + Date.now();

      const onLoad = function () {
        frame.removeEventListener('load', onLoad);
        window.requestAnimationFrame(function () {
          handleLoadedState(requestId);
        });
      };

      frame.addEventListener('load', onLoad);
    }

    if (reloadButton) {
      reloadButton.addEventListener('click', reloadFrame);
    }

    if (retryButton) {
      retryButton.addEventListener('click', reloadFrame);
    }

    reloadFrame();
  });
})();
