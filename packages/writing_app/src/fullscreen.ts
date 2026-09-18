type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const enterIcon = "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5";
const exitIcon = "M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5";

export const addFullscreenButton = (container: HTMLElement): void => {
  const fullscreenDocument = document as FullscreenDocument;
  const root = document.documentElement as FullscreenElement;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "writing-app__icon-button writing-app__fullscreen-button";

  const message = document.createElement("p");
  message.className = "writing-app__fullscreen-message";
  message.setAttribute("role", "status");
  message.hidden = true;
  let messageTimer: number | undefined;

  const isFullscreen = (): boolean => Boolean(
    document.fullscreenElement || fullscreenDocument.webkitFullscreenElement
  );

  const updateButton = (): void => {
    const active = isFullscreen();
    const label = active ? "Exit full screen" : "Enter full screen";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${active ? exitIcon : enterIcon}" /></svg>`;
  };

  const showMessage = (text: string): void => {
    window.clearTimeout(messageTimer);
    message.textContent = text;
    message.hidden = false;
    messageTimer = window.setTimeout(() => { message.hidden = true; }, 10000);
  };

  button.addEventListener("click", async () => {
    message.hidden = true;
    try {
      if (isFullscreen()) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          await fullscreenDocument.webkitExitFullscreen?.();
        }
      } else if (root.requestFullscreen && document.fullscreenEnabled !== false) {
        await root.requestFullscreen({ navigationUI: "hide" });
      } else if (root.webkitRequestFullscreen && fullscreenDocument.webkitFullscreenEnabled !== false) {
        await root.webkitRequestFullscreen();
      } else {
        showMessage("Full screen isn't available in this browser. For more screen space, use Add to Home Screen in your browser's share or menu options, then open the app from there.");
      }
    } catch {
      showMessage("Couldn't change full screen. Please try again.");
    }
    updateButton();
  });

  document.addEventListener("fullscreenchange", updateButton);
  document.addEventListener("webkitfullscreenchange", updateButton);
  updateButton();
  container.append(button, message);
};
