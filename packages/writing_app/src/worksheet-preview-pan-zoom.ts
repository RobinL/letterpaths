type WorksheetPreviewPanZoomOptions = {
  viewport: HTMLElement;
  frame: HTMLElement;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
};

type PointerPosition = {
  clientX: number;
  clientY: number;
  pointerType: string;
};

export type WorksheetPreviewPanZoom = {
  zoomBy: (amount: number) => void;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const distanceBetween = (first: PointerPosition, second: PointerPosition): number =>
  Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);

const midpointBetween = (first: PointerPosition, second: PointerPosition) => ({
  clientX: (first.clientX + second.clientX) / 2,
  clientY: (first.clientY + second.clientY) / 2
});

export const setupWorksheetPreviewPanZoom = ({
  viewport,
  frame,
  getZoom,
  setZoom,
  minZoom,
  maxZoom,
  zoomStep
}: WorksheetPreviewPanZoomOptions): WorksheetPreviewPanZoom => {
  const pointers = new Map<number, PointerPosition>();
  let lastPanPosition: PointerPosition | null = null;
  let pinchStartDistance = 0;
  let pinchStartZoom = getZoom();
  let wheelZoomTarget = getZoom();

  const zoomAt = (clientX: number, clientY: number, requestedZoom: number) => {
    const previousZoom = getZoom();
    const nextZoom = clamp(requestedZoom, minZoom, maxZoom);
    if (nextZoom === previousZoom) {
      wheelZoomTarget = nextZoom;
      return;
    }

    const previousFrameRect = frame.getBoundingClientRect();
    const anchorX = previousFrameRect.width
      ? (clientX - previousFrameRect.left) / previousFrameRect.width
      : 0.5;
    const anchorY = previousFrameRect.height
      ? (clientY - previousFrameRect.top) / previousFrameRect.height
      : 0.5;

    setZoom(nextZoom);

    const nextFrameRect = frame.getBoundingClientRect();
    viewport.scrollLeft +=
      nextFrameRect.left + anchorX * nextFrameRect.width - clientX;
    viewport.scrollTop +=
      nextFrameRect.top + anchorY * nextFrameRect.height - clientY;
    wheelZoomTarget = nextZoom;
  };

  const zoomAtViewportCenter = (requestedZoom: number) => {
    const viewportRect = viewport.getBoundingClientRect();
    zoomAt(
      viewportRect.left + viewportRect.width / 2,
      viewportRect.top + viewportRect.height / 2,
      requestedZoom
    );
  };

  viewport.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      if (Math.abs(getZoom() - wheelZoomTarget) > zoomStep) {
        wheelZoomTarget = getZoom();
      }
      wheelZoomTarget = clamp(
        wheelZoomTarget - event.deltaY * 0.1,
        minZoom,
        maxZoom
      );
      zoomAt(event.clientX, event.clientY, wheelZoomTarget);
    },
    { passive: false }
  );

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    viewport.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType
    });

    const activePointers = [...pointers.values()];
    if (activePointers.length === 1) {
      lastPanPosition = activePointers[0];
      viewport.classList.add("worksheet-app__preview-viewport--dragging");
    } else if (activePointers.length === 2) {
      pinchStartDistance = distanceBetween(activePointers[0], activePointers[1]);
      pinchStartZoom = getZoom();
      lastPanPosition = null;
    }
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) {
      return;
    }

    const previousPosition = pointers.get(event.pointerId);
    const nextPosition: PointerPosition = {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType
    };
    pointers.set(event.pointerId, nextPosition);

    const activePointers = [...pointers.values()];
    if (activePointers.length === 2 && pinchStartDistance > 0) {
      const pinchDistance = distanceBetween(activePointers[0], activePointers[1]);
      const midpoint = midpointBetween(activePointers[0], activePointers[1]);
      zoomAt(
        midpoint.clientX,
        midpoint.clientY,
        pinchStartZoom * (pinchDistance / pinchStartDistance)
      );
      return;
    }

    if (activePointers.length === 1 && lastPanPosition && previousPosition) {
      viewport.scrollLeft -= nextPosition.clientX - previousPosition.clientX;
      viewport.scrollTop -= nextPosition.clientY - previousPosition.clientY;
      lastPanPosition = nextPosition;
    }
  });

  const endPointer = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    const activePointers = [...pointers.values()];
    if (activePointers.length === 1) {
      lastPanPosition = activePointers[0];
      pinchStartDistance = 0;
      pinchStartZoom = getZoom();
    } else if (activePointers.length === 0) {
      lastPanPosition = null;
      pinchStartDistance = 0;
      viewport.classList.remove("worksheet-app__preview-viewport--dragging");
    }
  };

  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAtViewportCenter(getZoom() + zoomStep);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomAtViewportCenter(getZoom() - zoomStep);
    }
  });

  return {
    zoomBy: (amount: number) => zoomAtViewportCenter(getZoom() + amount)
  };
};
