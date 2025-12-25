const track = document.querySelector(".scroll-track");
const thumb = document.querySelector(".scroll-thumb");

if (track && thumb) {
  let isDragging = false;
  let dragOffsetY = 0;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getDocScrollInfo() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight;
    const clientHeight = doc.clientHeight;
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    return { scrollTop, scrollHeight, clientHeight, maxScroll };
  }

    function setThumbSize() {
    thumb.style.height = "67px";
    }

  function syncThumbToScroll() {
    const { scrollTop, maxScroll } = getDocScrollInfo();
    const trackH = track.clientHeight;
    const thumbH = thumb.offsetHeight;
    const maxThumbTop = Math.max(1, trackH - thumbH);
    const y = (scrollTop / maxScroll) * maxThumbTop;
    thumb.style.transform = `translateY(${y}px)`;
  }

  function scrollToThumbPosition(clientY) {
    const rect = track.getBoundingClientRect();
    const trackY = clientY - rect.top;
    const trackH = track.clientHeight;
    const thumbH = thumb.offsetHeight;
    const maxThumbTop = Math.max(1, trackH - thumbH);
    const thumbTop = clamp(trackY - dragOffsetY, 0, maxThumbTop);
    const { maxScroll } = getDocScrollInfo();
    const scrollTop = (thumbTop / maxThumbTop) * maxScroll;
    window.scrollTo({ top: scrollTop, behavior: "auto" });
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
    const thumbRect = thumb.getBoundingClientRect();
    dragOffsetY = e.clientY - thumbRect.top;
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

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  window.addEventListener("scroll", syncThumbToScroll, { passive: true });

  window.addEventListener("resize", () => {
    setThumbSize();
    syncThumbToScroll();
  });

  setThumbSize();
  syncThumbToScroll();
}