const track = document.querySelector(".scroll-track");
const thumb = document.querySelector(".scroll-thumb");

if (track && thumb) {
  const doc = document.documentElement;
  let isDragging = false;
  let dragOffsetY = 0;
  let maxScroll = 1;
  let maxThumbTop = 1;
  let rafId = 0;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getScrollTop() {
    return window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
  }

  function refreshScrollBounds() {
    maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
  }

  function setThumbSize() {
    // Preserve the current visual behavior (fixed thumb size across pages).
    thumb.style.height = "67px";
    maxThumbTop = Math.max(1, track.clientHeight - thumb.offsetHeight);
  }

  function renderThumb() {
    rafId = 0;
    refreshScrollBounds();
    const y = (getScrollTop() / maxScroll) * maxThumbTop;
    thumb.style.transform = `translateY(${y}px)`;
  }

  function scheduleThumbSync() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(renderThumb);
  }

  function scrollToThumbPosition(clientY) {
    const rect = track.getBoundingClientRect();
    const trackY = clientY - rect.top;
    const thumbTop = clamp(trackY - dragOffsetY, 0, maxThumbTop);

    refreshScrollBounds();
    const scrollTop = (thumbTop / maxThumbTop) * maxScroll;
    window.scrollTo(0, scrollTop);
  }

  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    dragOffsetY = thumb.offsetHeight / 2;
    scrollToThumbPosition(e.clientY);
    e.preventDefault();
  });

  thumb.addEventListener("pointerdown", (e) => {
    isDragging = true;
    thumb.setPointerCapture(e.pointerId);
    dragOffsetY = e.clientY - thumb.getBoundingClientRect().top;
    e.preventDefault();
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      if (!isDragging) return;
      scrollToThumbPosition(e.clientY);
      e.preventDefault();
    },
    { passive: false }
  );

  function stopDragging() {
    isDragging = false;
  }

  window.addEventListener("pointerup", stopDragging);
  window.addEventListener("pointercancel", stopDragging);
  thumb.addEventListener("lostpointercapture", stopDragging);

  window.addEventListener("scroll", scheduleThumbSync, { passive: true });
  window.addEventListener("resize", () => {
    setThumbSize();
    scheduleThumbSync();
  });
  window.addEventListener("load", () => {
    setThumbSize();
    scheduleThumbSync();
  });

  setThumbSize();
  scheduleThumbSync();
}
