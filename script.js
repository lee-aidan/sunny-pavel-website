const track = document.querySelector(".scroll-track");
const thumb = document.querySelector(".scroll-thumb");

if (track && thumb) {
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const allowTouchScrollbar =
    document.body && document.body.classList.contains("home-body");

  if (!isFinePointer && !allowTouchScrollbar) {
    const indicator = document.querySelector(".scroll-indicator");
    if (indicator) indicator.style.display = "none";
  } else {
  const doc = document.documentElement;
  const indicator = document.querySelector(".scroll-indicator");
  let isDragging = false;
  let dragOffsetY = 0;
  let maxScroll = 1;
  let maxThumbTop = 1;
  let rafId = 0;
  let trackTop = 0;
  let moveHandler = null;
  let upHandler = null;
  let isEnabled = true;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getScrollTop() {
    return window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
  }

  function refreshScrollBounds() {
    maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
    isEnabled = doc.scrollHeight > doc.clientHeight + 1;
    if (indicator) {
      indicator.style.display = isEnabled ? "" : "none";
    }
  }

  function setThumbSize() {
    // Preserve the current visual behavior (fixed thumb size across pages).
    thumb.style.height = "67px";
    maxThumbTop = Math.max(1, track.clientHeight - thumb.offsetHeight);
  }

  function cacheTrackBounds() {
    trackTop = track.getBoundingClientRect().top;
  }

  function renderThumb() {
    rafId = 0;
    if (document.visibilityState !== "visible") return;
    refreshScrollBounds();
    if (!isEnabled) return;
    const y = (getScrollTop() / maxScroll) * maxThumbTop;
    thumb.style.transform = `translateY(${y}px)`;
  }

  function scheduleThumbSync() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(renderThumb);
  }

  function scrollToThumbPosition(clientY) {
    if (!isEnabled) return;
    const trackY = clientY - trackTop;
    const thumbTop = clamp(trackY - dragOffsetY, 0, maxThumbTop);

    refreshScrollBounds();
    const scrollTop = (thumbTop / maxThumbTop) * maxScroll;
    window.scrollTo(0, scrollTop);
  }

  track.addEventListener("pointerdown", (e) => {
    if (!isEnabled) return;
    if (e.target === thumb) return;
    cacheTrackBounds();
    dragOffsetY = thumb.offsetHeight / 2;
    scrollToThumbPosition(e.clientY);
    e.preventDefault();
  });

  thumb.addEventListener("pointerdown", (e) => {
    if (!isEnabled) return;
    isDragging = true;
    thumb.classList.add("is-dragging");
    thumb.setPointerCapture(e.pointerId);
    cacheTrackBounds();
    dragOffsetY = e.clientY - thumb.getBoundingClientRect().top;
    moveHandler = (ev) => {
      if (!isDragging) return;
      scrollToThumbPosition(ev.clientY);
      ev.preventDefault();
    };
    upHandler = () => {
      stopDragging();
    };
    window.addEventListener("pointermove", moveHandler, { passive: false });
    window.addEventListener("pointerup", upHandler);
    window.addEventListener("pointercancel", upHandler);
    e.preventDefault();
  });

  function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    thumb.classList.remove("is-dragging");
    if (moveHandler) {
      window.removeEventListener("pointermove", moveHandler);
      moveHandler = null;
    }
    if (upHandler) {
      window.removeEventListener("pointerup", upHandler);
      window.removeEventListener("pointercancel", upHandler);
      upHandler = null;
    }
  }

  thumb.addEventListener("lostpointercapture", stopDragging);

  window.addEventListener("scroll", scheduleThumbSync, { passive: true });
  window.addEventListener("resize", () => {
    setThumbSize();
    cacheTrackBounds();
    scheduleThumbSync();
  });
  window.addEventListener("load", () => {
    setThumbSize();
    cacheTrackBounds();
    scheduleThumbSync();
  });
  document.addEventListener("visibilitychange", scheduleThumbSync, {
    passive: true,
  });

  setThumbSize();
  cacheTrackBounds();
  scheduleThumbSync();
  }
}
